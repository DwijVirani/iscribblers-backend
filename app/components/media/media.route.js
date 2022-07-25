const express = require('express');

const router = express.Router();
const MediaController = require('./media.controller');

/**
 * @route POST api/media/upload
 * @description Upload media for project
 * @returns JSON
 * @access public
 */
router.post('/upload', (req, res) => {
  MediaController.upload(req, res);
});

module.exports = router;
