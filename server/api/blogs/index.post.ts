import {
  createError,
  defineEventHandler,
  readBody,
  setResponseStatus,
} from "h3";
import { prisma } from "~~/server/config/database/prisma";
import { CreatePostController } from "../../controllers/create-post.controller";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { CreateBlogService } from "../../services/create-blog.service";

const repository = new BlogsRepository(prisma);
const service = new CreateBlogService(repository);
const controller = new CreatePostController(service);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const post = await controller.handle(body);

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
