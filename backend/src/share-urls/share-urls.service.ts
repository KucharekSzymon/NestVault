import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { CreateShareUrlDto } from './dto/create-share-url.dto';
import { ShareUrl, ShareUrlDocument } from './schemas/share-url.schema';

@Injectable()
export class ShareUrlsService {
  constructor(
    @InjectModel(ShareUrl.name)
    private shareUrlModel: Model<ShareUrlDocument>,
    private fileService: FilesService,
    private userService: UsersService,
  ) {}

  async create(createFileDto: CreateShareUrlDto, userId: string) {
    if (
      await this.fileService.checkFile(createFileDto.file.toString(), userId)
    ) {
      const createdShareUrl = new this.shareUrlModel(createFileDto);
      return createdShareUrl.save();
    }
  }

  async findByOwner(owner: string) {
    return this.shareUrlModel.find({ owner }).exec();
  }

  async activate(urlId: string, userId: string) {
    const url = await this.shareUrlModel.findById(urlId);
    const file = await this.fileService.findById(url.file.toString());
    const user = await this.userService.findById(userId);
    const date = new Date(url.expireTime);

    if (date < new Date())
      throw new BadRequestException(
        'Sorry, this link has expired and is no longer valid',
      );
    url.usedBy.push(user);

    await this.fileService.fileShare(
      file.owner._id.toString(),
      userId,
      file._id.toString(),
    );
    return this.shareUrlModel
      .findByIdAndUpdate(urlId, url)
      .setOptions({ overwrite: true, new: true });
  }
}
