const { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } = require('../config/env');
/**
 * Send email
 *
 * @export
 * @param {Object} subject - subject
 * @param {Object} body - body
 */
async function sendEmail(to, subject, body, attachments) {
  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(SENDGRID_API_KEY);
    const clientMsg = {
      to,
      from: SENDGRID_SENDER_EMAIL,
      subject: subject || 'Email from iScribblers',
      html: body,
      attachments,
    };
    await sgMail.send(clientMsg);
    return true;
  } catch (e) {
    throw e;
  }
}

async function sendErrorMail(to, subject, body) {
  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(SENDGRID_API_KEY);
    if (Array.isArray(to) === false) to = to.replace(';', ',').split(',');
    const clientMsg = {
      to,
      from: SENDGRID_SENDER_EMAIL,
      subject: `Arya ERP-Error Mail - ${subject}`,
      text: body,
    };
    await sgMail.send(clientMsg);
    return true;
  } catch (e) {
    console.log('Error Occurred', e);
  }
}

module.exports = { sendEmail, sendErrorMail };
