const path = require('path');
const uuid = require('uuid');
const Cloud = require('@google-cloud/storage');
const { GCLOUD_STORAGE_BUCKET } = require('./../config/env');
const gcServiceKey = require('./../../google.json');

const serviceKeyPath = path.join(__dirname, './../../google.json');

class MediaService {
  /**
   * @description add sprint session
   * @param {String} user_id
   * @param {Object} obj
   */
  async upload(name, contentType, base64String) {
    const { Storage } = Cloud;
    const storage = new Storage({
      keyFilename: serviceKeyPath,
      projectId: gcServiceKey.project_id,
    });
    const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET);
    return new Promise(async (resolve, reject) => {
      try {
        const fileName = `${uuid.v4()}_${name}`;
        const blob = bucket.file(fileName.replace(/ /g, '_'));
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
        const byteImage = Buffer.from(base64String, 'base64');
        blobStream
          .on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          })
          .on('error', () => {
            reject(`Unable to upload image, something went wrong`);
          })
          .end(byteImage);
      } catch (e) {
        reject(e);
      }
    });
  }
}

const mediaService = new MediaService();
module.exports = mediaService;
