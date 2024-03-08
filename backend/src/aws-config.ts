import AWS from "aws-sdk"

AWS.config.update({
  accessKeyId: 'REDACTED_AWS_ACCESS_KEY_ID',
  secretAccessKey: 'REDACTED_AWS_SECRET_ACCESS_KEY',
  region: 'us-east-1'
});

 const s3 = new AWS.S3();

 export default s3;