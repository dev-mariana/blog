import { createError, defineEventHandler } from 'h3';
import { prisma } from '~~/server/config/database/prisma';
import { BlogsRepository } from '../../../repositories/blogs.repository';

const repository = new BlogsRepository(prisma);

export default defineEventHandler(async (event) => {
  const id = (event.context.params as any)?.id as string;

  try {
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' });

    const post = await repository.findById(id);

    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' });

    return post;
  } catch (error: any) {
    const message = error.message || 'Failed to get post by id';
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
