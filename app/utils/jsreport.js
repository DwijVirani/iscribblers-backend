const path = require('path');
const fs = require('fs');
const { JS_REPORT_URL, JS_REPORT_USERNAME, JS_REPORT_PASSWORD } = require('../config/env');

require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
/**
 * get PDF using jsreport
 *
 * @export
 * @param {Object} htmlText - htmltext
 * @param {Object} data - data
 */
async function getPDF(template = 'basic-invoice.html', data) {
  try {
    const template_path = path.join(__dirname, '..', 'static-contents', 'invoice-template', template);
    // eslint-disable-next-line import/no-dynamic-require
    const htmlText = require(template_path);

    const client = require('jsreport-client')(JS_REPORT_URL, JS_REPORT_USERNAME, JS_REPORT_PASSWORD);

    const res = await client.render({
      template: {
        content: htmlText,
        recipe: 'chrome-pdf',
        engine: 'jsrender',
      },
      data,
    });

    const bodyBuffer = await res.body();
    return bodyBuffer;
  } catch (e) {
    console.log('ERROR', e);
    throw e;
  }
}

module.exports = getPDF;
