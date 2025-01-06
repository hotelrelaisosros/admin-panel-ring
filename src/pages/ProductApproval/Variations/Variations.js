import React, { useEffect, useState } from "react";
import { Avatar, Card, Col, Descriptions, Input, Modal, Row, Table, Tooltip, Upload } from "antd";
// import ImgCrop from "antd-img-crop";
import { Loader } from "react-overlay-loader";
import { useHistory } from "react-router-dom";
import IMG_URL from "../../../utils/imageurl";
import { EyeTwoTone, EditOutlined, DeleteOutlined ,PictureOutlined} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { CategoryMiddleware } from "../../../store/category/categoryMiddleware";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../../../store/common/commonSlice";
import { VariationMiddleware } from "../../../store/variation/variationMiddleware";
import { useParams } from "react-router-dom/cjs/react-router-dom";


const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Variations = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [cateName, setCateName] = useState("");
  const [subCateName, setSubCateName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [fileList3, setFileList3] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  
//   const data = useSelector((state) => state.category.categories.Category);
  const data = useSelector((state) => state.variation.variation);
  const isRing = useSelector((state) => state.variation.ring);

  const [varId , setVarId]  = useState("");
  const [catNameError, setCatNameError] = useState(false);
  const [subCatNameError, setSubCatNameError] = useState(false);
  const [fileList1Error, setFileList1Error] = useState(false);
  const [fileList2Error, setFileList2Error] = useState(false);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const [previewOpenAdd, setPreviewOpenAdd] = useState(false);
  const [previewOpenupdate, setPreviewOpenupdate] = useState(false);
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [click, setclick] = useState(false);
  const [catId, setCatId] = useState();
  const { id } = useParams(); 

// new fields
const metal_types = useSelector((state) => state.variation.metal_type);
const gem_shapes = useSelector((state) => state.variation.gem_shape);


const [title, setTitle] = useState("");
const [size, setSize] = useState("");
const [stock, setStock] = useState("");
const [metalType, setMetalType] = useState(null);
const [gemShape, setGemShape] = useState(null);
const [price,setPrice]  =useState(0);


  
  let token = localStorage.getItem("token");

  useEffect(() => {
    const formdata = new FormData();
    formdata.append('product_id' ,id)
    dispatch(VariationMiddleware.GetVariation(formdata,token));
    dispatch(VariationMiddleware.getMetalType(token));
    dispatch(VariationMiddleware.getGemShape(token));

  }, []);



  useEffect(() => {
    if (fileList?.length === 0) setFileList1Error(true);
    else if (fileList?.length > 0) setFileList1Error(false);
  }, [fileList]);

  useEffect(() => {
    if (cateName === "") setCatNameError(true);
    else if (cateName !== "") setCatNameError(false);
  }, [cateName]);

  useEffect(() => {
    if (subCateName === "") setSubCatNameError(true);
    else if (subCateName !== "") setSubCatNameError(false);
  }, [subCateName]);

  useEffect(() => {
    if (fileList2?.length === 0) setFileList2Error(true);
    else if (fileList2?.length > 0) setFileList2Error(false);
  }, [fileList2]);

  const onChange = ({ fileList: newFileList }) => {
    // if (
    //   newFileList.type === "image/png" ||
    //   newFileList.type === "image/jpeg" ||
    //   newFileList.type === "image/jpg"
    // ) {
    setFileList(newFileList);
    setclick(true);
    console.log(newFileList, "newFileList");
    // } else {
    //   message.error("You can only upload JPEG/JPG/PNG file!");
    // }
  };

  const onChange2 = ({ fileList: newFileList }) => {
    // if (
    //   newFileList.type === "image/png" ||
    //   newFileList.type === "image/jpeg" ||
    //   newFileList.type === "image/jpg"
    // ) {
    setFileList2(newFileList);
    // } else {
    //   message.error("You can only upload JPEG/JPG/PNG file!");
    // }
  };

  const onChange3 = ({ fileList: newFileList }) => {
    // if (
    //   newFileList.type === "image/png" ||
    //   newFileList.type === "image/jpeg" ||
    //   newFileList.type === "image/jpg"
    // ) {
    setFileList3(newFileList);
    // } else {
    //   message.error("You can only upload JPEG/JPG/PNG file!");
    // }
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleOpenAddModal = () => {
    setPreviewOpenAdd(true);
    setCatNameError(false);
    setSubCatNameError(false);
    setFileList1Error(false);
    setFileList2Error(false);

    setTitle("");
    setPrice(0);
    setSize("");
    setStock("");
    setMetalType(null);
    setGemShape(null);
  };

  const handleCloseAddModal = () => {
    setPreviewOpenAdd(false);
    setCateName("");
    setSubCateName("");
    setFileList([]);
    setFileList2([]);
    setCatNameError(false);
    setSubCatNameError(false);
    setFileList1Error(false);
    setFileList2Error(false);
    setTitle("");
    setPrice(0);
    setSize("");
    setStock("");
    setMetalType(null);
    setGemShape(null);
  };

  const submitAddVariation = () => {
    const formdata = new FormData();
  
    // Append new inputs to FormData
    formdata.append("title", title);
    formdata.append("price", price);
    formdata.append("size", size);
    formdata.append("stock", stock);
    formdata.append("metal_type_id", metalType);
    formdata.append("gem_shape_id", gemShape);
    formdata.append("product_id" , id);
  
    // Validate new inputs
    if (
      !title ||
      !price ||
      !size ||
      stock === "" || // Allow stock to be 0
      (isRing && (!metalType || !gemShape))
    ) {
      toast.error("Please fill all required fields for the variation!", {
        position: "bottom-left",
        autoClose: 2000,
      });
      return;
    }
  
    // Resetting new fields after submission
    setTitle("");
    setPrice("");
    setSize("");
    setStock("");
    setMetalType("");
    setGemShape("");
  
    // Submit data (assuming you combine with the previous fields later)
    dispatch(VariationMiddleware.AddVariation(formdata, token))
      .then((res) => {
         dispatch(setLoading(false));
         const formdata = new FormData();
         formdata.append('product_id' ,id)
         dispatch(VariationMiddleware.GetVariation(formdata,token));
        toast.success(res?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS ADDED VARIATION =>", res);
        handleCloseAddModal();
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR ADDING VARIATION =>", err);
      });
  };
  

  const handleOpenUpdateModal = (rowData) => {
    setVarId(rowData.id);

    setPreviewOpenupdate(true);
    // const imgsp = `${IMG_URL}/`;
    // setFileList3([{ url: imgsp + rowData.image }]);
    setTitle(rowData.title);
    setPrice(rowData.price);
    setSize(rowData.size);
    setStock(rowData.stock);
    setMetalType(rowData.metal_type.id);
    setGemShape(rowData.gem_shape.id);

    // setVarId(rowData.id);
  };
  const handleCloseUpdateModal = () => {
    setPreviewOpenupdate(false);
    setTitle("");
    setPrice(0);
    setSize("");
    setStock(0);
    setMetalType(null);
    setGemShape(null);
    // setVarId(null);

  };


const submitUpdateVariation = () => {
  const formdata = new FormData();
  // Append category fields based on the updated structure
  formdata.append("title", title); // Title for the category
  formdata.append("price", price); // Price (if relevant)
  formdata.append("size", size); // Size (if relevant)
  formdata.append("stock", stock); // Stock (if relevant)
  formdata.append("metal_type_id", metalType); // Metal type ID (if relevant)
  formdata.append("gem_shape_id", gemShape); // Gem shape ID (if relevant)
  formdata.append("product_id", id); // Category ID for updating

  if (
    !title ||
    !price ||
    !size ||
    (isRing && (!metalType || !gemShape))
  ) {
    toast.error("Please fill all required fields for the category update!", {
      position: "bottom-left",
      autoClose: 2000,
    });
    return;
  }

  // Reset fields after submission
  setTitle("");
  setPrice(0);
  setSize("");
  setStock(0);
  setMetalType(null);
  setGemShape(null);

  // Submit data (assuming you combine with the previous fields later)
  dispatch(VariationMiddleware.UpdateVariation(varId, formdata, token))
    .then((res) => {
      dispatch(setLoading(false)); // Stop loading

    const formdata = new FormData();
    formdata.append('product_id' ,id)
    dispatch(VariationMiddleware.GetVariation(formdata,token));
    
    toast.success(res?.data?.message, {
        position: "bottom-left",
        autoClose: 2000,
      });
      console.log("SUCCESS UPDATED CATEGORY =>", res);
      handleCloseUpdateModal(); // Close modal after update
    })
    .catch((err) => {
      dispatch(setLoading(false)); // Stop loading in case of error
      toast.error(err?.data?.message, {
        position: "bottom-left",
        autoClose: 2000,
      });
      console.log("ERROR UPDATING CATEGORY =>", err);
    });
};

  const handleOpenDelete = (rowData) => {
    setVarId(rowData.id);
    setPreviewOpenDelete(true);
    setDeleteData(rowData);
  };

  const deleteVariation = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
   
    dispatch(VariationMiddleware.DeleteVariation(varId,token))
          .then((res) => {
        dispatch(setLoading(false));
        const formdata = new FormData();
        formdata.append('product_id' ,id);
        dispatch(VariationMiddleware.GetVariation(formdata,token));
          toast.success(res.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETED CATEGORY =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        const formdata = new FormData();
        formdata.append('product_id' ,id);
        dispatch(VariationMiddleware.GetVariation(formdata,token));
        toast.error(err?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETED CATEGORY =>", err);
      });
  };

  const columns = [
    {
      title: <p>TITLE</p>,
      dataIndex: "title",
      key: "title",
    },
    {
      title: <p>SIZE</p>,
      dataIndex: "size",
      key: "size",
    },
    {
      title: <p>STOCK</p>,
      dataIndex: "stock",
      key: "stock",
    },
  
    ...(isRing ? [
      {
        title: <p>METAL TYPE</p>,
        render: (rowData) => (
          <Tooltip title={rowData.metal_type?.title || "N/A"}>
            <Avatar
              className="metal-avatar"
              shape="circle"
              size={40}
              src={rowData.metal_type?.image || "default-image-url"} // Provide a default image URL if image is missing
              alt={rowData.metal_type?.title || "Unknown Metal Type"} // Provide a fallback alt text
            />
            <span style={{ marginLeft: 8 }}>
              {rowData.metal_type?.title || "N/A"} {/* Display "N/A" if title is missing */}
            </span>
          </Tooltip>
        ),
        key: "metal_type",
      },
      {
        title: <p>GEM SHAPE</p>,
        render: (rowData) => (
          <Tooltip title={rowData.gem_shape?.name || "N/A"}>
            <Avatar
              className="gem-avatar"
              shape="square"
              size={40}
              src={rowData.gem_shape?.image || "default-image-url"} // Provide a default image URL if image is missing
              alt={rowData.gem_shape?.name || "Unknown Gem Shape"} // Provide a fallback alt text
            />
            <span style={{ marginLeft: 8 }}>
              {rowData.gem_shape?.name || "N/A"} {/* Display "N/A" if name is missing */}
            </span>
          </Tooltip>
        ),
        key: "gem_shape",
      }
    ] : []),
  
    {
      title: <p className="ant-employed fw-bold">ACTION</p>,
      render: (rowData) => (
        <div>
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
  
          <Tooltip title="images">
            <a onClick={() => {
              history.push(`/viewVariationImages?variant_id=${rowData.id}&product_id=${rowData.product_id}`);
}}>
              <PictureOutlined style={{ color: "blue", fontSize: "20px", margin: "10px" }} />
            </a>
          </Tooltip>
        </div>
      ),
    },
  ];
  
  
  return (
    <>
      {load ? <Loader fullPage loading /> : null}
      {/* {networkError === true ? toast.error("No internet connection please check your connection!", {
        position: "bottom-left",
        autoClose: 2000,
      }) : ""} */}
      <ToastContainer />

{/* create variant model */}

    <Modal
      centered
      title={
        <h5
          style={{
            margin: "0",
            fontWeight: "600",
            textAlign: "center",
            color: "white",
          }}
        >
          Create Variation
        </h5>
      }
      open={previewOpenAdd}
      okText="Add"
      onCancel={handleCloseAddModal}
      onOk={submitAddVariation}  
    >
      <Card className="header-solid h-full" bordered={false} bodyStyle={{ paddingTop: "0" }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className="col-lg-12">
              <label style={{ margin: "10px 0" }}>Title</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="col-lg-12" style={{ marginTop: "10px" }}>
              <label style={{ margin: "10px 0" }}>Price</label>
              <Input
                type="text"
                value={price}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) { 
                      setPrice(value);
                    }
                  }}/>
            </div>
            <div className="col-lg-12" style={{ marginTop: "10px" }}>
              <label style={{ margin: "10px 0" }}>Size</label>
              <Input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
            <div className="col-lg-12" style={{ marginTop: "10px" }}>
  <label style={{ margin: "10px 0" }}>Stock</label>
  <Input
    type="number"
    value={stock}
    onChange={(e) => {
      const value = e.target.value;
      if (value >= 0) {
        setStock(value);
      }
    }}
  />
</div>
{isRing && (
  <div>
    {/* Metal Type Selection */}
    {/* Metal Type Selection */}
<div className="col-lg-12" style={{ marginTop: "10px" }}>
  <label style={{ margin: "10px 0" }}>Select Metal Type</label>
  <select
    value={metalType}
    onChange={(e) => setMetalType(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  >
    <option value="" disabled>Select a Metal Type</option>
    {metal_types.map((metal) => (
      <option key={metal.id} value={metal.id}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Displaying the image next to the title */}
          <img
            src={metal.image_url}  // Assuming image_url is the field containing the image URL
            alt={metal.title}
            style={{
              width: "20px",  // Adjust the width as necessary
              height: "20px", // Adjust the height as necessary
              marginRight: "10px",
            }}
          />
          {metal.title}
        </div>
      </option>
    ))}
  </select>
</div>

{/* Gem Shape Selection */}
<div className="col-lg-12" style={{ marginTop: "10px" }}>
  <label style={{ margin: "10px 0" }}>Select Gem Shape</label>
  <select
    value={gemShape}
    onChange={(e) => setGemShape(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  >
    <option value="" disabled>Select a Gem Shape</option>
    {gem_shapes.map((gem) => (
      <option key={gem.id} value={gem.id}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Displaying the image next to the gem name */}
          <img
            src={gem.image_url}  // Assuming image_url is the field containing the image URL
            alt={gem.name}
            style={{
              width: "20px",  // Adjust the width as necessary
              height: "20px", // Adjust the height as necessary
              marginRight: "10px",
            }}
          />
          {gem.name}
        </div>
      </option>
    ))}
  </select>
</div>

  </div>
)}

          </Col>
        </Row>
      </Card>
    </Modal>


    {/* update model2 */}
    <Modal
    centered
    title={
        <h5
        style={{
            margin: "0",
            fontWeight: "600",
            textAlign: "center",
            color: "white",
        }}
        >
        Update Variation
        </h5>
    }
    open={previewOpenupdate}
    onOk={submitUpdateVariation}
    okText="Update"
    onCancel={handleCloseUpdateModal}
    >
    <Card className="header-solid h-full" bordered={false} bodyStyle={{ paddingTop: "0" }}>
        <Row gutter={[24, 24]}>
        <Col span={24}>
            <div className="col-lg-12">
            <label style={{ margin: "10px 0" }}>Title</label>
            <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            </div>
            <div className="col-lg-12" style={{ marginTop: "10px" }}>
            <label style={{ margin: "10px 0" }}>Price</label>
            <Input
                type="text"
                value={price}
                onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                    setPrice(value);
                }
                }}
            />
            </div>
            <div className="col-lg-12" style={{ marginTop: "10px" }}>
            <label style={{ margin: "10px 0" }}>Size</label>
            <Input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
            />
            </div>
            <div className="col-lg-12" style={{ marginTop: "10px" }}>
            <label style={{ margin: "10px 0" }}>Stock</label>
            <Input
                type="number"
                value={stock}
                onChange={(e) => {
                const value = e.target.value;
                if (value >= 0) {
                    setStock(value);
                }
                }}
            />
            </div>
            {isRing && (
            <div>
                <div className="col-lg-12" style={{ marginTop: "10px" }}>
                <label style={{ margin: "10px 0" }}>Select Metal Type</label>
                <select
                    value={metalType}
                    onChange={(e) => setMetalType(e.target.value)}
                    style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    }}
                >
                    <option value="" disabled>Select a Metal Type</option>
                    {metal_types.map((metal) => (
                    <option key={metal.id} value={metal.id}>{metal.title}</option>
                    ))}
                </select>
                </div>

                <div className="col-lg-12" style={{ marginTop: "10px" }}>
                <label style={{ margin: "10px 0" }}>Select Gem Shape</label>
                <select
                    value={gemShape}
                    onChange={(e) => setGemShape(e.target.value)}
                    style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    }}
                >
                    <option value="" disabled>Select a Gem Shape</option>
                    {gem_shapes.map((gem) => (
                    <option key={gem.id} value={gem.id}>{gem.name}</option>
                    ))}
                </select>
                </div>
            </div>
            )}
        </Col>
        </Row>
    </Card>
    </Modal>

        
    
    {/* delete models */}
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
            DELETE VARIATIONS
          </h5>
        }
        open={previewOpenDelete}
        onOk={deleteVariation}
        okText="Delete"
        onCancel={() => setPreviewOpenDelete(false)}
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to delete VARIATIONS!</h6>
      </Modal>

      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="VARIATIONS"
              extra={
                <div className="header-control">
                  <button
                    className="btn btn-primary"
                    onClick={handleOpenAddModal}
                  >
                    Create Variation
                  </button>
                </div>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Variations;
