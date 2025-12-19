"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(buffer: Buffer): Promise<string> {
  console.log("Starting Cloudinary upload...");
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: "workspaces" }, (error, result) => {
      if (error) {
        console.error("Cloudinary upload stream error:", error);
        return reject(error);
      }
      if (!result) {
        console.error("Cloudinary upload failed: No result");
        return reject(new Error("Upload failed"));
      }
      console.log("Cloudinary upload successful:", result.secure_url);
      resolve(result.secure_url);
    });
    uploadStream.end(buffer);
  });
}

export async function createWorkspace(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = (formData.get("category") as string) || "All";
  const image = formData.get("image") as File;
  const devicesJson = formData.get("devices") as string;

  if (!title || !image || image.size === 0 || !devicesJson) {
    return { error: "Missing required fields (including image)" };
  }

  let deviceList = [];
  try {
    deviceList = JSON.parse(devicesJson);
  } catch (e) {
    return { error: "Invalid device data" };
  }

  // Handle Image Upload to Cloudinary
  let imageUrl: string;
  try {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    imageUrl = await uploadToCloudinary(buffer);
  } catch (error) {
    console.error("Cloudinary upload error details:", error);
    return {
      error: "Failed to upload image to Cloudinary. Check your configuration.",
      title,
      description,
      devices: deviceList,
    };
  }

  try {
    await db.workspace.create({
      data: {
        userId: session.user.id,
        title,
        description,
        imageUrl,
        category,
        devices: {
          create: deviceList.map((d: any) => ({
            name: d.name,
            description: d.description,
            features: d.features || [],
            xPercent: d.xPercent,
            yPercent: d.yPercent,
            price: d.price !== "" && d.price !== null && d.price !== undefined ? parseFloat(d.price) : null,
            link: d.link,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Database error details:", error);
    return {
      error: "Failed to create workspace in database. " + (error as Error).message,
      title,
      description,
      devices: deviceList,
    };
  }

  redirect("/");
}

export async function updateWorkspace(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = (formData.get("category") as string) || "All";
  const image = formData.get("image") as File;
  const devicesJson = formData.get("devices") as string;

  if (!id || !title || !devicesJson) {
    return { error: "Missing required fields" };
  }

  // Verify ownership
  const existing = await db.workspace.findUnique({
    where: { id },
    select: { userId: true, imageUrl: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    return { error: "Unauthorized or not found" };
  }

  let deviceList = [];
  try {
    deviceList = JSON.parse(devicesJson);
  } catch (e) {
    return { error: "Invalid device data" };
  }

  let imageUrl = existing.imageUrl;

  // Handle Image Upload if a new one is provided
  if (image && image.size > 0) {
    try {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageUrl = await uploadToCloudinary(buffer);
    } catch (error) {
      console.error("Cloudinary upload error details:", error);
      return {
        error: "Failed to upload new image to Cloudinary.",
        id,
        title,
        description,
        devices: deviceList,
      };
    }
  }

  try {
    await db.$transaction([
      db.device.deleteMany({ where: { workspaceId: id } }),
      db.workspace.update({
        where: { id },
        data: {
          title,
          description,
          imageUrl,
          category,
          devices: {
            create: deviceList.map((d: any) => ({
              name: d.name,
              description: d.description,
              features: d.features || [],
              xPercent: d.xPercent,
              yPercent: d.yPercent,
              price: d.price !== "" && d.price !== null && d.price !== undefined ? parseFloat(d.price) : null,
              link: d.link,
            })),
          },
        },
      }),
    ]);
  } catch (error) {
    console.error("Database error details:", error);
    return {
      error: "Failed to update workspace in database. " + (error as Error).message,
      id,
      title,
      description,
      devices: deviceList,
    };
  }

  redirect("/profile");
}

export async function toggleLikeWorkspace(workspaceId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const existingLike = await db.like.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (existingLike) {
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { liked: false };
    } else {
      await db.like.create({
        data: {
          userId,
          workspaceId,
        },
      });
      return { liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { error: "Failed to toggle like" };
  }
}
