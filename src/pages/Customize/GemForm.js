import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const GemForm = ({ form, onFinish, fields, editingItem, colors = [] }) => {
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue({
        ...editingItem,
      });

      if (editingItem.image) {
        setFileList([
          {
            uid: "-1",
            name: "existing_image.png",
            status: "done",
            url: editingItem.image,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [editingItem, form]);

  const beforeUpload = (file) => {
    setFile(file);
    setFileList([
      {
        uid: "-1",
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
      },
    ]);
    return false;
  };

  const handleFinish = (values) => {
    const formData = new FormData();

    // Append all values from the form except the picture key
    Object.keys(values).forEach((key) => {
      if (key === "picture") return;
      if (key === "gemstone_color_id") return;
      formData.append(key, values[key]);
    });

    if (file) {
      formData.append("image", file);
    } else if (editingItem?.image) {
      formData.append("image", editingItem.image);
    }

    if (values.gemstone_color_id) {
      formData.append("gemstone_color_id", values.gemstone_color_id);
      const color = colors.find(
        (option) => option.id === values.gemstone_color_id
      );
      if (!color) {
        console.error("Color not found for id:", values.gemstone_color_id);
        return;
      }
      formData.append("color", color.name);
    }

    if (onFinish) {
      onFinish(formData);
    }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={field.rules}
        >
          {field.type === "input" ? (
            <Input />
          ) : field.type === "upload" ? (
            <Upload
              name="file"
              listType="picture-card"
              fileList={fileList}
              showUploadList={true}
              beforeUpload={beforeUpload}
              onRemove={() => {
                setFile(null);
                setFileList([]);
              }}
            >
              {fileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Upload</Button>
              )}
            </Upload>
          ) : field.type === "select" ? (
            <Select
              placeholder={`Select ${field.label}`}
              allowClear
              options={field.options.map((option) => ({
                label: option.name,
                value: option.id,
              }))}
            />
          ) : null}
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {editingItem ? "Update" : "Add"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GemForm;
