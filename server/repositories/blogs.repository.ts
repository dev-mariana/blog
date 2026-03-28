import { PrismaClient } from '@prisma/client';
import { Post } from '../entities/post';
import { generateId } from '../helpers/generate-id';
import { IBlogsRepository } from './blogs.interface';
import { BlogsMapper } from './mappers/blogs.mapper';

export class BlogsRepository implements IBlogsRepository {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async findAll(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany();
    return posts.map(BlogsMapper.toDomain);
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    return post ? BlogsMapper.toDomain(post) : null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
    });

    return post ? BlogsMapper.toDomain(post) : null;
  }

  async create(data: Partial<Post>): Promise<Post> {
    const id = generateId();
    const payload = BlogsMapper.toPrisma(data);
    
    const post = await this.prisma.post.create({
      data: {
        ...payload,
        id,
      } as Post,
    });

    return BlogsMapper.toDomain(post);
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const payload = BlogsMapper.toPrisma(data);

    const post = await this.prisma.post.update({
      where: { id },
      data: payload,
    });

    return BlogsMapper.toDomain(post);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });
  }
}
