import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  List,
  Card,
  Typography,
  Form,
  Avatar,
  Space,
  Popconfirm,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import GemForm from "./GemForm";
import apiService from "./apiService";
import { message } from "antd";

const { Title } = Typography;

const MetalTypes = () => {
  const apiUrl = "/api/v1/products/metal_type_category";
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const key = "metal_types";

  useEffect(() => {
    apiService.fetchItems(apiUrl, setItems, key);
  }, []);
  console.log(items);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (editingItem) {
      apiService.updateItem(
        apiUrl,
        editingItem.id,
        values,
        setItems,
        "metal_type"
      );
    } else {
      const error = apiService.addItem(apiUrl, values, setItems, "metal_type");
      if (error) {
        message.error(error);
      }
    }
    handleCancel();
  };

  // Define specific fields for the GemStone form
  const gemStoneFields = [
    {
      name: "title",
      label: "Title",
      type: "input",
      rules: [{ required: true, message: "Please input the title!" }],
    },
    {
      name: "type",
      label: "Metal Type",
      type: "select",
      options: [
        { name: "Platinum", id: "P" },
        { name: "Yellow Gold", id: "YG" },
        { name: "Rose Gold", id: "RG" },
        { name: "White Gold", id: "WG" },
        { name: "Yellow Plated", id: "YP" },
        { name: "Rose Plated", id: "RP" },
      ],
      rules: [{ required: true, message: "Please input the metal type!" }],
    },
    {
      name: "picture",
      label: "Picture",
      type: "upload",
      rules: [
        {
          required: editingItem ? false : true,
          message: "Please upload an image!",
        },
      ],
    },
  ];

  const handleEdit = (item) => {
    setEditingItem(item);
    showModal();
  };

  const handleDelete = (id) => {
    apiService.deleteItem(apiUrl, id, setItems, key);
  };

  return (
    <div>
      <Card>
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Title level={3} style={{ marginBottom: 0 }}>
            Metal Types
          </Title>
          <Button
            type="primary"
            onClick={() => {
              setEditingItem(null);
              showModal();
            }}
          >
            Add Metal Types
          </Button>
        </Space>

        <List
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Tooltip title="edit">
                  <a onClick={() => handleEdit(item)}>
                    <EditOutlined
                      style={{ color: "green", fontSize: "20px" }}
                    />
                  </a>
                </Tooltip>,
                <Tooltip title="delete">
                  <a onClick={() => handleDelete(item.id)}>
                    <DeleteOutlined
                      style={{
                        marginLeft: "15px",
                        color: "red",
                        fontSize: "20px",
                      }}
                    />
                  </a>
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar size={60} src={item.image} />}
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: 60,
                    }}
                  >
                    <span>{item.title}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={`${editingItem ? "Edit" : "Add"} Metal Types `}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <GemForm
          form={form}
          onFinish={onFinish}
          fields={gemStoneFields}
          editingItem={editingItem}
        />
      </Modal>
    </div>
  );
};

export default MetalTypes;
