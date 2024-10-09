const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const s3Client = require('../config/aws');

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      console.log("file metadata:", file);
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const filename = Date.now().toString() + '-' + file.originalname;
      console.log("file key:", filename);
      cb(null, filename);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

module.exports = upload;