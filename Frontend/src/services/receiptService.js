import api from './api';

const receiptService = {
  async getMyReceipts() {
    const response = await api.get('/recipts/mine');
    return response.data;
  },

  async createReceipt(receiptData) {
    const response = await api.post('/recipts/', receiptData);
    return response.data;
  }
};

export default receiptService;
