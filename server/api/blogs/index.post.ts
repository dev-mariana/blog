import {
  createError,
  defineEventHandler,
  readBody,
  setResponseStatus,
} from "h3";
import { prisma } from "~~/server/config/database/prisma";
import { BlogsController } from "../../controllers/blogs.controller";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { BlogsService } from "../../services/blogs.service";

const repository = new BlogsRepository(prisma);
const service = new BlogsService(repository);
const controller = new BlogsController(service);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const post = await controller.createPost(body);

    setResponseStatus(event, 201);

    return post;
  } catch (error: any) {
    const message =
      error.errors?.[0]?.message || error.message || "Failed to create post";
    throw createError({
      statusCode: 400,
      statusMessage: message,
    });
  }
});
