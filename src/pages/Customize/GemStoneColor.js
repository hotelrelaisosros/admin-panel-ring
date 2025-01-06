  import React, { useState, useEffect } from 'react';
  import { Modal, Button, List, Card, Typography, Form, Avatar, Space, Popconfirm, Tooltip } from 'antd';
  import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
  import GemForm from './GemForm';
  import apiService from './apiService';

  const { Title } = Typography;

  const GemStoneColor = () => {
    const apiUrl = '/api/v1/products/gem_stones_colors';
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const key = "GemStoneColors"

    useEffect(() => {
      apiService.fetchItems(apiUrl, setItems,key);
    }, []);

    const showModal = () => setIsModalVisible(true);

    const handleCancel = () => {
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    };

    const onFinish = (values) => {
      if (editingItem) {
        apiService.updateItem(apiUrl, editingItem.id, values, setItems,"GemStoneColor");
      } else {
        apiService.addItem(apiUrl, values, setItems,"GemStoneColor");
      }
      handleCancel();
    };

    // Define specific fields for the GemStone form
    const gemStoneFields = [
      { name: 'name', label: 'Gem Stone Color Name', type: 'input', rules: [{ required: true, message: 'Please input the gem stone color name!' }] },
      { name: 'picture', label: 'Picture', type: 'upload', rules: [{ required: true, message: 'Please upload an image!' }] },
    ];

    const handleEdit = (item) => {
      setEditingItem(item);
      showModal();
    };

    const handleDelete = (id) => {
      apiService.deleteItem(apiUrl, id, setItems,key);
    };

    return (
      <div>
        <Card>
          <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={3} style={{ marginBottom: 0 }}>Gem Stone Color</Title>
            <Button type="primary" onClick={showModal}>Add Gem Stone Color</Button>
          </Space>

          <List
            dataSource={items}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Tooltip title="edit">
                    <a onClick={() => handleEdit(item)}>
                      <EditOutlined style={{ color: 'green', fontSize: '20px' }} />
                    </a>
                  </Tooltip>,
                  <Tooltip title="delete">
                    <a onClick={() => handleDelete(item.id)}>
                      <DeleteOutlined style={{ marginLeft: '15px', color: 'red', fontSize: '20px' }} />
                    </a>
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                
                  avatar={<Avatar size={60} src={item.image} />}
                  title={<div style={{ display: 'flex', alignItems: 'center', height: 60 }}><span>{item.name}</span></div>}
                
                />
              </List.Item>
            )}
          />
        </Card>

        <Modal
          title={`${editingItem ? 'Edit' : 'Add'} Gem Stone Color `}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <GemForm form={form} onFinish={onFinish} fields={gemStoneFields} editingItem={editingItem}  />
        </Modal>
      </div>
    );
  };

  export default GemStoneColor;
