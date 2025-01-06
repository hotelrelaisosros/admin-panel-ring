import { message } from "antd";
import ApiCaller from "../../utils/ApiCaller";

const apiService = {
  async fetchItems(apiUrl, setItemsCallback, key, token, setLoading) {
    try {
      const response = await ApiCaller.Post(apiUrl, token);
      setItemsCallback(response.data.charges.data);
    } catch (error) {
      message.error("Error fetching data");
    }
  },
  async refundTransaction(apiUrl, data) {
    try {
      const response = await ApiCaller.Post(apiUrl, data);
      message.info(response.data.message);
    } catch (error) {
      message.error("Error fetching data");
    }
  },
};

export default apiService;
