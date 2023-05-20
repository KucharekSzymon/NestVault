import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

export const multerOptions = {
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const basePath = './upload/';
      if (!existsSync(basePath)) mkdirSync(basePath);
      const uploadPath = basePath + req.user._id;
      if (!existsSync(uploadPath)) mkdirSync(uploadPath);

      cb(null, uploadPath);
    },
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
