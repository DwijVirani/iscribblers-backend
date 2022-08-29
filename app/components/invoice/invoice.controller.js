const invoiceService = require('../../services/invoiceService');
const { createResponse, createError } = require('./../../utils/helpers');
const getPdf = require('./../../utils/jsreport');

class InvoiceController {
  async get(req, res) {
    try {
      const { user } = req;
      const result = await invoiceService.get(user.id);
      if (result) createResponse(res, 'ok', 'Invoice Listed successfully', result);
      else createError(res, {}, { message: 'Unable to get invocies' });
    } catch (e) {
      createError(res, e);
    }
  }

  async getPDFPreview(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const { download } = req.query;
      let { copies } = req.query;
      if (!copies) copies = 1;
      const invoicePreviewData = await invoiceService.getPreview(user ? user.id : '', id);
      // console.log('invoicePreviewData', invoicePreviewData);
      if (invoicePreviewData && invoicePreviewData.invoice) {
        const pdfData = await getPdf('basic-invoice.html', invoicePreviewData);
        const slugify = require('slugify');
        const invoice_file_name = slugify(`Invoice-${invoicePreviewData.invoice.number}`, { strict: true });
        res.writeHead(200, {
          'Content-Disposition': `${
            download && (download === true || download === 'true') ? 'attachment;' : ''
          } filename="${invoice_file_name}.pdf"`,
          'Content-Type': 'application/pdf',
          'Content-Length': pdfData.length,
        });

        return res.end(invoicePreviewData);
      } else return createError(res, { message: 'Invoice item not found' });
    } catch (e) {
      return createError(res, e);
    }
  }
}

const controller = new InvoiceController();
module.exports = controller;
