import { Post as RawPost } from '@prisma/client';
import { Post } from '../../entities/post';

export class BlogsMapper {

  static toDomain(raw: RawPost): Post {
    return {
      id: raw.id,
      title: raw.title,
      image: raw.image ?? undefined,
      slug: raw.slug,
      content: raw.content ?? undefined,
      published: raw.published,
      created_at: raw.created_at,
      updated_at: raw.updated_at ?? undefined,
    };
  }

  static toPrisma(post: Partial<Post>) {
    return {
      id: post.id,
      title: post.title,
      image: post.image,
      slug: post.slug,
      content: post.content,
      published: post.published,
      created_at: post.created_at,
      updated_at: post.updated_at,
    };
  }
}
