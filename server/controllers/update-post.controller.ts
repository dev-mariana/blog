import { z } from 'zod';
import { UpdatePostRequest, UpdatePostResponse } from '../dtos/update-post.dto';
import { UpdateBlogsService } from '../services/update-blogs.service';

export class UpdatePostController {
  constructor(private readonly updateBlogsService: UpdateBlogsService) {}

  async handle(id: string, data: UpdatePostRequest): Promise<UpdatePostResponse> {
    const schema = z
      .object({
        title: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        image: z.string().optional(),
        content: z.string().optional(),
        published: z.boolean().optional(),
      })
      .refine((obj) => Object.keys(obj).length > 0, {
        message: 'At least one field must be provided to update',
      });

    const validated = schema.parse(data);

    const post = await this.updateBlogsService.execute(id, validated);

    return post;
  }
}
