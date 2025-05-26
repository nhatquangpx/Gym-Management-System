import axios from '../utils/axiosConfig';

/**
 * Service for interacting with the membership history API
 */
const membershipHistoryService = {
  /**
   * Get the current user's membership history
   * @returns {Promise<Object>} History data with success flag and membership history array
   */
  getMyHistory: async () => {
    try {
      const response = await axios.get('/api/membership-history/my-history');
      return response.data;
    } catch (error) {
      console.error('Error fetching membership history:', error);
      throw error;
    }
  },

  /**
   * Get a specific user's membership history (admin/staff only)
   * @param {string} userId - The ID of the user to fetch history for
   * @returns {Promise<Object>} History data with success flag and membership history array
   */
  getUserHistory: async (userId) => {
    try {
      const response = await axios.get(`/api/membership-history/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId} membership history:`, error);
      throw error;
    }
  },

  /**
   * Get details of a specific membership history record
   * @param {string} id - The ID of the membership history record
   * @returns {Promise<Object>} Membership history record details
   */
  getMembershipHistoryById: async (id) => {
    try {
      const response = await axios.get(`/api/membership-history/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching membership history record ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update a membership history record (admin/staff only)
   * @param {string} id - The ID of the membership history record to update
   * @param {Object} updates - The fields to update
   * @returns {Promise<Object>} Updated membership history record
   */
  updateMembershipHistory: async (id, updates) => {
    try {
      const response = await axios.put(`/api/membership-history/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating membership history record ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancel a membership (admin/staff only)
   * @param {string} id - The ID of the membership history record to cancel
   * @param {string} reason - Reason for cancellation
   * @returns {Promise<Object>} Cancelled membership history record
   */
  cancelMembership: async (id, reason) => {
    try {
      const response = await axios.put(`/api/membership-history/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling membership ${id}:`, error);
      throw error;
    }
  }
};

export default membershipHistoryService;
