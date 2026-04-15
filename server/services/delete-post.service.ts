import { IBlogsRepository } from '../repositories/blogs.interface';

export class DeletePostService {
  constructor(private readonly blogsRepository: IBlogsRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.blogsRepository.findById(id);
    if (!existing) {
      throw new Error('Post not found');
    }

    await this.blogsRepository.delete(id);
  }
}
