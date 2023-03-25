import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFileDto } from './dto/create-file.dto';
import { File, FileDocument } from './schemas/file.schema';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<FileDocument>,
    private userService: UsersService,
  ) {}

  async create(createFileDto: CreateFileDto): Promise<FileDocument> {
    const createdFile = new this.fileModel(createFileDto);
    return createdFile.save();
  }

  async findByOwner(owner: string) {
    return this.fileModel.find({ owner }).exec();
  }

  async findShared(owner: string) {
    const files = await this.fileModel.find({ owner }).exec();
    const sharedFiles = [];
    files.forEach((element) => {
      if (element.authorizedUsers.length != 0) sharedFiles.push(element);
    });
    return sharedFiles;
  }

  async checkFile(file: File, userId: string) {
    const user = await this.userService.findById(userId);
    if (file) {
      if (file.owner._id.toString() === user._id.toString()) return true;
      else if (file.authorizedUsers.includes(user._id)) return true;
      else
        throw new UnauthorizedException(
          'You dont have acces to this resource.',
        );
    } else {
      throw new BadRequestException('File not found.');
    }
  }

  async fileShare(fileOwnerId: string, shareToId: string, fileId: string) {
    const file = await this.fileModel.findById(fileId);
    if (await this.checkFile(file, fileOwnerId)) {
      const user = await this.userService.findById(shareToId);
      if (!file.authorizedUsers.includes(user._id)) {
        if (user) {
          file.authorizedUsers.push(user);
          return this.fileModel
            .findByIdAndUpdate(fileId, file)
            .setOptions({ overwrite: true, new: true });
        } else {
          throw new BadRequestException('User not found.');
        }
      } else {
        throw new BadRequestException(
          'This user already have acces to this resoure.',
        );
      }
    }
  }

  async imageStream(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    await this.checkFile(file, userId);

    return createReadStream(
      join(process.cwd(), 'upload', file.path, file.name),
    );
  }

  async imageBuffer(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    await this.checkFile(file, userId);

    return readFileSync(join(process.cwd(), 'upload', file.path, file.name));
  }
}
