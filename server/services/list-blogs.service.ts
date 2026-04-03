import { Post } from '../entities/post';
import { IBlogsRepository } from '../repositories/blogs.interface';

export class ListBlogsService {
  constructor(private readonly blogsRepository: IBlogsRepository) {}

  async execute(): Promise<Post[]> {
    const posts = await this.blogsRepository.findAll();
    return posts;
  }
}
