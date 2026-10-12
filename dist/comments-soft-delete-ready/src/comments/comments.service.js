"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const active_comments_1 = require("./active-comments");
let CommentsService = class CommentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    listForTrack(trackId) {
        if (!trackId?.trim())
            throw new common_1.BadRequestException('trackId query parameter is required');
        return this.prisma.comment.findMany({ where: { ...active_comments_1.activeCommentWhere, trackId }, orderBy: { createdAt: 'desc' } });
    }
    async create(input) {
        if (!input?.trackId?.trim() || !input?.authorId?.trim() || !input?.text?.trim()) {
            throw new common_1.BadRequestException('trackId, authorId and text are required');
        }
        return this.prisma.comment.create({ data: { trackId: input.trackId.trim(), authorId: input.authorId.trim(), text: input.text.trim() } });
    }
    async hide(id, moderatorId) {
        if (!moderatorId?.trim())
            throw new common_1.BadRequestException('moderatorId is required');
        const comment = await this.getExisting(id);
        if (comment.deletedAt)
            throw new common_1.BadRequestException('Deleted comments cannot be hidden');
        if (comment.hiddenAt)
            return comment;
        return this.prisma.comment.update({ where: { id }, data: { hiddenAt: new Date(), hiddenBy: moderatorId.trim() } });
    }
    async restore(id) {
        const comment = await this.getExisting(id);
        if (comment.deletedAt)
            throw new common_1.BadRequestException('Deleted comments cannot be restored by unhide');
        if (!comment.hiddenAt)
            return comment;
        return this.prisma.comment.update({ where: { id }, data: { hiddenAt: null, hiddenBy: null } });
    }
    async softDelete(id, moderatorId) {
        if (!moderatorId?.trim())
            throw new common_1.BadRequestException('moderatorId is required');
        const comment = await this.getExisting(id);
        if (comment.deletedAt)
            return comment;
        return this.prisma.comment.update({ where: { id }, data: { deletedAt: new Date(), deletedBy: moderatorId.trim(), hiddenAt: null, hiddenBy: null } });
    }
    async getExisting(id) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        return comment;
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map