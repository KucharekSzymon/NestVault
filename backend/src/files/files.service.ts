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
  findByOwner(owner: string) {
    return this.fileModel
      .find({ owner })
      .populate('sharedTo')
      .populate('owner')
      .exec();
  }
  imageBuffer() {
    return readFileSync(join(process.cwd(), 'test.png'));
  }

  imageStream() {
    return createReadStream(join(process.cwd(), 'test.png'));
  }

  fileBuffer() {
    return readFileSync(join(process.cwd(), 'package.json'));
  }

  fileStream() {
    return createReadStream(join(process.cwd(), 'package.json'));
  }
}
