import axios from 'axios';

/**
 * Utility functions to check membership status and manage renewals
 */

/**
 * Get the current membership status of the logged-in user
 * @returns {Promise<Object>} Membership status information
 */
export const getMembershipStatus = async () => {
  try {
    const response = await axios.get('/api/membership-status/membership-status');
    return response.data.membershipInfo;
  } catch (error) {
    console.error('Error fetching membership status:', error);
    throw error;
  }
};

/**
 * Format a date string into a readable format
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format remaining days message
 * @param {number} days - Number of days (positive for remaining, negative for expired)
 * @returns {string} Formatted message
 */
export const formatRemainingDays = (days) => {
  if (!days && days !== 0) return '';
  
  if (days > 0) {
    return `Còn ${days} ngày`;
  } else if (days < 0) {
    return `Đã hết hạn ${Math.abs(days)} ngày`;
  } else {
    return 'Hết hạn hôm nay';
  }
};

/**
 * Determine if user is eligible for renewal or new registration
 * @param {Object} membershipInfo - The user's membership info
 * @returns {Object} Eligibility and recommended action
 */
export const getRenewalEligibility = (membershipInfo) => {
  if (!membershipInfo) {
    return {
      eligible: false,
      action: 'register',
      message: 'Bạn chưa có gói tập. Hãy đăng ký một gói tập mới.'
    };
  }
  
  if (membershipInfo.status === 'active') {
    // Active membership eligible for renewal
    return {
      eligible: true,
      action: 'renew',
      message: 'Bạn có thể gia hạn gói tập hiện tại.'
    };
  } else if (membershipInfo.status === 'expired') {
    // Expired membership eligible for "buy more"
    return {
      eligible: true,
      action: 'buyMore',
      message: 'Gói tập của bạn đã hết hạn. Bạn có thể mua thêm gói tập mới.'
    };
  } else {
    // No membership, register new
    return {
      eligible: false,
      action: 'register',
      message: 'Bạn cần đăng ký một gói tập.'
    };
  }
};
