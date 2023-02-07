const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Bucket and IAM user details
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secrteKey = process.env.AWS_SECRTE_KEY;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secrteKey,
  },
});

// Upload files to s3
const uploadFileToS3 = async (file, key) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: key,
    ContentType: file.mimeType,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);
};
// download files to s3

exports.uploadFileToS3 = uploadFileToS3;
