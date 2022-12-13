export const FileValidationPipe = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    req.fileValidationError = '[X] Allowed filetype: .csv';
    return cb(null, false);
  }

  cb(null, true);
};
