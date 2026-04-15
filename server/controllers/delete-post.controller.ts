import { DeletePostService } from '../services/delete-post.service';

export class DeletePostController {
  constructor(private readonly deleteBlogService: DeletePostService) {}

  async handle(id: string): Promise<void> {
    if (!id) {
      throw new Error('Missing id');
    }

    await this.deleteBlogService.execute(id);
  }
}

// implement delete on screen
// implement a back button on create screen
// test all functionalities
// update readme