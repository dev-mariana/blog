import { createError, defineEventHandler } from "h3";
import { prisma } from "~~/server/config/database/prisma";
import { BlogsRepository } from "../../../repositories/blogs.repository";

const repository = new BlogsRepository(prisma);

export default defineEventHandler(async (event) => {
  const id = (event.context.params as any)?.id as string;

  try {
    if (!id)
      throw createError({ statusCode: 400, statusMessage: "Missing id" });

    const existing = await repository.findById(id);
    if (!existing)
      throw createError({ statusCode: 404, statusMessage: "Post not found" });

    await repository.delete(id);

    return { success: true };
  } catch (error: any) {
    const message = error.message || "Failed to delete post";
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
