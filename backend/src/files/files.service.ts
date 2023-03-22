import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFileDto } from './dto/create-file.dto';
import { File, FileDocument } from './schemas/file.schema';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<FileDocument>,
  ) {}

  async create(createFileDto: CreateFileDto): Promise<FileDocument> {
    const createdFile = new this.fileModel(createFileDto);
    return createdFile.save();
  }
  async findAll(): Promise<FileDocument[]> {
    return this.fileModel.find().exec();
  }
  async findByOwner(owner: string) {
    return this.fileModel.find({ owner }).populate('sharedTo').exec();
  }
  async checkPermission(fileID: string) {
    const file = await this.fileModel.findById(fileID);
    if (file) {
      console.log(typeof file.owner._id);
      return true;
    }
  }
  imageBuffer() {
    return readFileSync(join(process.cwd(), 'test.png'));
  }

  async imageStream(userId: string, fileId: string) {
    const x = await this.checkPermission(fileId);
    return createReadStream(join(process.cwd(), 'test.png'));
  }

  fileBuffer() {
    return readFileSync(join(process.cwd(), 'test.png'));
  }

  fileStream() {
    return createReadStream(join(process.cwd(), 'test.png'));
  }
}
