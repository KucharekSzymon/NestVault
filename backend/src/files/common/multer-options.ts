import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

// Multer configuration
export const multerConfig = {
  dest: './upload/',
};

// Multer upload options
export const multerOptions = {
  // Storage properties
  storage: diskStorage({
    /**
     * Destination storage path details
     */
    destination: (req: any, file: any, cb: any) => {
      const basePath = multerConfig.dest;
      if (!existsSync(basePath)) mkdirSync(basePath);
      const uploadPath = basePath + req.user._id;
      /**
       * Create folder if doesn't exist
       */
      if (!existsSync(uploadPath)) mkdirSync(uploadPath);

      cb(null, uploadPath);
    },
    /**
     * File modification details
     */
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
