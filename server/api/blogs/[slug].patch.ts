import { createError, defineEventHandler, readBody } from 'h3';
import { prisma } from '~~/server/config/database/prisma';
import { BlogsRepository } from '../../repositories/blogs.repository';
import { UpdatePostService } from '../../services/update-post.service';
import { UpdatePostController } from '../../controllers/update-post.controller';

const repository = new BlogsRepository(prisma);
const service = new UpdatePostService(repository);
const controller = new UpdatePostController(service);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const slug = (event.context.params as any)?.slug as string;

  try {
    if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' });

    const existing = await repository.findBySlug(slug);
    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Post not found' });

    const updated = await controller.handle(existing.id, body);

    return updated;
  } catch (error: any) {
    const message = error.errors?.[0]?.message || error.message || 'Failed to update post';
    throw createError({ statusCode: 400, statusMessage: message });
  }
});
