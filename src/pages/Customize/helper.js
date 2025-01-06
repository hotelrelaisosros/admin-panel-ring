import axios from 'axios';

const apiUrl = 'https://real.heroksa.net/api/v1/products/gemshapes';

// Helper functions to interact with the API
const fetchItems = async (field) => {
  try {
    const response = await axios.get(apiUrl);
    return response.data; // Adjust according to your API response structure
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

const createItem = async (field, values) => {
  try {
    const response = await axios.post(apiUrl, values);
    return response.data; // Return the created item data
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

const updateItem = async (field, itemId, values) => {
  try {
    const response = await axios.put(`${apiUrl}/${itemId}`, values);
    return response.data; // Return the updated item data
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

const deleteItem = async (field, itemId) => {
  try {
    const response = await axios.delete(`${apiUrl}/${itemId}`);
    return response.data; // Return success or deleted item
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
