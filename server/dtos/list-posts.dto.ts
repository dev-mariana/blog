export class ListPostsResponse {
  id!: string;
  title!: string;
  slug!: string;
  image?: string;
  content?: string;
  published!: boolean;
  created_at!: Date;
  updated_at?: Date;
}
