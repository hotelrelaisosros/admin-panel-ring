import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Switch,
  Modal,
  Tag,
} from "antd";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import apiService from "./apiService";
import { useDispatch, useSelector } from "react-redux";
import { CategoryMiddleware } from "../../store/category/categoryMiddleware";
import { SubCategoryMiddleware } from "../../store/category/categoryMiddleware";
import { base_Url } from "../../constants/Apibase";
const { Option } = Select;
const { TextArea } = Input;

const EditProduct = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const CollectData = location?.state || [];
  const [product, setProduct] = useState({});
  const [fileList, setFileList] = useState([]);
  const [variations, setVariations] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [tags, setTags] = useState([]);
  const [items, setItems] = useState({});
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const category = useSelector((state) => state.category.categories.Category);
  const subCategory = useSelector(
    (state) => state.subCategory.subCategories?.SubCategory
  );

  let token = localStorage.getItem("token");

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    dispatch(CategoryMiddleware.GetCategory(token));
  }, []);

  useEffect(() => {
    if (product.category) {
      dispatch(
        SubCategoryMiddleware.GetSubCategory({ id: product.category }, token)
      );
    }
  }, [product.category]);
  const handleVariationChange = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setVariations(newVariations);
  };

  // const addVariation = () => {
  //   setVariations([
  //     ...variations,
  //     { title: "", size: "", stock: "", price: "" },
  //   ]);
  // };

  // const removeVariation = (index) => {
  //   setVariations(variations.filter((_, i) => i !== index));
  // };

  useEffect(() => {
    if (id && CollectData) {
      setProduct(CollectData);

      // Prefill the form fields
      form.setFieldsValue({
        title: CollectData.title,
        price: CollectData.price,
        color: CollectData.color,
        discount: CollectData.discount,
        product_desc: CollectData.product_desc,
        category: CollectData.sub_category?.categories?.id,
        sub_category_id: CollectData.sub_category?.id,
        is_active: CollectData.is_active === "1",
        is_delete: CollectData.is_delete === "1",
        is_featured: CollectData.is_featured === "1",
        is_new_arrival: CollectData.is_new_arrival === "1",
        is_trending: CollectData.is_trending === "1",
        //  variation: CollectData.variation,
      });

      // if (Array.isArray(CollectData.variations)) {
      //   setVariations(
      //     CollectData.variations.map((v) => ({
      //       title: v.title || "",
      //       size: v.size || "",
      //       stock: v.stock || "",
      //       price: v.price || "",
      //     }))
      //   );
      // }

      if (Array.isArray(CollectData.image)) {
        setFileList(
          CollectData.image.map((image, index) => ({
            uid: `-${index}`,
            name: `image-${index}`,
            status: "done",
            url: base_Url + "/" + image.image,
            id: image.id,
          }))
        );
      }

      // Prefill tags
      if (CollectData.tags) {
        setTags(CollectData.tags.split(",").filter((tag) => tag));
      }
    }
  }, [id, CollectData, form]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images[]", file.originFileObj);
        }
      });

      variations.forEach((variation, index) => {
        Object.keys(variation).forEach((key) => {
          formData.append(`variations[${index}][${key}]`, variation[key]);
        });
      });

      const formattedValues = {
        ...values,
        id: id,
        is_active: values.is_active ? "1" : "0",
        is_delete: values.is_delete ? "1" : "0",
        is_featured: values.is_featured ? "1" : "0",
        is_new_arrival: values.is_new_arrival ? "1" : "0",
        is_trending: values.is_trending ? "1" : "0",
        tags: tags.join(","), // Convert tags array to a string
      };
      console.log(formattedValues);
      // Append each value to FormData
      Object.keys(formattedValues).forEach((key) => {
        if (
          typeof formattedValues[key] === "object" &&
          !Array.isArray(formattedValues[key])
        ) {
          formData.append(key, JSON.stringify(formattedValues[key])); // Stringify nested objects
        } else {
          formData.append(key, formattedValues[key]);
        }
      });

      // Log FormData entries for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log(formData);
      // Send API request
      await apiService.updateItem(
        "/update/product",

        formData,
        setItems,
        "updatedData",
        token
      );
      // message.success("Product updated successfully");
      // history.push(`/productProfile/${id}`);
    } catch (error) {
      console.error("Error:", error);
      message.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  // const handleVariationChange = (index, field, value) => {
  //   const newVariations = [...variations];
  //   newVariations[index] = {
  //     ...newVariations[index],
  //     [field]: value,
  //   };
  //   setVariations(newVariations);
  // };

  // const addVariation = () => {
  //   setVariations([
  //     ...variations,
  //     { size: "", stock: "", price: "", title: "" },
  //   ]);
  // };

  // const removeVariation = (index) => {
  //   const newVariations = variations.filter((_, i) => i !== index);
  //   setVariations(newVariations);
  // };

  const handleCategoryChange = (categoryId) => {
    setProduct({ ...product, category: categoryId });
    form.setFieldsValue({ subcategory: undefined });
    dispatch(SubCategoryMiddleware.GetSubCategory({ id: categoryId }, token));
  };

  const handleSubCategoryChange = (value) => {
    setProduct({ ...product, subcategory: value });
  };

  return (
    <Card title="Edit Product">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            onChange={handleCategoryChange}
            placeholder="Select category first"
          >
            {category?.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="sub_category_id"
          label="subcategory"
          rules={[{ required: true, message: "Please select a subcategory" }]}
        >
          <Select
            onChange={handleSubCategoryChange}
            placeholder="Select category first"
            disabled={!product.category}
          >
            {subCategory?.map((subcat) => (
              <Option key={subcat.id} value={subcat.id}>
                {subcat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="Product Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Base Price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Discount"
          rules={[{ required: true, message: "Please enter discount" }]}
        >
          <Input type="number" min={0} max={100} />
        </Form.Item>

        <Form.Item label="Tags">
          {tags.map((tag, index) => {
            return (
              <Tag key={tag} closable onClose={() => handleClose(tag)}>
                {tag}
              </Tag>
            );
          })}
          {inputVisible ? (
            <Input
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            <Tag
              onClick={() => setInputVisible(true)}
              className="site-tag-plus"
            >
              <PlusOutlined /> New Tag
            </Tag>
          )}
        </Form.Item>

        {console.log(variations.length)}

        {/* <Card title="Product Variations">
          {variations.map((variation, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <div>Title</div>
                <Input
                  placeholder="Title"
                  value={variation.title}
                  onChange={(e) =>
                    handleVariationChange(index, "title", e.target.value)
                  }
                  style={{ width: "100px" }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <div>Size</div>
                <Input
                  placeholder="Size"
                  value={variation.size}
                  onChange={(e) =>
                    handleVariationChange(index, "size", e.target.value)
                  }
                  style={{ width: "100px" }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <div>Stock</div>
                <Input
                  placeholder="Stock"
                  type="number"
                  min={0}
                  value={variation.stock}
                  onChange={(e) =>
                    handleVariationChange(index, "stock", e.target.value)
                  }
                  style={{ width: "100px" }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <div>Price</div>
                <Input
                  placeholder="Price"
                  type="number"
                  min={0}
                  value={variation.price}
                  onChange={(e) =>
                    handleVariationChange(index, "price", e.target.value)
                  }
                  style={{ width: "100px" }}
                />
              </div>
              <Button
                onClick={() => removeVariation(index)}
                danger
                style={{ marginTop: "auto" }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={addVariation} type="dashed" block>
            Add Variation
          </Button>
        </Card> */}

        <Form.Item
          name="product_desc"
          label="Description"
          rules={[
            { required: true, message: "Please enter product description" },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="is_active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="is_featured" label="Featured" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          name="is_new_arrival"
          label="New Arrival"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item name="is_trending" label="Trending" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="image" label="Product Images">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={async (file) => {
              const preview = file.url || (await getBase64(file.originFileObj));
              setPreviewImage(preview);
              setPreviewVisible(true);
            }}
            onChange={({ fileList: newFileList }) => {
              setFileList(newFileList);
            }}
            onRemove={async (file) => {
              try {
                if (file.id) {
                  await apiService.Post(
                    `/delete/image`,
                    { id: file.id },
                    token
                  );
                  message.success("Image deleted successfully");
                }
                const newFileList = fileList.filter(
                  (item) => item.uid !== file.uid
                );
                setFileList(newFileList);
              } catch (error) {
                message.error("Failed to delete image");
                return false;
              }
            }}
            {...uploadProps}
          >
            {fileList.length >= 8 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Modal
            visible={previewVisible}
            title="Image Preview"
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="preview" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditProduct;
