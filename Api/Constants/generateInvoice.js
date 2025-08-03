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

      // Page dimensions
      const pageWidth = 595; // A4 width in points
      const margin = 50;
      const contentWidth = pageWidth - (margin * 2);

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

      // Company info
      doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold')
         .text('VENUE VERSE', 130, currentY);
      doc.fillColor(darkGray).fontSize(10).font('Helvetica')
         .text('Premium Venue Booking Services', 130, currentY + 25)
         .text('Email: venueventure25@gmail.com', 130, currentY + 38)
         .text('Phone: +92-321-1234567', 130, currentY + 51);

      // Invoice title - right aligned
      doc.fillColor(primaryColor).fontSize(32).font('Helvetica-Bold')
         .text('INVOICE', 400, currentY, { align: 'right' });

      currentY += 100;

      // --- Invoice Details Box (IMPROVED) ---
      const invoiceBoxY = currentY;
      const boxWidth = 200;
      const boxHeight = 90;
      const boxX = pageWidth - margin - boxWidth;
      
      doc.rect(boxX, invoiceBoxY, boxWidth, boxHeight).fillColor(lightGray).fill();
      doc.strokeColor('#E9ECEF').lineWidth(1).stroke();

      // Invoice details with better spacing
      doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold')
         .text('INVOICE NUMBER:', boxX + 15, invoiceBoxY + 20)
         .text('BOOKING DATE:', boxX + 15, invoiceBoxY + 50);

      doc.fillColor('black').fontSize(10).font('Helvetica')
         .text(`#${bookingId}`, boxX + 15, invoiceBoxY + 35)
         .text(bookingDate.toLocaleDateString(), boxX + 15, invoiceBoxY + 65);

      currentY += boxHeight + 30;

      // --- Bill To Section ---
      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold')
         .text('BILL TO:', 50, currentY);
      currentY += 25;
      
      doc.fillColor('black').fontSize(11).font('Helvetica-Bold')
         .text(customerName, 50, currentY);
      currentY += 20;
      
      doc.fontSize(10).font('Helvetica')
         .text(customerEmail, 50, currentY);
      currentY += 15;
      
      doc.text(customerPhone, 50, currentY);
      currentY += 40;

      // --- Service Details Section ---
      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold')
         .text('SERVICE DETAILS:', 50, currentY);
      currentY += 30;

      // Table setup with proper column widths
      const tableX = 50;
      const tableWidth = contentWidth;
      const col1Width = 180;  // Description
      const col2Width = 140;  // Venue
      const col3Width = 120;  // Duration
      const col4Width = 95;   // Amount

      // Table header
      const headerHeight = 35;
      doc.rect(tableX, currentY, tableWidth, headerHeight).fillColor(primaryColor).fill();
      
      doc.fillColor('white').fontSize(11).font('Helvetica-Bold')
         .text('DESCRIPTION', tableX + 10, currentY + 12)
         .text('VENUE', tableX + col1Width + 10, currentY + 12)
         .text('DURATION', tableX + col1Width + col2Width + 10, currentY + 12)
         .text('AMOUNT', tableX + col1Width + col2Width + col3Width + 10, currentY + 12);

      currentY += headerHeight;

      // Booking details row
      const rowHeight = 70;
      doc.rect(tableX, currentY, tableWidth, rowHeight).fillColor('white').fill();
      doc.strokeColor('#E9ECEF').lineWidth(0.5).stroke();

      // Description column
      doc.fillColor('black').fontSize(10).font('Helvetica-Bold')
         .text('Venue Booking Service', tableX + 10, currentY + 15);
      doc.fontSize(9).font('Helvetica')
         .text('Premium venue rental service', tableX + 10, currentY + 30);

      // Venue column
      doc.fontSize(10).font('Helvetica')
         .text(venueName, tableX + col1Width + 10, currentY + 15, { 
           width: col2Width - 20, 
           ellipsis: true 
         });

      // Duration column
      const duration = Math.ceil((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60));
      doc.text(`${duration} hours`, tableX + col1Width + col2Width + 10, currentY + 15);
      doc.fontSize(9)
         .text(`${new Date(startTime).toLocaleDateString()}`, tableX + col1Width + col2Width + 10, currentY + 30);
      doc.text(`${new Date(startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`, 
               tableX + col1Width + col2Width + 10, currentY + 45);

      // Amount column - properly aligned
      doc.fontSize(12).font('Helvetica-Bold')
         .text(`Rs ${totalPrice.toLocaleString()}`, tableX + col1Width + col2Width + col3Width + 10, currentY + 20, {
           width: col4Width - 20,
           align: 'right'
         });

      currentY += rowHeight + 30;

      // --- Summary Section (FIXED) ---
      const summaryX = pageWidth - margin - 250;
      const summaryWidth = 250;

      // Subtotal line
      drawLine(summaryX, currentY, summaryX + summaryWidth, currentY, '#E9ECEF', 1);
      currentY += 15;

      // Subtotal
      doc.fillColor('black').fontSize(11).font('Helvetica')
         .text('Subtotal:', summaryX, currentY);
      doc.text(`Rs ${totalPrice.toLocaleString()}`, summaryX, currentY, {
        width: summaryWidth - 10,
        align: 'right'
      });
      currentY += 20;

      // Tax (if applicable)
      doc.text('Tax (0%):', summaryX, currentY);
      doc.text('Rs 0.00', summaryX, currentY, {
        width: summaryWidth - 10,
        align: 'right'
      });
      currentY += 25;

      // Total section with better styling
      doc.rect(summaryX, currentY, summaryWidth, 40).fillColor(primaryColor).fill();
      
      doc.fillColor('white').fontSize(14).font('Helvetica-Bold')
         .text('TOTAL:', summaryX + 15, currentY + 12);
      
      doc.text(`Rs ${totalPrice.toLocaleString()}`, summaryX + 15, currentY + 12, {
        width: summaryWidth - 30,
        align: 'right'
      });

      currentY += 70;

      // --- Terms & Footer ---
      doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold')
         .text('PAYMENT TERMS & CONDITIONS:', 50, currentY);
      currentY += 25;

      const terms = [
        '• Payment is due within 30 days of invoice date',
        '• Late payments may incur additional charges',
        '• Booking confirmation is subject to venue availability',
        '• Cancellation policy applies as per terms of service'
      ];

      doc.fillColor('black').fontSize(10).font('Helvetica');
      terms.forEach(term => {
        doc.text(term, 50, currentY);
        currentY += 15;
      });

      currentY += 30;

      // Footer
      drawLine(50, currentY, pageWidth - margin, currentY, '#E9ECEF');
      currentY += 20;

      doc.fillColor(darkGray).fontSize(9).font('Helvetica')
         .text('Thank you for choosing Venue Verse!', 50, currentY, { 
           align: 'center', 
           width: contentWidth 
         });
      currentY += 15;
      
      doc.text('Contact: venueventure25@gmail.com | +92‑321‑1234567', 50, currentY, { 
        align: 'center', 
        width: contentWidth 
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateInvoice;