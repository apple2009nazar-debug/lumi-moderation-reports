import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { activeCommentWhere } from './active-comments';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  listForTrack(trackId?: string) {
    if (!trackId?.trim()) throw new BadRequestException('trackId query parameter is required');
    return this.prisma.comment.findMany({ where: { ...activeCommentWhere, trackId }, orderBy: { createdAt: 'desc' } });
  }

  async create(input: { trackId: string; authorId: string; text: string }) {
    if (!input?.trackId?.trim() || !input?.authorId?.trim() || !input?.text?.trim()) {
      throw new BadRequestException('trackId, authorId and text are required');
    }
    return this.prisma.comment.create({ data: { trackId: input.trackId.trim(), authorId: input.authorId.trim(), text: input.text.trim() } });
  }

  async hide(id: string, moderatorId?: string) {
    if (!moderatorId?.trim()) throw new BadRequestException('moderatorId is required');
    const comment = await this.getExisting(id);
    if (comment.deletedAt) throw new BadRequestException('Deleted comments cannot be hidden');
    if (comment.hiddenAt) return comment;
    return this.prisma.comment.update({ where: { id }, data: { hiddenAt: new Date(), hiddenBy: moderatorId.trim() } });
  }

  async restore(id: string) {
    const comment = await this.getExisting(id);
    if (comment.deletedAt) throw new BadRequestException('Deleted comments cannot be restored by unhide');
    if (!comment.hiddenAt) return comment;
    return this.prisma.comment.update({ where: { id }, data: { hiddenAt: null, hiddenBy: null } });
  }

  async softDelete(id: string, moderatorId?: string) {
    if (!moderatorId?.trim()) throw new BadRequestException('moderatorId is required');
    const comment = await this.getExisting(id);
    if (comment.deletedAt) return comment;
    return this.prisma.comment.update({ where: { id }, data: { deletedAt: new Date(), deletedBy: moderatorId.trim(), hiddenAt: null, hiddenBy: null } });
  }

  private async getExisting(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }
}
