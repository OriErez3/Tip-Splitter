import api from './api';

const receiptService = {
  async getMyReceipts() {
    const response = await api.get('/receipts/mine');
    return response.data;
  },

  async createReceipt(receiptData) {
    const response = await api.post('/receipts/', receiptData);
    return response.data;
  },

  async deleteReceipt(receiptID){
    const response = await api.delete(`/receipts/${receiptID}`)
    return response.data;
  },

  async updateReceipt(receiptID, receiptData) {
    const response = await api.put(`/receipts/${receiptID}`, receiptData);
    return response.data;
  },

  async getReceiptById(receiptID) {
    const response = await api.get(`/receipts/${receiptID}`);
    return response.data;
  }
};

export default receiptService;
