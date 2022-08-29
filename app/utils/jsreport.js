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
    console.log('template_path', template_path);
    // eslint-disable-next-line import/no-dynamic-require
    const htmlText = require(template_path);
    console.log('htmlText', htmlText);

    const client = require('jsreport-client')(JS_REPORT_URL, JS_REPORT_USERNAME, JS_REPORT_PASSWORD);
    console.log('client', client);

    const res = await client.render({
      template: {
        content: htmlText,
        recipe: 'phantom-pdf',
        engine: 'jsrender',
      },
      data,
    });
    console.log('res', res);

    const bodyBuffer = await res.body();
    // console.log(bodyBuffer.toString());
    return bodyBuffer;
  } catch (e) {
    console.log('ERROR', e);
    throw e;
  }
}

module.exports = getPDF;
