export class Helper {
  static customFileName(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalName = file.originalname.split('.')[0];
    if (file.originalName.split('.').lenght != 0) {
      const fileExtension = file.originalname.split('.')[1];
      cb(null, originalName + '-' + uniqueSuffix + '.' + fileExtension);
    } else {
      cb(null, originalName + '-' + uniqueSuffix);
    }
  }

  static destinationPath(req, file, cb) {
    cb(null, './upload/');
  }
}
