
// apiService.js
import { message } from 'antd';
import ApiCaller from '../../utils/ApiCaller';

const apiService = {
  async fetchItems(apiUrl, setItemsCallback,key,token ) {
    try {
      const response = await ApiCaller.Get(apiUrl,token);
      setItemsCallback(response.data[key]);
    } catch (error) {
      message.error('Error fetching data');
    }
  },

  async addItem(apiUrl, values, setItemsCallback,key,token) {
    try {
     
      const response = await ApiCaller.Post(apiUrl, values,token);
     
      if (response.data["errors"]){
        message.error(response.data["errors"]);
      }
      else{

     
      setItemsCallback((prevItems) => [...prevItems, response.data[key]]);

      
     
        message.success('Item added successfully');
      }
    } catch (error) {

      message.error('Error adding item');
    }
  },

  async updateItem(apiUrl, id, values, setItemsCallback,key,token) {
    try {
      const response = await ApiCaller.Put(`${apiUrl}/${id}`, values,token  );
      

      setItemsCallback((prevItems) =>
          prevItems.map(item => (item.id === id ? { ...item, ...response.data[key] } : item))
      );
      message.success('Item updated successfully');
    } catch (error) {
      message.error('Error updating item');
    }
  },

  async deleteItem(apiUrl, id, setItemsCallback,key,token) {
    try {
      await ApiCaller.Delete(`${apiUrl}/${id}`,token);
      setItemsCallback((prevItems) => prevItems.filter(item => item.id !== id));
      message.success('Item deleted successfully');
    } catch (error) {
      message.error('Error deleting item');
    }
  },
};

export default apiService;
