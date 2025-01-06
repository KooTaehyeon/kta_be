// 업로드 함수
// import { S3 } from 'aws-sdk'; // docker 설정을 위해 AWS -> AWS.S3 모듈 할당 형식으로 변경
import AWS from "aws-sdk";
const S3 = AWS.S3;

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = async (file: Express.Multer.File) => {
  const fileName = encodeURIComponent(file.originalname);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `${process.env.AWS_BUCKET_FOLDER_NAME}/${Date.now()}-${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const { Location } = await s3.upload(params).promise();
  return Location;
};

const deleteFromS3 = async (key: string): Promise<void> => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key, // S3에서 삭제할 파일의 Key
    };

    await s3.deleteObject(params).promise();
    console.log(`File deleted successfully: ${key}`);
  } catch (error: any) {
    console.error(`S3 Delete Error: ${error.message}`);
    throw new Error("Failed to delete file from S3");
  }
};

export { uploadToS3, deleteFromS3 };