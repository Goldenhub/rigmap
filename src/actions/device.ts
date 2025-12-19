"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function toggleDeviceLike(deviceId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const existingLike = await db.deviceLike.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    });

    if (existingLike) {
      await db.deviceLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { liked: false };
    } else {
      await db.deviceLike.create({
        data: {
          userId,
          deviceId,
        },
      });
      return { liked: true };
    }
  } catch (error) {
    console.error("Error toggling device like:", error);
    return { error: "Failed to toggle like" };
  }
}

export async function toggleSaveDevice(deviceId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const existingSave = await db.savedDevice.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    });

    if (existingSave) {
      await db.savedDevice.delete({
        where: {
          id: existingSave.id,
        },
      });
      return { saved: false };
    } else {
      await db.savedDevice.create({
        data: {
          userId,
          deviceId,
        },
      });
      return { saved: true };
    }
  } catch (error) {
    console.error("Error toggling device save:", error);
    return { error: "Failed to toggle save" };
  }
}
