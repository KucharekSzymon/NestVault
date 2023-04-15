import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { ShareCode, ShareCodeDocument } from './schemas/share-code.schema';

@Injectable()
export class ShareCodesService {
  constructor(
    @InjectModel(ShareCode.name)
    private shareCodeModel: Model<ShareCodeDocument>,
    private fileService: FilesService,
    private userService: UsersService,
  ) {}

  async create(data: any, userId: string) {
    await this.fileService.checkFileForOwner(data.file.toString(), userId);
    const shareUrl = new this.shareCodeModel();
    shareUrl.file = data.file;
    if (data.description != null) shareUrl.description = data.description;
    shareUrl.owner = data.owner;
    if (data.expireTime != null) shareUrl.expireTime = data.expireTime;
    const createdShareUrl = new this.shareCodeModel(shareUrl);
    const newUrl = await createdShareUrl.save();
    return 'Share code created - ' + newUrl._id;
  }

  async findByOwner(owner: string) {
    return this.shareCodeModel.find({ owner }).populate('usedBy').exec();
  }

  async activate(codeId: string, userId: string) {
    const code = await this.shareCodeModel.findById(codeId);
    if (code == null) throw new NotFoundException('Share code not found');
    const file = await this.fileService.findById(code.file.toString());
    const user = await this.userService.findById(userId);
    const date = new Date(code.expireTime);

    if (date < new Date())
      throw new ForbiddenException(
        'Sorry, this code has expired and is no longer valid',
      );

    await this.fileService.fileShare(
      file.owner._id.toString(),
      userId,
      file._id.toString(),
    );

    code.usedBy.push(user);
    await this.shareCodeModel
      .findByIdAndUpdate(codeId, code)
      .setOptions({ overwrite: true, new: true });
    return code.description
      ? {
          message: `Share code activated, code description - ${code.description}`,
        }
      : {
          message: 'Share code activated',
        };
  }

  async removeCode(codeId: string, userId: string) {
    const code = await this.shareCodeModel.findById(codeId);
    if (code == null) throw new NotFoundException('Share code not found');
    const user = await this.userService.findById(userId);
    if (user.isAdmin || code.owner.toString() == user._id.toString()) {
      try {
        await this.shareCodeModel.findByIdAndDelete(codeId).exec();
        return { message: 'Share code removed succesfully' };
      } catch (error) {
        return error;
      }
    }
  }
}
