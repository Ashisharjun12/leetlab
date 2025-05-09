import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import logger from "../utils/logger.js";
import { _config } from "../config/config.js";


//aws  credientials 

export const s3Client = new S3Client({

  region: _config.AWS_REGION,
  credentials: {
    accessKeyId: _config.AWS_ACCESS_KEY_ID,
    secretAccessKey: _config.AWS_SECRET_ACCESS_KEY

  }

});

//get objects
export const getObject = async(key)=>{
  try {
    const params = {
      Bucket: _config.AWS_S3_BUCKET,
      Key: key
    };
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    console.log(data);
    return data;
    
  } catch (error) {
    logger.info("getting obj error",error)
    
  }
  

}


//put object

export const putObject = async(file , filename)=>{
  try {
    const params = {
      Bucket: _config.AWS_S3_BUCKET,
      Key: `${filename}`,
      Body: file
    };
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    if(data.$metadata.httpStatusCode !== 200){
      return filename;
  }
  let url = `https://${_config.AWS_S3_BUCKET}.s3.${_config.AWS_REGION}.amazonaws.com/${params.Key}`
  console.log(url);
  return {url,key:params.Key};
   
  } catch (error) {
    logger.info("putting obj error", error);
  }

}


//delete object
export const deleteObject = async(key)=>{
  try {
    const params = {
      Bucket: _config.AWS_S3_BUCKET,
      Key: key
    };
    const command = new DeleteObjectCommand(params);
    const data = await s3Client.send(command);
    if(data.$metadata.httpStatusCode !== 204){
      return {status:400,data}
  }
  return {status:204};
  } catch (error) {
    logger.info("deleting obj error", error);
  }
}

