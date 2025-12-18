"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleSaveWorkspace(workspaceId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const existing = await db.savedWorkspace.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (existing) {
      await db.savedWorkspace.delete({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });
      revalidatePath(`/workspace/${workspaceId}`);
      return { saved: false };
    } else {
      await db.savedWorkspace.create({
        data: {
          userId,
          workspaceId,
        },
      });
      revalidatePath(`/workspace/${workspaceId}`);
      return { saved: true };
    }
  } catch (error) {
    console.error("Save toggle error:", error);
    return { error: "Failed to toggle save status" };
  }
}

export async function getSavedStatus(workspaceId: string) {
  const session = await getSession();
  if (!session) return false;

  const existing = await db.savedWorkspace.findUnique({
    where: {
      userId_workspaceId: {
        userId: session.user.id,
        workspaceId,
      },
    },
  });

  return !!existing;
}
