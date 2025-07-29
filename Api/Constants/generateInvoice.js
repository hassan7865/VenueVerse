const PDFDocument = require('pdfkit');

/**
 * Generate a professional invoice PDF in memory
 * @param {Object} data - Booking and customer details
 * @returns {Promise<Buffer>} - Resolves to a Buffer of the PDF
 */
const generateInvoice = ({
  bookingId,
  customerName,
  customerEmail,
  customerPhone,
  venueName,
  startTime,
  endTime,
  totalPrice,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // --- Header ---
      doc
        .fontSize(20)
        .text('INVOICE', { align: 'center' })
        .moveDown();

      // --- Company Info ---
      doc
        .fontSize(12)
        .text('Venue Venture', { align: 'left' })
        .text('Email: venueventure25@gmail.com')
        .text('Phone: +92-XXX-XXXXXXX')
        .moveDown(1.5);

      // --- Booking Details ---
      doc
        .fontSize(14)
        .text(`Invoice #: ${bookingId}`)
        .moveDown(0.5);

      // --- Customer Details ---
      doc
        .fontSize(12)
        .text(`Customer Name: ${customerName}`)
        .text(`Customer Email: ${customerEmail}`)
        .text(`Customer Phone: ${customerPhone}`)
        .moveDown(0.5);

      // --- Venue & Timing ---
      doc
        .text(`Venue Name   : ${venueName}`)
        .text(`Start Time   : ${new Date(startTime).toLocaleString()}`)
        .text(`End Time     : ${new Date(endTime).toLocaleString()}`)
        .moveDown(1);

      // --- Pricing ---
      doc
        .fontSize(14)
        .text(`Total Price: Rs ${totalPrice.toFixed(2)}`, {
          align: 'right',
          underline: true,
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateInvoice;
