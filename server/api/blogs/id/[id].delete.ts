import { createError, defineEventHandler, setResponseStatus } from "h3";
import { prisma } from "~~/server/config/database/prisma";
import { DeletePostController } from "../../../controllers/delete-post.controller";
import { BlogsRepository } from "../../../repositories/blogs.repository";
import { DeletePostService } from "../../../services/delete-post.service";

const repository = new BlogsRepository(prisma);
const service = new DeletePostService(repository);
const controller = new DeletePostController(service);

export default defineEventHandler(async (event) => {
  const id = (event.context.params as any)?.id as string;

  try {
    await controller.handle(id);

    setResponseStatus(event, 204);

    return { success: true };
  } catch (error: any) {
    const statusCode = error.message === "Post not found" ? 404 : 500;
    const message = error.message || "Failed to delete post";
    throw createError({ statusCode, statusMessage: message });
  }
});
