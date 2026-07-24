import AWS from "aws-sdk"
import "dotenv/config";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEYID,
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  region: process.env.AWS_REGION
});

 const s3 = new AWS.S3();

 export default s3;