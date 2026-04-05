import { createError, defineEventHandler } from 'h3';
import { prisma } from '~~/server/config/database/prisma';
import { BlogsRepository } from '../../repositories/blogs.repository';

const repository = new BlogsRepository(prisma);

export default defineEventHandler(async (event) => {
  const slug = (event.context.params as any)?.slug as string;

  try {
    if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' });

    const post = await repository.findBySlug(slug);

    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' });

    return post;
  } catch (error: any) {
    const message = error.message || 'Failed to get post';
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
