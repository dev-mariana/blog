import { createError, defineEventHandler } from "h3";
import { prisma } from "~~/server/config/database/prisma";
import { ListPostsController } from "../../controllers/list-posts.controller";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { ListPostsService } from "../../services/list-posts.service";

const repository = new BlogsRepository(prisma);
const listService = new ListPostsService(repository);
const controller = new ListPostsController(listService);

export default defineEventHandler(async (event) => {
  try {
    const posts = await controller.handle();

    return posts;
  } catch (error: any) {
    const message = error.message || "Failed to list posts";
    throw createError({
      statusCode: 500,
      statusMessage: message,
    });
  }
});
