import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
  dest: './upload/',
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  /*limits: {
    fileSize: multerConfig.fileSize,
  },*/
  // Check the mimetypes to allow for upload
  /*fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|txt)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },*/
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const basePath = multerConfig.dest;
      if (!existsSync(basePath)) mkdirSync(basePath);
      const uploadPath = basePath + req.user._id;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) mkdirSync(uploadPath);

      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file, cb) => {
      const name = file.originalname.split('.')[0];
      const fileExt = extname(file.originalname);
      let i = 0;
      let fileName = `${name}${fileExt}`;

      while (existsSync(`./upload/${req.user._id}/${fileName}`)) {
        i++;
        fileName = `${name}(${i})${fileExt}`;
      }

      cb(null, fileName);
    },
  }),
};
