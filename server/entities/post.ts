export class Post {
  id!: string;
  title!: string;
  image?: string;
  slug!: string;
  content?: string;
  published!: boolean;
  created_at!: Date;
  updated_at?: Date;
}
