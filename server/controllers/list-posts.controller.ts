import { ListPostsResponse } from "../dtos/list-posts.dto";
import { ListPostsService } from "../services/list-posts.service";

export class ListPostsController {
  constructor(private readonly listBlogsService: ListPostsService) {}

  async handle(): Promise<ListPostsResponse[]> {
    const posts = await this.listBlogsService.execute();

    return posts;
  }
}
