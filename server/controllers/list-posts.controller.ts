import { ListPostsResponse } from "../dtos/list-posts.dto";
import { ListBlogsService } from "../services/list-blogs.service";

export class ListPostsController {
  constructor(private readonly listBlogsService: ListBlogsService) {}

  async handle(): Promise<ListPostsResponse[]> {
    const posts = await this.listBlogsService.execute();

    return posts;
  }
}
