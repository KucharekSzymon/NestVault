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
import { ShareUrl, ShareUrlDocument } from './schemas/share-url.schema';

@Injectable()
export class ShareUrlsService {
  constructor(
    @InjectModel(ShareUrl.name)
    private shareUrlModel: Model<ShareUrlDocument>,
    private fileService: FilesService,
    private userService: UsersService,
  ) {}

  async create(data: any, userId: string) {
    await this.fileService.checkFileForOwner(data.file.toString(), userId);
    const shareUrl = new this.shareUrlModel();
    shareUrl.file = data.file;
    if (data.description != null) shareUrl.description = data.description;
    shareUrl.owner = data.owner;
    if (data.expireTime != null) shareUrl.expireTime = data.expireTime;
    const createdShareUrl = new this.shareUrlModel(shareUrl);
    const newUrl = createdShareUrl.save();
    return newUrl;
  }

  async findByOwner(owner: string) {
    return this.shareUrlModel.find({ owner }).exec();
  }

  async showUses(linkId: string, userId: string) {
    const link = await this.shareUrlModel.findById(linkId);
    if (link === null) throw new NotFoundException('Link not found.');

    if (link.owner._id.toString() != userId)
      throw new UnauthorizedException('You dont have access to this resource.');

    return link.populate('usedBy');
  }

  async activate(urlId: string, userId: string) {
    const url = await this.shareUrlModel.findById(urlId);
    const file = await this.fileService.findById(url.file.toString());
    const user = await this.userService.findById(userId);
    const date = new Date(url.expireTime);

    if (date < new Date())
      throw new ForbiddenException(
        'Sorry, this link has expired and is no longer valid',
      );

    await this.fileService.fileShare(
      file.owner._id.toString(),
      userId,
      file._id.toString(),
    );
    url.usedBy.push(user);
    return this.shareUrlModel
      .findByIdAndUpdate(urlId, url)
      .setOptions({ overwrite: true, new: true });
  }
}
