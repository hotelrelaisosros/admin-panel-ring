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

const GemShape = () => {
  const apiUrl = "/api/v1/products/gemshapes";
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const key = "gemshapes";

  useEffect(() => {
    apiService.fetchItems(apiUrl, setItems, key);
  }, []);

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
        "gemshape"
      );
    } else {
      const error = apiService.addItem(apiUrl, values, setItems, "gemshape");
      if (error) {
        message.error(error);
      }
    }
    handleCancel();
  };

  // Define specific fields for the GemStone form
  const gemStoneFields = [
    {
      name: "name",
      label: "Gem Shape Name",
      type: "input",
      rules: [{ required: true, message: "Please input the gem shape name!" }],
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
            Gem Shape
          </Title>
          <Button
            type="primary"
            onClick={() => {
              setEditingItem(null);
              showModal();
            }}
          >
            Add Gem Shape
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
                    <span>{item.name}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={`${editingItem ? "Edit" : "Add"} Birthstones `}
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

export default GemShape;
