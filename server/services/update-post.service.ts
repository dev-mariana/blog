import { Post } from '../entities/post';
import { IBlogsRepository } from '../repositories/blogs.interface';

export class UpdatePostService {
  constructor(private readonly blogsRepository: IBlogsRepository) {}

  async execute(id: string, data: Partial<Post>): Promise<Post> {
    const post = await this.blogsRepository.update(id, data);
    return post;
  }
}
