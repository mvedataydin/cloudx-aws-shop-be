import { Readable } from 'stream';
import csv from 'csv-parser';
import {
  CopyObjectCommand,
  CopyObjectRequest,
  DeleteObjectCommand,
  DeleteObjectRequest,
} from '@aws-sdk/client-s3';
import { s3Client } from '@libs/s3-client';
import logger from '@utils/logger.utils';
import type { S3EventRecord } from 'aws-lambda';

export class FileService {
  static async parseCSV(stream: Readable) {
    return await new Promise((resolve, reject) => {
      const chunks = [];
      stream
        .pipe(csv())
        .on('data', chunk => {
          logger.log('[FileService] parsing chunk:', chunk);
          chunks.push(chunk);
        })
        .on('error', error => {
          logger.log('[FileService] parsing error', error);
          reject(error);
        })
        .on('end', () => {
          logger.log('[FileService] csv parsed successfully');
          resolve(chunks);
        });
    });
  }

  static async delete(
    bucket: S3EventRecord['s3']['bucket'],
    object: S3EventRecord['s3']['object'],
  ) {
    try {
      const params: DeleteObjectRequest = {
        Bucket: bucket.name,
        Key: object.key,
      };
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
      logger.log('[FileService] file deleted successfully');
    } catch (e) {
      logger.log('[FileService] delete error', e);
    }
  }

  static async copyToParsed(
    bucket: S3EventRecord['s3']['bucket'],
    object: S3EventRecord['s3']['object'],
  ) {
    try {
      const params: CopyObjectRequest = {
        Bucket: bucket.name,
        CopySource: `${bucket.name}/${object.key}`,
        Key: object.key.replace(
          process.env.S3_UPLOADED_FOLDER,
          process.env.S3_PARSED_FOLDER,
        ),
      };

      const command = new CopyObjectCommand(params);
      return await s3Client.send(command);
    } catch (e) {
      logger.log('[FileService] copy error', e);
    }
  }
}
