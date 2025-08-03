const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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
  bookingDate = new Date()
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Colors
      const primaryColor = '#2C3E50';
      const accentColor = '#3498DB';
      const lightGray = '#F8F9FA';
      const darkGray = '#6C757D';

      // Helpers
      const drawLine = (sx, sy, ex, ey, color = '#E9ECEF', width = 1) => {
        doc.strokeColor(color).lineWidth(width)
           .moveTo(sx, sy).lineTo(ex, ey).stroke();
      };

      let currentY = 50;

      // --- Header Section: Logo + Title ---
      try {
        const logoPath = path.resolve(__dirname, '../assets/logo.png');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 50, currentY, { width: 60, height: 60 });
        } else {
          doc.rect(50, currentY, 60, 60).fillColor(accentColor).fill();
          doc.fillColor('white').fontSize(16).font('Helvetica-Bold')
             .text('VV', 65, currentY + 20);
        }
      } catch (e) {
        console.warn('Could not load logo:', e);
      }

      doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold')
         .text('VENUE VERSE', 130, currentY);
      doc.fillColor(darkGray).fontSize(10).font('Helvetica')
         .text('Premium Venue Booking Services', 130, currentY + 25)
         .text('Email: venueventure25@gmail.com', 130, currentY + 38)
         .text('Phone: +92-321-1234567', 130, currentY + 51);

      doc.fillColor(primaryColor).fontSize(32).font('Helvetica-Bold')
         .text('INVOICE', 400, currentY, { align: 'right' });

      currentY += 80;

      // --- Invoice Details Box (FIXED) ---
      const invoiceBoxY = currentY;
      const boxWidth = 195;
      const boxHeight = 80; // Increased height to accommodate both lines properly
      
      doc.rect(350, invoiceBoxY, boxWidth, boxHeight).fillColor(lightGray).fill();
      doc.strokeColor('#E9ECEF').stroke();

      // Left-aligned labels
      doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold')
         .text('INVOICE NUMBER:', 360, invoiceBoxY + 15)
         .text('BOOKING DATE:', 360, invoiceBoxY + 40);

      // Right-aligned values with proper positioning
      const valueX = 350 + boxWidth - 10; // 10px margin from right edge
      doc.fillColor('black').fontSize(10).font('Helvetica')
         .text(`#${bookingId}`, valueX - 80, invoiceBoxY + 15, { align: 'right', width: 80 })
         .text(bookingDate.toLocaleDateString(), valueX - 80, invoiceBoxY + 40, { align: 'right', width: 80 });

      currentY += boxHeight + 20; // Adjust spacing after the box

      // --- Bill To Section ---
      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold')
         .text('BILL TO:', 50, currentY);
      currentY += 20;
      doc.fillColor('black').fontSize(11).font('Helvetica-Bold')
         .text(customerName, 50, currentY);
      doc.fontSize(10).font('Helvetica')
         .text(customerEmail, 50, currentY + 15)
         .text(customerPhone, 50, currentY + 28);

      currentY += 60;

      // --- Service Details Section ---
      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold')
         .text('SERVICE DETAILS:', 50, currentY);
      currentY += 25;

      // Table header row
      const tableY = currentY;
      const headerHeight = 30;
      doc.rect(50, tableY, 495, headerHeight).fillColor(primaryColor).fill();
      doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
         .text('DESCRIPTION', 60, tableY + 10)
         .text('VENUE', 200, tableY + 10)
         .text('DURATION', 320, tableY + 10)
         .text('AMOUNT', 450, tableY + 10);

      currentY += headerHeight;

      // Booking row
      doc.rect(50, currentY, 495, 50).fillColor('white').stroke();
      doc.fillColor('black').fontSize(9).font('Helvetica')
         .text('Venue Booking Service', 60, currentY + 10)
         .text('Premium venue rental', 60, currentY + 22)
         .text(venueName, 200, currentY + 10, { width: 110 });

      const duration = Math.ceil((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60));
      doc.text(`${duration} hours`, 320, currentY + 10)
         .text(`${new Date(startTime).toLocaleDateString()}`, 320, currentY + 22)
         .text(`${new Date(startTime).toLocaleTimeString()} - ${new Date(endTime).toLocaleTimeString()}`, 320, currentY + 34);

      doc.text(`Rs ${totalPrice.toFixed(2)}`, 450, currentY + 10, { align: 'right', width: 85 });

      currentY += 50 + 20;

      // --- Summary Section ---
      const sumX = 350, sumW = 195;
      drawLine(sumX, currentY, sumX + sumW, currentY, primaryColor, 2);
      currentY += 10;

      doc.rect(sumX, currentY, sumW, 30).fillColor(primaryColor).fill();
      doc.fillColor('white').fontSize(12).font('Helvetica-Bold')
         .text('TOTAL:', sumX + 10, currentY + 8)
         .text(`Rs ${totalPrice.toFixed(2)}`, sumX + sumW - 50, currentY + 8, { align: 'right', width: 50 });

      currentY += 50;

      // --- Terms & Footer ---
      doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold')
         .text('PAYMENT TERMS & CONDITIONS:', 50, currentY);
      currentY += 20;
      doc.fillColor('black').fontSize(9).font('Helvetica')
         .text('• Payment is due within 30 days of invoice date', 50, currentY)
         .text('• Late payments may incur additional charges', 50, currentY + 12)
         .text('• Booking confirmation is subject to venue availability', 50, currentY + 24)
         .text('• Cancellation policy applies as per terms of service', 50, currentY + 36);

      currentY += 60;
      drawLine(50, currentY, 545, currentY, '#E9ECEF');
      currentY += 15;

      doc.fillColor(darkGray).fontSize(8).font('Helvetica')
         .text('Thank you for choosing Venue Verse!', 50, currentY, { align: 'center', width: 495 })
         .text('Contact: venueventure25@gmail.com | +92‑321‑1234567', 50, currentY + 12, { align: 'center', width: 495 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateInvoice;