import { Post } from "../entities/post";
import { IBlogsRepository } from "../repositories/blogs.interface";

export class BlogsService {
  constructor(private readonly blogsRepository: IBlogsRepository) {}

  async execute(data: Partial<Post>): Promise<Post> {
    const post = await this.blogsRepository.create(data);
    return post;
  }
}
