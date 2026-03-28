export class CreatePostRequest {
  title!: string;
  slug!: string;
  image?: string;
  content?: string;
  published!: boolean;
}

export class CreatePostResponse {
  id!: string;
  title!: string;
  slug!: string;
  image?: string;
  content?: string;
  published!: boolean;
  created_at!: Date;
  updated_at?: Date;
}
