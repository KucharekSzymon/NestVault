import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { CreateShareUrlDto } from './dto/create-share-url.dto';
import { ShareUrl, ShareUrlDocument } from './schemas/share-url.schema';

@Injectable()
export class ShareUrlsService {
  constructor(
    @InjectModel(ShareUrl.name)
    private shareUrlModel: Model<ShareUrlDocument>,
    private fileService: FilesService,
  ) {}

  async create(createFileDto: CreateShareUrlDto, userId: string) {
    if (
      await this.fileService.findById(createFileDto.file.toString(), userId)
    ) {
      const createdShareUrl = new this.shareUrlModel(createFileDto);
      return createdShareUrl.save();
    }
  }

  async findByOwner(owner: string) {
    return this.shareUrlModel.find({ owner }).exec();
  }
}
