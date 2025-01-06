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
import { useHistory } from "react-router-dom";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { CategoryMiddleware } from "../../store/category/categoryMiddleware";
import { SubCategoryMiddleware } from "../../store/category/categoryMiddleware";
import ApiCaller from "../../utils/ApiCaller";
const { Option } = Select;
const { TextArea } = Input;

const AddProduct = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [fileList, setFileList] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [variations, setVariations] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [tags, setTags] = useState([]);
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

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // if (variations.length > 0) {
      //   const isValid = variations.every(
      //     (v) =>
      //       v.title &&
      //       v.size &&
      //       v.stock &&
      //       v.price &&
      //       Number(v.stock) >= 0 &&
      //       Number(v.price) >= 0
      //   );

      //   if (!isValid) {
      //     message.error("Please fill all variation fields with valid values");
      //     return;
      //   }
      // }

      console.log("values", values, values.title);
      const formData = new FormData();
      formData.append("title", values.title || "");
      formData.append("price", values.price || "");
      formData.append("discount", values.discount || "");
      formData.append("product_desc", values.product_desc || "");
      formData.append("is_active", values.is_active ? "1" : "0");
      formData.append("is_featured", values.is_featured ? "1" : "0");
      formData.append("is_new_arrival", values.is_new_arrival ? "1" : "0");
      formData.append("is_trending", values.is_trending ? "1" : "0");
      formData.append("sub_category_id", product.subcategory || "");

      // Log each value before appending
      console.log("Title:", values.title);
      console.log("Price:", values.price);
      console.log("Discount:", values.discount);
      console.log("Description:", values.product_desc);
      console.log("Subcategory:", product.subcategory);

      // Append variations if they exist
      // if (variations && variations.length > 0) {
      //   variations.forEach((variation, index) => {
      //     if (variation.title) {
      //       formData.append(
      //         `variations[${index}][title]`,
      //         variation.size.toString()
      //       );
      //       console.log(`Variation ${index} title:`, variation.title);
      //     }
      //     if (variation.size) {
      //       formData.append(
      //         `variations[${index}][size]`,
      //         variation.size.toString()
      //       );
      //       console.log(`Variation ${index} size:`, variation.size);
      //     }
      //     if (variation.stock) {
      //       formData.append(
      //         `variations[${index}][stock]`,
      //         variation.stock.toString()
      //       );
      //       console.log(`Variation ${index} stock:`, variation.stock);
      //     }
      //     if (variation.price) {
      //       formData.append(
      //         `variations[${index}][price]`,
      //         variation.price.toString()
      //       );
      //       console.log(`Variation ${index} price:`, variation.price);
      //     }
      //   });
      // }

      // Append tags if they exist
      if (tags.length > 0) {
        formData.append("tags", tags.join(","));
      }

      // Append single image if it exists
      if (singleImage?.originFileObj) {
        formData.append("product_single_image", singleImage.originFileObj);
      }

      // Append multiple images if they exist
      if (fileList.length > 0) {
        fileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append("product_multiple_images[]", file.originFileObj);
          }
        });
      }
      //const BearerHeaders = ApiCaller.BearerHeaders(token);

      const response = await ApiCaller.Post(
        "/add/product",
        formData
        // BearerHeaders
      );

      if (response?.status === 200) {
        message.success("Product added successfully");
        history.push("/productApproval");
      } else {
        message.error(response?.message || "Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error adding product");
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

  const singleImageUploadProps = {
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
      setSingleImage(file);
      return false;
    },
    fileList: singleImage ? [singleImage] : [],
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

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <Card title="Add Product">
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
          name="subcategory"
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

        <Form.Item name="discount" label="Discount">
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

        <Form.Item
          name="product_single_image"
          label="Main Product Image"
          rules={[
            { required: true, message: "Please upload a main product image" },
          ]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            onPreview={async (file) => {
              const preview = file.url || (await getBase64(file.originFileObj));
              setPreviewImage(preview);
              setPreviewVisible(true);
            }}
            onChange={({ fileList }) => setSingleImage(fileList[0])}
            {...singleImageUploadProps}
          >
            {!singleImage && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload Main Image</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="product_multiple_images"
          label="Additional Product Images"
        >
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

        {product.subcategory === 1 && (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() =>
                history.push(`/customization/${product.id}`, { state: product })
              }
            >
              Customize Product
            </Button>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddProduct;
