const QRCode = require('qrcode');

const generateQRCodeDataURL = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#00E5FF',
        light: '#0B0F19',
      },
    });
  } catch (err) {
    throw new Error('Failed to generate mission pass QR code: ' + err.message);
  }
};

module.exports = { generateQRCodeDataURL };
