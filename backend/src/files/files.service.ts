import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<FileDocument>,
    private userService: UsersService,
  ) {}

  async create(data: any): Promise<FileDocument> {
    const createdFile = new this.fileModel();
    createdFile.name = data.name;
    createdFile.owner = data.owner;
    createdFile.path = data.path;
    createdFile.type = data.type;
    createdFile.size = data.size;

    await this.userService.uploadOfFile(data.owner, data.size);
    return createdFile.save();
  }

  async findById(fileId: string) {
    return this.fileModel.findById(fileId);
  }

  async findByOwner(owner: string) {
    return await this.fileModel.find({ owner }).exec();
  }

  async spaceLeft(userId: string) {
    const user = await this.userService.findById(userId);
    return user.storageLimit - user.storedData;
  }

  async findShared(owner: string) {
    const files = await this.fileModel.find({ owner }).exec();
    const sharedFiles = [];
    files.forEach((element) => {
      if (element.authorizedUsers.length != 0) sharedFiles.push(element);
    });
    return sharedFiles;
  }
  async findFilesSharedToMe(owner: string) {
    const user = await this.userService.findById(owner);
    return await this.fileModel.find({ authorizedUsers: user._id }).exec();
  }

  async checkFile(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    const user = await this.userService.findById(userId);

    if (file == null) throw new NotFoundException('File not found.');
    if (user == null) throw new NotFoundException('User not found.');

    if (file.owner._id.toString() === user._id.toString()) return true;
    else if (file.authorizedUsers.includes(user._id)) return true;
    else
      throw new UnauthorizedException('You dont have acces to this resource.');
  }
  async checkFileForOwner(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    const user = await this.userService.findById(userId);

    if (file == null) throw new NotFoundException('File not found.');
    if (user == null) throw new NotFoundException('User not found.');

    if (file.owner._id.toString() === user._id.toString()) return true;
    else
      throw new UnauthorizedException(
        'Only owner of file can use this function.',
      );
  }

  async fileShare(fileOwnerId: string, shareToId: string, fileId: string) {
    const file = await this.fileModel.findById(fileId);
    if (await this.checkFileForOwner(fileId, fileOwnerId)) {
      const user = await this.userService.findById(shareToId);
      if (user == null) throw new NotFoundException('User not found.');
      if (file.authorizedUsers.includes(user._id))
        throw new ForbiddenException(
          'This user already have access to this resoure.',
        );
      file.authorizedUsers.push(user);
      return this.fileModel
        .findByIdAndUpdate(fileId, file)
        .setOptions({ overwrite: true, new: true });
    }
  }
  async fileAccessRevoke(
    fileOwnerId: string,
    shareToId: string,
    fileId: string,
  ) {
    const file = await this.fileModel.findById(fileId);
    if (await this.checkFileForOwner(fileId, fileOwnerId)) {
      const user = await this.userService.findById(shareToId);
      if (user == null) throw new NotFoundException('User not found.');

      file.authorizedUsers = file.authorizedUsers.filter(
        (obj) => !user._id.equals(obj),
      );

      return this.fileModel
        .findByIdAndUpdate(fileId, file)
        .setOptions({ overwrite: true, new: true });
    }
  }

  async imageStream(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    await this.checkFile(fileId, userId);

    return createReadStream(
      join(process.cwd(), 'upload', file.path, file.name),
    );
  }

  async imageBuffer(fileId: string, userId: string) {
    const file = await this.fileModel.findById(fileId);
    await this.checkFile(fileId, userId);

    return readFileSync(join(process.cwd(), 'upload', file.path, file.name));
  }

  async remove(fileId: string, reqId: string) {
    const file = await this.fileModel.findById(fileId);

    if (await this.checkFileForOwner(fileId, reqId)) {
      this.userService.removalOfFile(reqId, file.size);
      this.deleteFile(`./upload/${file.path}/${file.name}`);
      return this.fileModel.findByIdAndDelete(fileId).exec();
    }
  }
  deleteFile(filePath: string): void {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log(error);
    }
  }
}
