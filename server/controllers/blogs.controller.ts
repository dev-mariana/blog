import { z } from "zod";
import { CreatePostResponse } from "../dtos/create-post.dto";
import { BlogsService } from "../services/blogs.service";

export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  async createPost(data: unknown): Promise<CreatePostResponse> {
    const createPostBodySchema = z.object({
      title: z.string().min(1, "Title is required").max(255),
      slug: z.string().min(1, "Slug is required").max(255),
      image: z.string().optional(),
      content: z.string().optional(),
      published: z.boolean().default(false),
    });

    const validatedData = createPostBodySchema.parse(data);

    const post = await this.blogsService.execute(validatedData);

    return post;
  }
}
