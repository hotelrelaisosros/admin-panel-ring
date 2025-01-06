import { message } from "antd";
import ApiCaller from "../../utils/ApiCaller";
import { toast } from "react-toastify";
const apiService = {
  async fetchItems(apiUrl, setItemsCallback, key) {
    try {
      const response = await ApiCaller.Get(apiUrl);
      console.log(response.data[key]);
      console.log(response);
      setItemsCallback(response.data[key]);
    } catch (error) {
      message.error("Error fetching data", error);
    }
  },

  async addItem(apiUrl, values, setItemsCallback, key) {
    try {
      const response = await ApiCaller.Post(apiUrl, values);

      if (response.data["errors"]) {
        const errorText = Object.values(response.data["errors"]).join(", ");
        console.log(errorText);
        message.error(errorText);
        toast.error(errorText, {
          position: "bottom-left",
          autoClose: 2000,
        });
        return errorText; // Return the error message
      }
      setItemsCallback((prevItems) => [...prevItems, response.data[key]]);
      message.success("Item added successfully");
      return null; // Return null to indicate success
    } catch (error) {
      console.log(error);
      const errorMessage = error.message || "Error adding item";
      message.error(errorMessage);
      return errorMessage; // Return the error message
    }
  },

  async updateItem(apiUrl, id, values, setItemsCallback, key) {
    try {
      const response = await ApiCaller.Post(`${apiUrl}/${id}`, values);

      setItemsCallback((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, ...response.data[key] } : item
        )
      );
      message.success("Item updated successfully");
    } catch (error) {
      message.error("Error updating item");
    }
  },
  async updateItemPut(apiUrl, id, values, setItemsCallback, key) {
    try {
      const response = await ApiCaller.Put(`${apiUrl}/${id}`, values);

      setItemsCallback((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, ...response.data[key] } : item
        )
      );
      message.success("Item updated successfully");
    } catch (error) {
      message.error("Error updating item");
    }
  },
  async deleteItem(apiUrl, id, setItemsCallback, key) {
    try {
      await ApiCaller.Delete(`${apiUrl}/${id}`);
      setItemsCallback((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
      message.success("Item deleted successfully");
    } catch (error) {
      message.error("Error deleting item");
    }
  },
};

export default apiService;
