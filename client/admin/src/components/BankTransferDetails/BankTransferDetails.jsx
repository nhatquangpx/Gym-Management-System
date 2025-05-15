import React from 'react';
import { banks } from '../../utils/bankData';

const BankTransferDetails = ({ order }) => {
  // Find bank based on bankId from the order
  const bankInfo = banks.find(bank => bank.id === order.bankId) || null;
  
  return (
    <div className="mt-6 p-4 bg-[#2a2a2a] rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Chi tiết chuyển khoản ngân hàng</h3>
      
      <div className="mb-4">
        <div className="flex items-start mb-2">
          <span className="w-1/3 text-gray-400">Ngân hàng:</span>
          <div className="flex items-center">
            {bankInfo && (
              <img 
                src={bankInfo.logo} 
                alt={bankInfo.name} 
                className="w-6 h-6 mr-2 bg-white rounded p-[2px]" 
              />
            )}
            <span>{bankInfo?.name || order.bankId || 'Không xác định'}</span>
          </div>
        </div>
        
        {bankInfo && (
          <div className="flex mb-2">
            <span className="w-1/3 text-gray-400">Số tài khoản:</span>
            <span>{bankInfo.accountNumber}</span>
          </div>
        )}
        
        {order.receiptImage && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-300 mb-2">Biên lai đã tải lên:</h4>
            <div className="bg-[#1a1a1a] p-2 rounded">
              <img 
                src={order.receiptImage.startsWith('http') 
                  ? order.receiptImage 
                  : `${window.location.origin}${order.receiptImage}`
                } 
                alt="Receipt" 
                className="max-h-64 mx-auto"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>Tải lên lúc: {new Date(order.receiptUploadDate).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankTransferDetails;
