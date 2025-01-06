import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  List,
  Card,
  Typography,
  Form,
  Space,
  Tooltip,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import GemForm from "./GemForm";
import apiService from "./apiService";
import { message } from "antd";

const { Title } = Typography;
const { Option } = Select;
const GemStone = () => {
  const apiUrl = "/api/v1/products/gem_stones";
  const colorApiUrl = "/api/v1/products/gem_stones_colors"; // URL for fetching color options
  const [items, setItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const key = "Gemstones";

  useEffect(() => {
    apiService.fetchItems(apiUrl, setItems, key);
    console.log(items);
    apiService.fetchItems(colorApiUrl, setColors, "GemStoneColors"); // Fetch color options when component mounts
  }, []);

  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (editingItem) {
      apiService.updateItemPut(
        apiUrl,
        editingItem.id,
        values,
        setItems,
        "Gemstone"
      );
    } else {
      const error = apiService.addItem(apiUrl, values, setItems, "Gemstone");
      if (error) {
        message.error(error);
      }
    }
    handleCancel();
  };

  // Define specific fields for the GemShape form, with gemstone_color_id as a dropdown
  const gemShapeFields = [
    {
      name: "type",
      label: "Stone Type",
      type: "input",
      rules: [{ required: true, message: "Please input the stone type!" }],
    },
    {
      name: "carat",
      label: "Stone Carat",
      type: "input",
      rules: [{ required: true, message: "Please input the stone carat!" }],
    },
    {
      name: "shape",
      label: "Stone Shape",
      type: "input",
      rules: [{ required: true, message: "Please input the stone shape!" }],
    },
    {
      name: "dimension",
      label: "Stone Dimension",
      type: "input",
      rules: [{ required: true, message: "Please input the stone dimension!" }],
    },
    {
      name: "faceting",
      label: "Stone Faceting",
      type: "input",
      rules: [{ required: true, message: "Please input the stone faceting!" }],
    },
    {
      name: "price",
      label: "Stone Price",
      type: "input",
      rules: [{ required: true, message: "Please input the stone price!" }],
    },
    {
      name: "gemstone_color_id",
      label: "Stone Color",
      type: "select",
      options: colors,
      rules: [{ required: true, message: "Please select the stone color!" }],
    },
    {
      name: "clarity",
      label: "Stone Clarity",
      type: "input",
      rules: [{ required: true, message: "Please input the stone clarity!" }],
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
            Gem Stones
          </Title>
          <Button type="primary" onClick={showModal}>
            Add Stone
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
                description={
                  <div>
                    <div>
                      <strong>Type:</strong>
                      {item.type}
                    </div>
                    <div>
                      <strong>Carat:</strong>
                      {item.carat}
                    </div>
                    <div>
                      <strong>Shape:</strong>
                      {item.shape}
                    </div>
                    <div>
                      <strong>Dimension:</strong>
                      {item.dimension}
                    </div>
                    <div>
                      <strong>Faceting:</strong>
                      {item.faceting}
                    </div>
                    <div>
                      <strong>Price:</strong>
                      {item.price}
                    </div>
                    <div>
                      <strong>Color:</strong>
                      {item.gemstone_color_id}
                    </div>
                    <div>
                      <strong>Clarity:</strong>
                      {item.clarity}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={`${editingItem ? "Edit" : "Add"} Stone`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <GemForm
          form={form}
          onFinish={onFinish}
          fields={gemShapeFields}
          editingItem={editingItem}
          colors={colors}
        />
      </Modal>
    </div>
  );
};

export default GemStone;
