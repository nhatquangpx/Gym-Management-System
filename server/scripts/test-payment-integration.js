/**
 * Test script for payment integration
 * This script helps test the payment integration features of the system
 * including bank transfer, receipt uploads, and VNPAY integration.
 * 
 * Run with: node scripts/test-payment-integration.js
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:8001/api';
const TEST_USER_ID = '67fd385a6fc55fa103711263'; // Fill in an existing user ID
const TEST_PACKAGE_ID = '680076fbf5eba5444fa93142'; // Fill in an existing package ID

// Test data
const bankPaymentData = {
  userId: TEST_USER_ID,
  packageId: TEST_PACKAGE_ID,
  paymentMethod: 'banking',
  amount: 500000, // 500,000 VND
  orderInfo: 'Test bank payment',
  bankId: 'vietcombank'
};

const momoPaymentData = {
  userId: TEST_USER_ID,
  packageId: TEST_PACKAGE_ID,
  paymentMethod: 'momo',
  amount: 500000, // 500,000 VND
  orderInfo: 'Test MoMo payment'
};

const vnpayPaymentData = {
  userId: TEST_USER_ID,
  packageId: TEST_PACKAGE_ID
};

// Helper functions
const createColor = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const logSuccess = (msg) => console.log(`${createColor.green}✓ ${msg}${createColor.reset}`);
const logError = (msg) => console.log(`${createColor.red}✗ ${msg}${createColor.reset}`);
const logInfo = (msg) => console.log(`${createColor.blue}ℹ ${msg}${createColor.reset}`);
const logWarn = (msg) => console.log(`${createColor.yellow}⚠ ${msg}${createColor.reset}`);

// Test functions
async function testCreateBankPayment() {
  try {
    logInfo('Testing bank payment creation...');
    
    if (!TEST_USER_ID || !TEST_PACKAGE_ID) {
      logWarn('Please fill in TEST_USER_ID and TEST_PACKAGE_ID in the script before running this test.');
      return null;
    }
    
    const response = await axios.post(`${API_URL}/orders/manual`, bankPaymentData);
    
    if (response.data.success) {
      logSuccess('Bank payment created successfully');
      console.log('Order ID:', response.data.order.orderId);
      console.log('Amount:', response.data.order.amount);
      console.log('Status:', response.data.order.status);
      return response.data.order;
    } else {
      logError('Failed to create bank payment');
      console.error(response.data);
      return null;
    }
  } catch (error) {
    logError('Error creating bank payment');
    console.error(error.response?.data || error.message);
    return null;
  }
}

async function testUploadReceipt(orderId) {
  try {
    logInfo('Testing receipt upload...');
    
    if (!orderId) {
      logWarn('No order ID provided. Please run testCreateBankPayment first or provide an order ID.');
      return false;
    }
    
    // Create a test receipt image if it doesn't exist
    const testImagePath = path.join(__dirname, 'test-receipt.jpg');
    if (!fs.existsSync(testImagePath)) {
      logWarn('Test receipt image not found. Please create a test-receipt.jpg file in the scripts folder.');
      return false;
    }
    
    const formData = new FormData();
    formData.append('receipt', fs.createReadStream(testImagePath));
    formData.append('orderId', orderId);
    
    const response = await axios.post(`${API_URL}/orders/upload-receipt`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    if (response.data.success) {
      logSuccess('Receipt uploaded successfully');
      console.log('Receipt path:', response.data.data.receiptImage);
      return true;
    } else {
      logError('Failed to upload receipt');
      console.error(response.data);
      return false;
    }
  } catch (error) {
    logError('Error uploading receipt');
    console.error(error.response?.data || error.message);
    return false;
  }
}

async function testCreateVNPayPayment() {
  try {
    logInfo('Testing VNPAY payment creation...');
    
    if (!TEST_USER_ID || !TEST_PACKAGE_ID) {
      logWarn('Please fill in TEST_USER_ID and TEST_PACKAGE_ID in the script before running this test.');
      return false;
    }
    
    const paymentUrl = `${API_URL}/payment/vnpay`;
    console.log(paymentUrl);
    const response = await axios.post(paymentUrl, vnpayPaymentData);
    
    if (response.data.paymentUrl) {
      logSuccess('VNPAY payment URL generated successfully');
      console.log('Payment URL:', response.data.paymentUrl);
      return true;
    } else {
      logError('Failed to create VNPAY payment');
      console.error(response.data);
      return false;
    }
  } catch (error) {
    logError('Error creating VNPAY payment');
    console.error(error.response?.data || error.message);
    return false;
  }
}

// Main function
async function runTests() {
  logInfo('Starting payment integration tests...');
  console.log('----------------------------------------');
  
  // Test bank payment creation
  const bankOrder = await testCreateBankPayment();
  console.log('----------------------------------------');
  
  // Test receipt upload
  if (bankOrder) {
    await testUploadReceipt(bankOrder.orderId);
    console.log('----------------------------------------');
  }
  
  // Test VNPAY payment
  await testCreateVNPayPayment();
  console.log('----------------------------------------');
  
  logInfo('Testing complete!');
}

// Run the tests
runTests().catch(error => {
  logError('Unexpected error during tests');
  console.error(error);
});
