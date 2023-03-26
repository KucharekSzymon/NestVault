import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateShareUrlDto } from './dto/create-share-url.dto';
import { ShareUrl, ShareUrlDocument } from './schemas/share-url.schema';

@Injectable()
export class ShareUrlsService {
  constructor(
    @InjectModel(ShareUrl.name)
    private shareUrlModel: Model<ShareUrlDocument>,
    private userService: UsersService,
  ) {}

  async create(createFileDto: CreateShareUrlDto): Promise<ShareUrlDocument> {
    const createdShareUrl = new this.shareUrlModel(createFileDto);
    return createdShareUrl.save();
  }
}
