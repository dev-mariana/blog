import { Post } from '../entities/post';

export interface IBlogsRepository {
  findAll(): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  create(data: Partial<Post>): Promise<Post>;
  update(id: string, data: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;
}
