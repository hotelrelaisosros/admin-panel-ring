import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeTwoTone,
   EditOutlined, DeleteOutlined, 
   PlusOutlined,
   UnorderedListOutlined,
   PictureOutlined
,
SettingOutlined
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";

import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Table,
  Tooltip,
  Upload,
} from "antd";
import "./product.css";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthMiddleware } from "../../store/auth/authMiddleware";
import { setLoading } from "../../store/common/commonSlice";
import IMG_URL from "../../utils/imageurl";
import axios from "axios";
import { base_Url } from "../../constants/Apibase";
import var_image from "../../assets/images/var.png";

// const TextArea = Input;
const ProductApproval = () => {
  const { Search } = Input;
  let history = useHistory();
  const [productPage, setProductPage] = useState(1);
  const [selectSec, setSelectSec] = useState("Approved");
    const [search, setSearch] = useState("");
  const [rejectMessage, setRejectMessage] = useState("");
  const dispatch = useDispatch();
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const approvalProducts = useSelector((state) => state.auth.approvalProducts);
  const [error, setError] = useState(false);
  const [totalProd, setTotalProd] = useState([]);
  const [prodData, setProdData] = useState([]);
  const [trendStatus, setTrendStatus] = useState(prodData.is_trending);
  const { confirm } = Modal;
  const [previewOpenApproveProduct, setPreviewOpenApproveProduct] =
    useState(false);
  const [previewOpenDeclineProduct, setPreviewOpenDeclineProduct] =
    useState(false);
  const [productDetailClose, setProductDetailClose] = useState(false);
  const [productId, setProductId] = useState();
  const [imageManageModal, setImageManageModal] = useState(false);
  const [selectedProdForImage, setSelectedProdForImage] = useState(null);
  const [imageFiles, setImageFiles] = useState({
    product_multiple_images: [],
    product_single_image: null,
    product_small_image: null
  });
  const [editingRow, setEditingRow] = useState(null);


  const [existingImages, setExistingImages] = useState({
    product_multiple_images: [],
    product_single_image: null,
    product_small_image: null
  });
  const [variationsModal, setVariationsModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [variations, setVariations] = useState([]);

// Add this function to handle the button click


// Add function to handle variation addition
const handleAddVariation = async (values) => {
  console.log(values)
  try {
    const response = await axios.post(`${base_Url}/api/v1/variations`, {
      product_id: selectedProduct.id,
      ...values
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const responses = await axios.post(`${base_Url}/api/v1/variations/getall`, 
      {product_id:selectedProduct.id},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    setVariations(responses.data?.product_variations || []);
    toast.success('Variation added successfully');
  } catch (error) {
    toast.error('Failed to add variation');
  }
};

// Add function to handle variation update
const handleUpdateVariation = async (id, values) => {
  try {
    await axios.post(`${base_Url}/api/v1/variations/update/${id}`, {
      ...values
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const updatedVariations = variations.map(v => 
      v.id === id ? { ...v, ...values } : v
    );
    setVariations(updatedVariations);
    toast.success('Variation updated successfully');
  } catch (error) {
    toast.error('Failed to update variation');
  }
};

// Add function to handle variation deletion
const handleDeleteVariation = async (id) => {
  try {
    await axios.delete(`${base_Url}/api/v1/variations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setVariations(variations.filter(v => v.id !== id));
    toast.success('Variation deleted successfully');
  } catch (error) {
    toast.error('Failed to delete variation');
  }
};
  const { Option } = Select;
  const opt = [
    { option: "Approved" },
    { option: "Pending" },
    { option: "Rejected" },
  ];
  const opt2 = [
    { option: "All" },
    { option: "Retailer" },
    { option: "Wholesaler" },
  ];

  let token = localStorage.getItem("token");


  const handleImageUpdate = async () => {
    if (!selectedProdForImage) {
      toast.error('No product selected', {
        position: "bottom-left",
        autoClose: 2000,
      });
      return;
    }
    
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append('product_id', selectedProdForImage.id);
    
    // Handle multiple images
    if (imageFiles.product_multiple_images.length > 0) {
      imageFiles.product_multiple_images.forEach(file => {
        if (file.originFileObj) {
          formData.append('product_multiple_images[]', file.originFileObj);
        }
      });
    }
    
    // Handle single image
    if (imageFiles.product_single_image?.originFileObj) {
      formData.append('product_single_image', imageFiles.product_single_image.originFileObj);
    }
    
    // Handle small image
    if (imageFiles.product_small_image?.originFileObj) {
      formData.append('product_small_image', imageFiles.product_small_image.originFileObj);
    }
  
    try {
      // Choose endpoint based on whether product_image_id exists
      const endpoint = selectedProdForImage.product_image_id ? 
        `${base_Url}/update/image` : 
        `${base_Url}/add/image`;
  
      // If updating, include product_image_id
      if (selectedProdForImage.product_image_id) {
        formData.append('product_image_id', selectedProdForImage.product_image_id);
      }
  
      await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Images updated successfully', {
        position: "bottom-left",
        autoClose: 2000,
      });
      
      // Immediately refresh the images
      await getProductImages(selectedProdForImage.id);
  
    } catch (error) {
      toast.error(error.response?.data?.Message || 'Failed to update images', {
        position: "bottom-left",
        autoClose: 2000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("status", selectSec);
    formData.append("search", search);
   
    
    dispatch(AuthMiddleware.GetApprovalProducts(formData, token))
      .then((res) => {
        setTotalProd(res.data.ProductsCount);
        
      })
      .catch((err) => {
        console.error("Error fetching approval products:", err);
      });
  }, [selectSec]);

  const handleDeleteAllImages = async () => {
    try {
      dispatch(setLoading(true));
      
      await axios.post(`${base_Url}/delete/image`, {
        product_id: selectedProdForImage.id,
        delete_all: true
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      toast.success('All images deleted successfully', {
        position: "bottom-left",
        autoClose: 2000,
      });
  
      setImageManageModal(false);
      setImageFiles({
        product_multiple_images: [],
        product_single_image: null,
        product_small_image: null
      });
      setExistingImages({
        product_multiple_images: [],
        product_single_image: null,
        product_small_image: null
      });
  
    } catch (error) {
      toast.error(error.response?.data?.Message || 'Failed to delete images', {
        position: "bottom-left",
        autoClose: 2000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    setProductPage(page);
    const formData = new FormData();
 
      formData.append("skip", pageSize * (page - 1));
      formData.append("take", pageSize);
      formData.append("status", selectSec);
      formData.append("search", search);
      dispatch(AuthMiddleware.GetApprovalProducts(formData, token));
  }

  function handleSearch() {
    const formData = new FormData();

    //   formData.append("skip", 0);
    //   formData.append("take", 10);
    //   formData.append("status", selectSec);
    //   formData.append("search", search);
    //   dispatch(AuthMiddleware.GetApprovalProducts(formData, token))
    //     .then((res) => {
    //       toast.success(res.data?.Message, {
    //         position: "bottom-left",
    //         autoClose: 2000,
    //       });
    //       console.log("PRODUCTS FOUND SUCCESS =>", res);
    //     })
    //     .catch((err) => {
    //       toast.error(err?.data?.Message, {
    //         position: "bottom-left",
    //         autoClose: 2000,
    //       });
    //       console.log("PRODUCTS FOUND ERROR =>", err);
    //     });
    // } else {
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("status", selectSec);
      formData.append("search", search);
      dispatch(AuthMiddleware.GetApprovalProducts(formData, token))
        .then((res) => {
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("PRODUCTS FOUND SUCCESS =>", res);
        })
        .catch((err) => {
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("PRODUCTS FOUND ERROR =>", err);
        });
    // }
  }

  const handleChangeTable = (value) => {
    setSelectSec(value);
  };

  
  // const handleChangeTrend = (value) => {
  //   setSelectTrend(value);
  // };

  const handleOpenApproveProduct = (rowData) => {
   
    setPreviewOpenApproveProduct(true);
    setProductId(rowData.id);
  };
  const handleApproveProduct = () => {
    setPreviewOpenApproveProduct(false);
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("id", productId);
    formData.append("status", "approved");
    dispatch(AuthMiddleware.ProductStatusChange(token, formData)).then(
      (res) => {
        dispatch(setLoading(false));
     
          const formData = new FormData();
          formData.append("skip", 0);
          formData.append("take", 10);
          formData.append("status", selectSec);
          dispatch(AuthMiddleware.GetApprovalProducts(formData, token));
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
      }
    );
  };

  const handleOpenDeclineProduct = (rowData) => {
    setPreviewOpenDeclineProduct(true);
    setProductId(rowData.id);
  };
  const handleDeclineProduct = () => {
    const formData = new FormData();
    formData.append("id", productId);
    formData.append("status", "rejected");
    if (!rejectMessage) {
      setPreviewOpenDeclineProduct(true);
      dispatch(setLoading(false));
      toast.error("Please fill this field!", {
        position: "bottom-left",
        autoClose: 2000,
      });
      setError(true);
    }
    if (rejectMessage) {
      setPreviewOpenDeclineProduct(false);
      dispatch(setLoading(true));
      dispatch(AuthMiddleware.ProductStatusChange(token, formData)).then(
        (res) => {
          dispatch(setLoading(false));
          const formData = new FormData();
          formData.append("skip", 0);
          formData.append("take", 10);
          formData.append("status", selectSec);
          dispatch(AuthMiddleware.GetApprovalProducts(formData, token));
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
        }
      );
    }
  };

  // const handleOpenViewDetail = (rowData) => {
  //   setPreviewOpenApprove(true);
  //   setApproveProductId(rowData);
  // };

  const viewfunc = (rowData) => {
    // setProductDetailClose(true);
    setProdData(rowData);
    history.push({
      pathname: `/productProfile/${rowData.id}`,
      state: rowData,  // Pass order data to the OrderProfile page
    });
  };

  const handleOpenApproveOrder = (rowData) => {
    console.log("rowData", rowData);
  };

  const handleOpenDeclineOrder = (rowData) => {
    console.log("rowData", rowData);
  };

  const handleOpenUpdateModal = (rowData) => {
    history.push({
      pathname: `/editProduct/${rowData.id}`,
      state: rowData, // Pass product data to the edit page
    });
  };

  

  const handleOpenDelete = (rowData) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes", 
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        console.log("rowData", rowData,rowData.id);
        

        
        dispatch(AuthMiddleware.DeleteSpecificProduct(rowData.id, token))
          .then((res) => {
            dispatch(setLoading(false));
            const formData = new FormData();
            formData.append("skip", 0);
            formData.append("take", 10);
            formData.append("status", selectSec);
            dispatch(AuthMiddleware.GetApprovalProducts(formData, token));
            toast.success(res.data?.Message, {
              position: "bottom-left",
              autoClose: 2000,
            });
          })
          .catch((err) => {
            toast.error(err.data?.Message, {
              position: "bottom-left", 
              autoClose: 2000,
            });
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showTrendConfirm = (prodData) => {
    confirm({
      title: "Are you sure want to Trending this Product?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        // console.log("rowDataCancel", prodData.id);
        dispatch(AuthMiddleware.GetTranding(prodData.id, token))
          .then((res) => {
            console.log("res=>", res.data.Product.is_trending);
            setTrendStatus(res.data.Product.is_trending ? "1" : "0");
            dispatch(setLoading(false));
         
              const formData = new FormData();
              formData.append("skip", 0);
              formData.append("take", 10);
              formData.append("status", selectSec);
              dispatch(AuthMiddleware.GetApprovalProducts(formData, token));
              toast.success(res.data?.Message, {
                position: "bottom-left",
                autoClose: 2000,
              });
          })
          .catch((err) => {
            console.log("err=>", err);
            toast.error(err.data?.Message, {
              position: "bottom-left",
              autoClose: 2000,
            });
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleManageImagesClick = async (rowData) => {
    setSelectedProdForImage(rowData);
    setImageManageModal(true);
    await getProductImages(rowData.id);
  };
  const columns = [
    {
      title: <p>IMAGE</p>,
      fixed: "left",
      render: (rowData) => {
        return (
          <>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={70}
              src={`${IMG_URL}/` + rowData?.image[0]?.image}
            />
          </>
        );
      },
    },
    {
      title: <p>NAME</p>,
      // width: 210,
      // fixed: "left",
      render: (rowData) => {
        return (
          // <TextArea
          //   style={{ border: "none", boxShadow: "none" }}
          //   // placeholder="Autosize height with minimum and maximum number of lines"
          //   value={rowData.title}
          //   // autoSize
          //   // showCount
          //   disabled
          //   // maxLength={100}
          //   autoSize={{
          //     minRows: 4,
          //     maxRows: 4,
          //     // maxColumns: 8,
          //   }}
          // />
          <p>{rowData.title}</p>
        );
        // <Input className="w-100" value={rowData.title} maxLength={20} />;
      },
    },
 
    {
      title: <p>COLLECTION</p>,
      render: (rowData) => {
        return <p className="text-dark">{rowData.sub_category.name}</p>;
      },
    },

    {
      title: <p>STATUS</p>,
      dataIndex: "product_status",
      key: "product_status",
      render: (rowData) => {
        return (
          (rowData === "pending" && (
            <div
              style={{
                width: "75px",
                backgroundColor: "#ECA52B",
                borderRadius: "4px",
              }}
            >
              <p style={{ color: "white", padding: "5px 10px" }}>Pending</p>
            </div>
          )) ||
          (rowData === "approved" && (
            <div
              style={{
                width: "80px",
                backgroundColor: "#28A745",
                borderRadius: "4px",
              }}
            >
              <p style={{ color: "white", padding: "5px 10px" }}>Approved</p>
            </div>
          )) ||
          (rowData === "rejected" && (
            <div
              style={{
                width: "75px",
                backgroundColor: "#FF4D4F",
                borderRadius: "4px",
              }}
            >
              <p style={{ color: "white", padding: "5px 10px" }}>Rejected</p>
            </div>
          ))
        );
      },
    },
    {
      title: <p>PRICE</p>,
      dataIndex: "price",
      key: "price",
    },
    // {
    //   title: <p>DESCRIPTION</p>,
    //   dataIndex: "product_description",
    //   key: "product_description",
    //   width: "20%",
    // },
    // {
    //   // {rowData.product_status === "approved" && (
    //   title: <p>TRENDING</p>,
    //   // key: "Enable / Disable",
    //   // dataIndex: "Enable / Disable",
    //   render: (value, record) => {
    //     console.log("record=>", record);
    //     return (
    //       <>
    //         <Switch
    //           checked={record.is_trending === "1" ? true : false}
    //           onChange={() => handleOpenDisable(record)}
    //         />
    //         <p>{record.is_trending === "1" ? "Enable" : "Disable"}</p>
    //       </>
    //     );
    //   },
    // },
    {
      title: <p>ACTION</p>,
      fixed: "right",
      render: (rowData) => (
        <div className="ant-employed">
          {rowData.sub_category.id === 1 && (
            <SettingOutlined
            style={{
              fontSize: '20px', 
              margin:'20px',
              color: '#1890ff', 
              cursor: 'pointer',
            }}
            onClick={() => history.push(`/customization/${rowData.id}`, { state: rowData })}
          />
          )}
          
          <Tooltip title="VIEW">
            <a onClick={() => viewfunc(rowData)}>
              <EyeTwoTone style={{ fontSize: "20px" }} />
            </a>
          </Tooltip>

          <Tooltip title="edit">
            <a onClick={() => handleOpenUpdateModal(rowData)}>
              <EditOutlined style={{ color: "green", fontSize: "20px", margin: "0 15px" }} />
            </a>
          </Tooltip>

          <Tooltip title="delete">
            <a onClick={() => handleOpenDelete(rowData)}>
              <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
            </a>
          </Tooltip>

          {rowData.product_status !== "approved" && rowData.product_status !== "rejected" && (
            <>
              <Tooltip title="ACCEPT">
                <button
                  onClick={() => handleOpenApproveProduct(rowData)}
                  style={{ fontSize: "14px" }}
                  className="btn text-success"
                >
                  <CheckCircleOutlined style={{ fontSize: "20px" }} />
                </button>
              </Tooltip>
              <Tooltip title="REJECT">
                <button
                  onClick={() => handleOpenDeclineProduct(rowData)}
                  style={{ fontSize: "14px", marginLeft: "4px" }}
                  className="btn text-danger"
                >
                  <CloseCircleOutlined style={{ fontSize: "20px" }} />
                </button>
              </Tooltip>
            </>
          )}
{/* 
<Tooltip title="Manage Images">
  <Button
    type="default"
    onClick={() => handleManageImagesClick(rowData)}
    icon={<PlusOutlined />}
    style={{ marginLeft: '8px' }}
  >
    Manage Images
  </Button>
</Tooltip> */}
{ rowData.variation?.length=== 0 && <Tooltip title="Manage Images">
  <PictureOutlined
    style={{ margin: '15px', fontSize: '16px', cursor: 'pointer' }}
    onClick={() => {
      console.log(rowData, "rowData");
      history.push(`/viewVariationImages?product_id=${rowData.id}`);
    }}
  />
</Tooltip>}

<Tooltip title="Manage Variations">
  <UnorderedListOutlined
    style={{ margin: '15px', fontSize: '16px', cursor: 'pointer' }}
    onClick={() => {
      console.log(rowData, "rowData");
      history.push(`/variations/${rowData.id}`);
    }}
  />
</Tooltip>
        </div>
      ),
    },
  ];


  
   
  
  const handleDeleteImage = async (imageId) => {
    try {
      dispatch(setLoading(true));
      
      await axios.post(`${base_Url}/delete/image`, {
        id: imageId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Instantly remove the deleted image from the existingImages state
      setExistingImages(prev => ({
        product_multiple_images: prev.product_multiple_images.filter(img => img.uid !== imageId),
        product_single_image: prev.product_single_image?.uid === imageId ? null : prev.product_single_image,
        product_small_image: prev.product_small_image?.uid === imageId ? null : prev.product_small_image
      }));
  
      toast.success('Image deleted successfully', {
        position: "bottom-left",
        autoClose: 2000,
      });
  
    } catch (error) {
      toast.error(error.response?.data?.Message || 'Failed to delete image', {
        position: "bottom-left",
        autoClose: 2000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };
  const getProductImages = async (productId) => {
    try {
      const response = await axios.get(`${base_Url}/image/product_id/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.data && response.data.Images) {
        // Handle all images in the array
        const allMultipleImages = response.data.Images.reduce((acc, imageData) => {
          if (imageData.image_collection) {
            const images = imageData.image_collection.map(img => ({
              uid: imageData.id ,
              name: img.split('/').pop(),
              status: 'done',
              url: img,
              originFileObj: null
            }));
            return [...acc, ...images];
          }
          return acc;
        }, []);
  
        // Get the latest single and small images (from the last record)
        const lastImage = response.data.Images[response.data.Images.length - 1];
        
        const transformedImages = {
          product_multiple_images: allMultipleImages,
          product_single_image: lastImage.image ? {
            uid: lastImage.id,
            name: lastImage.image.split('/').pop(),
            status: 'done',
            url: lastImage.image,
            originFileObj: null
          } : null,
          product_small_image: lastImage.small_image ? {
            uid: `small_${lastImage.id}`,
            name: lastImage.small_image.split('/').pop(),
            status: 'done',
            url: lastImage.small_image,
            originFileObj: null
          } : null
        };
  
        console.log('Transformed Images:', transformedImages);
        setExistingImages(transformedImages);
      }
    } catch (error) {
      console.error('Error fetching product images:', error);
      toast.error('Failed to fetch product images');
    }
  };
    
  return (
    <>
      {load ? <Loader fullPage loading /> : null}
      {/* {networkError === true ? toast.error("No internet connection please check your connection!", {
        position: "bottom-left",
        autoClose: 2000,
      }) : ""} */}
      <ToastContainer />
      <div className="tabled">
        
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      fontSize: "24px",
                      color: "black",
                    }}
                  >
                    PRODUCTS
                  </p>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => history.push('/addProduct')}
                    style={{ marginRight: '20px' }}
                  >
                    Add Product
                  </Button>

                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Status
                  </label>
                  <div>
                    <Select
                      size="medium"
                      defaultValue="Approved"
                      style={{ width: "170px" }}
                      onSelect={handleChangeTable}
                    >
                      {opt.map((v, i) => (
                        <Option key={i} value={v.option}>
                          {v.option}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Search
                      value={search}
                      placeholder="Search product"
                      enterButton
                      onSearch={handleSearch}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                </div>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={approvalProducts?.Products}
                  className="ant-border-space"
                  pagination={{
                    position: ["bottomCenter"],
                    current: productPage !== undefined ? productPage : 1,
                    pageSize: 10,
                    total: approvalProducts?.ProductsCount,
                    onChange: (page, pageSize) =>
                      handlePagination(page, pageSize),
                  }}
                  // scroll={{
                  //   y: 240,
                  // }}
                />
              </div>
              <Modal
                centered
                title={
                  <h5
                    style={{
                      margin: "0",
                      fontWeight: "600",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    ACCEPT PRODUCT
                  </h5>
                }
                open={previewOpenApproveProduct}
                onOk={handleApproveProduct}
                okText="Accept"
                onCancel={() => setPreviewOpenApproveProduct(false)}
                okButtonProps={{ color: "red" }}
              >
                <h6>Are you sure want to accept product!</h6>
              </Modal>
              <Modal
                centered
                title={
                  <h5
                    style={{
                      margin: "0",
                      fontWeight: "600",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    REJECT PRODUCT
                  </h5>
                }
                open={previewOpenDeclineProduct}
                onOk={handleDeclineProduct}
                okText="Reject"
                onCancel={() => setPreviewOpenDeclineProduct(false)}
                okButtonProps={{ color: "red" }}
              >
                <h6>Are you sure want to reject product!</h6>
                <label style={{ margin: "20px 0 10px 0" }}>Message</label>
                <TextArea
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleDeclineProduct();
                    }
                  }}
                  style={{ height: "100px" }}
                  placeholder="Enter Your Message"
                  type="text"
                  value={rejectMessage}
                  onChange={(e) => setRejectMessage(e.target.value)}
                />
                {error ? (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    Message field is required!
                  </p>
                ) : (
                  ""
                )}
              </Modal>
            </Card>
          </Col>
          <Modal
            centered
            title={
              <h5
                style={{
                  margin: "0",
                  fontWeight: "600",
                  color: "white",
                  textAlign: "center",
                }}
              >
                PRODUCT DETAIL
              </h5>
            }
            open={productDetailClose}
            onOk={() => setProductDetailClose(false)}
            onCancel={() => setProductDetailClose(false)}
          >
            <Row gutter={[24, 0]}>
              <Col md={24} lg={24}>
                <Carousel autoplay>
                  {prodData.image?.map((img) => {
                    return (
                      <>
                        <img
                          src={`${IMG_URL}/${img.image}`}
                          alt="img"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
                        />
                      </>
                    );
                  })}
                </Carousel>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col md={24} lg={24} className="mt-3">
                <Card>
                  <h4>INFORMATIONS</h4>
                  <div
                    style={{
                      margin: "20px 0 0 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid gray",
                      marginTop: "4px",
                    }}
                    align="center"
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        width: "8rem",
                      }}
                      align="center"
                    >
                      Name:
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        width: "19rem",
                        borderLeft: "1px solid gray",
                      }}
                    >
                      {prodData?.title}
                    </p>
                  </div>
                  <div
                    style={{
                      margin: "20px 0 0 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid gray",
                      marginTop: "4px",
                    }}
                    align="center"
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        width: "8rem",
                      }}
                      align="center"
                    >
                      Discount:
                    </p>
                    <p
                      align="center"
                      style={{
                        fontSize: "16px",
                        width: "19rem",
                        borderLeft: "1px solid gray",
                      }}
                    >
                      {prodData?.discount}
                    </p>
                  </div>
                  <div
                    style={{
                      margin: "20px 0 0 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid gray",
                      marginTop: "4px",
                    }}
                    align="center"
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        width: "8rem",
                      }}
                      align="center"
                    >
                      Price:
                    </p>
                    <p
                      align="center"
                      style={{
                        fontSize: "16px",
                        width: "19rem",
                        borderLeft: "1px solid gray",
                      }}
                    >
                      {prodData?.price}
                    </p>
                  </div>
                  <div
                    style={{
                      margin: "20px 0 0 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid gray",
                      marginTop: "4px",
                    }}
                    align="center"
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        width: "8rem",
                      }}
                      align="center"
                    >
                      Descriptions:
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        width: "19rem",
                        borderLeft: "1px solid gray",
                      }}
                    >
                      {prodData?.product_description}
                    </p>
                  </div>
                  {prodData.product_status === "approved" ? (
                    <div
                      style={{
                        margin: "20px 0 0 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: "1px solid gray",
                        marginTop: "4px",
                      }}
                      align="center"
                    >
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          width: "8rem",
                        }}
                        align="center"
                      >
                        TRENDING:
                        {/* {prodData.is_trending === "1" ? "Yes" : "No"} */}
                      </p>
                      <Switch
                        align="center"
                        style={{ borderLeft: "1px solid gray" }}
                        checked={trendStatus === "1" ? true : false}
                        onChange={() => showTrendConfirm(prodData)}
                      />
                    </div>
                  ) : null}
                </Card>
              </Col>
            </Row>
            {/* </Card> */}
            {/* </div> */}
          </Modal>
          <Modal
 title={
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <h5 style={{
      margin: "0",
      fontWeight: "600",
    }}>
      Manage Product Images
    </h5>
    <Button 
      danger
      onClick={handleDeleteAllImages}
      loading={load}
    >
      Delete All Images
    </Button>
  </div>
}
  visible={imageManageModal}
  onCancel={() => {
  
    setImageManageModal(false);
    setImageFiles({
      product_multiple_images: [],
      product_single_image: null,
      product_small_image: null
    });
    setExistingImages({
      product_multiple_images: [],
      product_single_image: null,
      product_small_image: null
    });
    setSelectedProdForImage(null);
  }}
  footer={[
    <Button 
      key="cancel" 
      onClick={() => {
        setImageManageModal(false);
        setImageFiles({
          product_multiple_images: [],
          product_single_image: null,
          product_small_image: null
        });
        setExistingImages({
          product_multiple_images: [],
          product_single_image: null,
          product_small_image: null
        });
      }}
    >
      Cancel
    </Button>,
    <Button 
      key="submit" 
      type="primary" 
      onClick={handleImageUpdate}
      loading={load}
    >
      Update Images
    </Button>
  ]}
  width={800}
>
  <div style={{ marginBottom: '20px' }}>
    <h4>Multiple Images</h4>
    {console.log(existingImages,"existingImages")}
    <Upload
      multiple
      listType="picture-card"
      fileList={[...existingImages.product_multiple_images, ...imageFiles.product_multiple_images]}
      beforeUpload={(file) => {
        setImageFiles(prev => ({
          ...prev,
          product_multiple_images: [...(prev.product_multiple_images || []), {
            uid: file.uid,
            name: file.name,
            status: 'done',
            originFileObj: file
          }]
        }));
        return false;
      }}
      onRemove={(file) => {
        if (file.url) {
          // This is an existing image
          console.log(file)
          handleDeleteImage(file.uid);
        } else {
          // This is a newly uploaded image
          setImageFiles(prev => ({
            ...prev,
            product_multiple_images: prev.product_multiple_images.filter(f => f.uid !== file.uid)
          }));
        }
      }}
    >
      <div>
        <PlusOutlined />
        <div>Upload</div>
      </div>
    </Upload>
  </div>

 
  <div style={{ marginBottom: '20px' }}>
  <h4>Single Image</h4>
  <Upload
    listType="picture-card"
    fileList={[...(existingImages.product_single_image ? [existingImages.product_single_image] : []), 
              ...(imageFiles.product_single_image ? [imageFiles.product_single_image] : [])]}
    beforeUpload={(file) => {
      setImageFiles(prev => ({
        ...prev,
        product_single_image: {
          uid: file.uid,
          name: file.name,
          status: 'done',
          originFileObj: file
        }
      }));
      return false;
    }}
    onRemove={(file) => {
      if (file.url) {
        handleDeleteImage(file.uid);
      }
      setImageFiles(prev => ({
        ...prev,
        product_single_image: null
      }));
    }}
    maxCount={1}
    showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
  >
    <div>
      <PlusOutlined />
      <div>Upload</div>
    </div>
  </Upload>
</div>

<div>
  <h4>Small Image</h4>
  <Upload
    listType="picture-card"
    fileList={[...(existingImages.product_small_image ? [existingImages.product_small_image] : []),
              ...(imageFiles.product_small_image ? [imageFiles.product_small_image] : [])]}
    beforeUpload={(file) => {
      setImageFiles(prev => ({
        ...prev,
        product_small_image: {
          uid: file.uid,
          name: file.name,
          status: 'done',
          originFileObj: file
        }
      }));
      return false;
    }}
    onRemove={(file) => {
      if (file.url) {
        handleDeleteImage(file.uid);
      }
      setImageFiles(prev => ({
        ...prev,
        product_small_image: null
      }));
    }}
    maxCount={1}
    showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
  >
    <div>
      <PlusOutlined />
      <div>Upload</div>
    </div>
  </Upload>
</div>
</Modal>
        </Row>
        <Modal
  title="Manage Product Variations"
  visible={variationsModal}
  onCancel={() => {
    setVariationsModal(false);
    setSelectedProduct(null);
    setVariations([]);
  }}
  footer={null}
  width={800}
>
  <Form onFinish={handleAddVariation} layout="vertical">
    <Row gutter={16}>
      <Col span={6}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="size" label="Size" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
      </Col>
    </Row>
    <Button type="primary" htmlType="submit">
      Add Variation
    </Button>
  </Form>

  <Divider />


<Table
    dataSource={variations}
    columns={[
      {
        title: 'Title',
        dataIndex: 'title',
        render: (text, record) => (
          editingRow === record.id ? (
            <Input
              defaultValue={text || ''}
              onBlur={(e) => {
                handleUpdateVariation(record.id, { title: e.target.value });
                setEditingRow(null);
              }}
            />
          ) : (
            <span>{text || '-'}</span>
          )
        )
      },
      {
        title: 'Size',
        dataIndex: 'size',
        render: (text, record) => (
          editingRow === record.id ? (
            <Input
              defaultValue={text || ''}
              onBlur={(e) => {
                handleUpdateVariation(record.id, { size: e.target.value });
                setEditingRow(null);
              }}
            />
          ) : (
            <span>{text || '-'}</span>
          )
        )
      },
      {
        title: 'Stock',
        dataIndex: 'stock',
        render: (text, record) => (
          editingRow === record.id ? (
            <Input
              type="number"
              defaultValue={text || ''}
              onBlur={(e) => {
                handleUpdateVariation(record.id, { stock: e.target.value });
                setEditingRow(null);
              }}
            />
          ) : (
            <span>{text || '-'}</span>
          )
        )
      },
      {
        title: 'Price',
        dataIndex: 'price',
        render: (text, record) => (
          editingRow === record.id ? (
            <Input
              type="number"
              defaultValue={text || ''}
              onBlur={(e) => {
                handleUpdateVariation(record.id, { price: e.target.value });
                setEditingRow(null);
              }}
            />
          ) : (
            <span>{text || '-'}</span>
          )
        )
      },
      {
        title: 'Action',
        render: (_, record) => (
          <div>
            {editingRow === record.id ? (
              <Button 
                type="primary"
                onClick={() => setEditingRow(null)}
                style={{ marginRight: '8px' }}
              >
                Update
              </Button>
            ) : (
              <Button
                type="default"
                onClick={() => setEditingRow(record.id)}
                style={{ marginRight: '8px' }}
                icon={<EditOutlined />}
              >
                Edit
              </Button>
            )}
            <Button 
              type="link" 
              danger 
              onClick={() => handleDeleteVariation(record.id)}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </div>
        )
      }
    ]}
  />
</Modal>
      </div>
    </>
  );
};

export default ProductApproval;
