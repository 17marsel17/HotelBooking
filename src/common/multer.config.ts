export const filenameFilter = (
  req: any,
  file: { originalname: any },
  cb: (arg0: null, arg1: string) => void,
) => {
  cb(null, `${Date.now()} - ${file.originalname}`);
};
