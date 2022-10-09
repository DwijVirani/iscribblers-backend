const invoiceService = require('../../services/invoiceService');
const { createResponse, createError } = require('./../../utils/helpers');
const getPdf = require('./../../utils/jsreport');

class InvoiceController {
  async get(req, res) {
    try {
      const { user } = req;
      const result = await invoiceService.get(user.id);
      if (result) return createResponse(res, 'ok', 'Invoice Listed successfully', result);
      else return createError(res, {}, { message: 'Unable to get invocies' });
    } catch (e) {
      createError(res, e);
    }
  }

  async getPDFPreview(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const download = true;
      const invoicePreviewData = await invoiceService.getPreview(user ? user.id : '', id);

      if (invoicePreviewData && invoicePreviewData.invoice) {
        const pdfData = await getPdf('basic-invoice.html', invoicePreviewData);
        const slugify = require('slugify');
        const invoice_file_name = slugify(`Invoice-${invoicePreviewData.invoice.number}`, { strict: true });
        console.log('invoice_file_name', invoice_file_name);
        console.log(
          '/*/*/',
          `'Content-Disposition': ${
            download && (download === true || download === 'true') ? 'attachment;' : ''
          } filename="${invoice_file_name}.pdf"`,
        );
        res.writeHead(200, {
          'Content-Disposition': `attachment; filename="${invoice_file_name}.pdf"`,
          'Content-Type': 'application/pdf',
          'Content-Length': pdfData.length,
        });

        return res.end(pdfData, 'binary');
      } else return createError(res, { message: 'Invoice item not found' });
    } catch (e) {
      return createError(res, e);
    }
  }
}

const controller = new InvoiceController();
module.exports = controller;
