import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}
  @Get() list(@Query('trackId') trackId: string) { return this.comments.listForTrack(trackId); }
  @Post() create(@Body() body: { trackId: string; authorId: string; text: string }) { return this.comments.create(body); }
  @Patch(':id/hide') hide(@Param('id') id: string, @Query('moderatorId') moderatorId: string) { return this.comments.hide(id, moderatorId); }
  @Patch(':id/restore') restore(@Param('id') id: string) { return this.comments.restore(id); }
  @Delete(':id') softDelete(@Param('id') id: string, @Query('moderatorId') moderatorId: string) { return this.comments.softDelete(id, moderatorId); }
}
