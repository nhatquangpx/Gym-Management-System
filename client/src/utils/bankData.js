// Bank data utility for the payment system
export const banks = [
  {
    id: 'vietcombank',
    name: 'Vietcombank',
    logo: 'https://inkythuatso.com/uploads/thumbnails/800/2021/09/logo-vietcombank-inkythuatso-01-28-16-01-06.jpg',
    accountNumber: '1234567890',
    accountName: 'GYMPRO CENTER',
    qrPrefix: 'https://img.vietqr.io/image/vietcombank-1234567890-compact2.jpg?amount='
  },
  {
    id: 'tpbank',
    name: 'TPBank',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/TPBank_logo.png',
    accountNumber: '0987654321',
    accountName: 'GYMPRO CENTER',
    qrPrefix: 'https://img.vietqr.io/image/tpbank-0987654321-compact2.jpg?amount='
  },
  {
    id: 'mbbank',
    name: 'MB Bank',
    logo: 'https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-mb-bank-inkythuatso-11-10-24-27.jpg',
    accountNumber: '0123456789',
    accountName: 'GYMPRO CENTER',
    qrPrefix: 'https://img.vietqr.io/image/mb-0123456789-compact2.jpg?amount='
  },
  {
    id: 'bidv',
    name: 'BIDV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/BIDV_logo.png',
    accountNumber: '9876543210',
    accountName: 'GYMPRO CENTER',
    qrPrefix: 'https://img.vietqr.io/image/bidv-9876543210-compact2.jpg?amount='
  }
];

/**
 * Get a bank's data by ID
 * @param {string} bankId - The bank ID
 * @returns {Object|null} The bank data or null if not found
 */
export const getBankById = (bankId) => {
  return banks.find(bank => bank.id === bankId) || null;
};

/**
 * Generate a QR code URL for a specific bank with payment details
 * @param {string} bankId - The bank ID
 * @param {number} amount - The payment amount
 * @param {string} content - The transfer content
 * @returns {string} The QR code URL
 */
export const generateQRCode = (bankId, amount, content) => {
  const bank = getBankById(bankId);
  if (!bank) return null;
  
  // Format URL with amount and content
  return `${bank.qrPrefix}${amount}&addInfo=${encodeURIComponent(content)}`;
};
