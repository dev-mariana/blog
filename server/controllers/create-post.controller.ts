import { z } from "zod";
import { CreatePostRequest, CreatePostResponse } from "../dtos/create-post.dto";
import { CreateBlogService } from "../services/create-blog.service";

export class CreatePostController {
  constructor(private readonly blogsService: CreateBlogService) {}

  async handle(data: CreatePostRequest): Promise<CreatePostResponse> {
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
