const { createResponse, createError } = require('../../utils/helpers');
const MediaService = require('../../services/mediaService');

class MediaController {
  /**
   * @description Upload media
   */
  async upload(req, res, next) {
    try {
      const { name, contentType, file } = req.body;
      if (!file) {
        createError(res, { message: 'No file uploaded.' });
        return;
      } else if (!contentType) {
        createError(res, { message: 'ContentType is required' });
        return;
      } else if (!name) {
        createError(res, { message: 'Name is required' });
        return;
      }
      const publicUrl = await MediaService.upload(name, contentType, file);
      return createResponse(res, 'ok', 'Uploaded successful', { url: publicUrl });
    } catch (e) {
      createError(res, e);
    }
  }
}

const mediaController = new MediaController();
module.exports = mediaController;
