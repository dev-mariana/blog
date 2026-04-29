import { Post } from "../entities/post";
import { IBlogsRepository } from "../repositories/blogs.interface";

export class CreateBlogService {
  constructor(private readonly blogsRepository: IBlogsRepository) {}

  async execute(data: Partial<Post>): Promise<Post> {
    const baseSlug = data.slug ?? "";
    let slug = baseSlug;
    let counter = 2;

    while (await this.blogsRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const post = await this.blogsRepository.create({ ...data, slug });
    return post;
  }
}
