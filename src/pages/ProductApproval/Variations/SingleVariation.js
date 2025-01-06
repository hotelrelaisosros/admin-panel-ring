import React, { useEffect, useState } from "react";
import { Avatar, Card, Col, Descriptions, Input, Modal, Row, Table, Tooltip, Upload } from "antd";
// import ImgCrop from "antd-img-crop";
import { Loader } from "react-overlay-loader";
import { useHistory } from "react-router-dom";
import IMG_URL from "../../../utils/imageurl";
import { EyeTwoTone, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

const SingleVariation = () => {
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

  let token = localStorage.getItem("token");

  useEffect(() => {
    const formdata = new FormData();
    formdata.append('product_id' ,id)
    dispatch(VariationMiddleware.GetVariation(formdata,token));
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
  };

//   const submitAddCategory = () => {
//     const formdata = new FormData();
//     formdata.append("category_image", fileList[0]?.originFileObj);
//     formdata.append("subcategory_image", fileList2[0]?.originFileObj);
//     formdata.append("category", cateName);
//     formdata.append("sub_category", subCateName);
//     if (
//       fileList?.length === 0 ||
//       fileList2?.length === 0 ||
//       !cateName ||
//       !subCateName
//     ) {
//       setPreviewOpenAdd(true);
//       dispatch(setLoading(false));
//       toast.error("Please fill all fields!", {
//         position: "bottom-left",
//         autoClose: 2000,
//       });
//     }
//     if (cateName === "") {
//       setCatNameError(true);
//     } else if (cateName !== "") {
//       setCatNameError(false);
//     }
//     if (subCateName === "") {
//       setSubCatNameError(true);
//     } else if (subCateName !== "") {
//       setSubCatNameError(false);
//     }
//     if (fileList?.length === 0) {
//       setFileList1Error(true);
//     } else if (fileList?.length > 0) {
//       setFileList1Error(false);
//     }
//     if (fileList2?.length === 0) {
//       setFileList2Error(true);
//     } else if (fileList2?.length > 0) {
//       setFileList2Error(false);
//     }
//     if (
//       cateName &&
//       subCateName &&
//       fileList?.length > 0 &&
//       fileList2?.length > 0
//     ) {
//       setPreviewOpenAdd(false);
//       dispatch(setLoading(true));
//       setCateName("");
//       setSubCateName("");
//       setFileList([]);
//       setFileList2([]);
//       setCatNameError("");
//       setSubCatNameError("");
//       dispatch(CategoryMiddleware.AddCategory(formdata, token))
//         .then((res) => {
//           dispatch(setLoading(false));
//           dispatch(CategoryMiddleware.GetCategory(token));
//           toast.success(res?.data?.Message, {
//             position: "bottom-left",
//             autoClose: 2000,
//           });
//           console.log("SUCCESS ADDED CATEGORY =>", res);
//         })
//         .catch((err) => {
//           dispatch(setLoading(false));
//           dispatch(CategoryMiddleware.GetCategory(token));
//           toast.error(err?.data?.Message, {
//             position: "bottom-left",
//             autoClose: 2000,
//           });
//           console.log("ERROR ADDED CATEGORY =>", err);
//         });
//     }
//   };

  const handleOpenUpdateModal = (rowData) => {
    setPreviewOpenupdate(true);
    const imgsp = `${IMG_URL}/`;
    setFileList3([{ url: imgsp + rowData.image }]);
    setCateName(rowData.name);
    setCatId(rowData.id);
  };
  const handleCloseUpdateModal = () => {
    setPreviewOpenupdate(false);
    setCateName("");
    setSubCateName("");
    setFileList([]);
    setFileList2([]);
  };
//   const submitUpdateCategory = () => {
//     const formdata = new FormData();
//     if (fileList3[0]?.originFileObj == undefined) {
//       formdata.append("id", catId);
//       formdata.append("name", cateName);
//     } else {
//       formdata.append("id", catId);
//       formdata.append("name", cateName);
//       formdata.append("category_image", fileList3[0]?.originFileObj);
//     }
//     setPreviewOpenupdate(false);
//     dispatch(setLoading(true));
//     dispatch(CategoryMiddleware.UpdateCategory(formdata, token))
//       .then((res) => {
//         setFileList([]);
//         setFileList2([]);
//         setCateName("");
//         setSubCateName("");
//         dispatch(setLoading(false));
//         dispatch(CategoryMiddleware.GetCategory(token));
//         toast.success(res?.data?.Message, {
//           position: "bottom-left",
//           autoClose: 1000,
//         });
//         setCateName("");
//         setSubCateName("");
//         setFileList([]);
//         setFileList2([]);
//         console.log("SUCCESS UPDATE CATEGORY =>", res);
//       })
//       .catch((err) => {
//         dispatch(setLoading(false));
//         dispatch(CategoryMiddleware.GetCategory(token));
//         toast.error(err?.data?.Message, {
//           position: "bottom-left",
//           autoClose: 1000,
//         });
//         console.log("ERROR UPDATE CATEGORY =>", err);
//       });
//   };

  const handleOpenDelete = (rowData) => {
    setPreviewOpenDelete(true);
    setDeleteData(rowData);
  };
  const deleteCategory = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    dispatch(CategoryMiddleware.DeleteCategory({ id: deleteData.id }, token))
      .then((res) => {
        dispatch(setLoading(false));
        dispatch(CategoryMiddleware.GetCategory(token));
        toast.success(res.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETED CATEGORY =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(CategoryMiddleware.GetCategory(token));
        toast.error(err?.data?.Message, {
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
      {
        title: <p>METAL TYPE</p>,
        render: (rowData) => (
          <Tooltip title={rowData.metal_type.title}>
            <Avatar
              className="metal-avatar"
              shape="circle"
              size={40}
              src={rowData.metal_type.image}
              alt={rowData.metal_type.title}
            />
            <span style={{ marginLeft: 8 }}>{rowData.metal_type.title}</span>
          </Tooltip>
        ),
        key: "metal_type",
      },
      {
        title: <p>GEM SHAPE</p>,
        render: (rowData) => (
          <Tooltip title={rowData.gem_shape.name}>
            <Avatar
              className="gem-avatar"
              shape="square"
              size={40}
              src={rowData.gem_shape.image}
              alt={rowData.gem_shape.name}
            />
            <span style={{ marginLeft: 8 }}>{rowData.gem_shape.name}</span>
          </Tooltip>
        ),
        key: "gem_shape",
      },    
    {
      title: <p className="ant-employed fw-bold">ACTION</p>,
      render: (rowData) => (
        <div>
          <Tooltip title="view">
            <a
              onClick={() => {
                console.log(rowData, "rowData");
                history.push(`/viewSingleVariation/${rowData.id}`);
              }}
            >
              <EyeTwoTone style={{ fontSize: "20px" }} />
            </a>
          </Tooltip>

          <Tooltip title="edit">
            <a onClick={() => handleOpenUpdateModal(rowData)}>
              <EditOutlined style={{ color: "green", fontSize: "20px", margin: "0 15px" }} />
            </a>
          </Tooltip>

          <Tooltip title="delete">
            <a
              onClick={() => {
                handleOpenDelete(rowData);
              }}
            >
              <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
            </a>
          </Tooltip>

          <Tooltip title="images">
            <a
              onClick={() => {
                console.log(rowData, "rowData");
                history.push(`/viewVariationImages/variation=${rowData.id}&product_id=${rowData.product_id}`);
              }}
            >
              <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
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
        // onOk={submitAddCategory}
        okText="Add"
        onCancel={handleCloseAddModal}
      >
        <Card
          className="header-solid h-full"
          bordered={false}
          bodyStyle={{ paddingTop: "0" }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24} className="d-flex">
              <Card className="mx-5">
                <Descriptions title="Category" />
                <div className="col-lg-12">
                  {/* <ImgCrop rotate> */}
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={handlePreview}
                  >
                    {fileList.length < 1 && "+ Upload"}
                  </Upload>
                  {/* </ImgCrop> */}
                  {fileList1Error ? (
                    <p style={{ color: "red", margin: "10px 0 0 0" }}>
                      Category image field is required!
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-lg-12">
                  <label style={{ margin: "10px 0" }}>Category Name</label>
                  <Input
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        // submitAddCategory();
                      }
                    }}
                    type="text"
                    value={cateName}
                    className="h-25"
                    onChange={(e) => setCateName(e.target.value)}
                  />
                  {catNameError ? (
                    <p style={{ color: "red", margin: "10px 0 0 0" }}>
                      Category field is required!
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </Card>
              <Card className="mx-5">
                <Descriptions title="SubCategory" />
                <div className="col-lg-12">
                  {/* <ImgCrop rotate> */}
                  <Upload
                    listType="picture-card"
                    fileList={fileList2}
                    onChange={onChange2}
                    onPreview={handlePreview}
                  >
                    {fileList2.length < 1 && "+ Upload2"}
                  </Upload>
                  {/* </ImgCrop> */}
                  {fileList2Error ? (
                    <p style={{ color: "red", margin: "10px 0 0 0" }}>
                      Sub-category image field is required!
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-lg-12">
                  <label style={{ margin: "10px 0" }}>SubCategory Name</label>
                  <Input
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        // submitAddCategory();
                      }
                    }}
                    type="text"
                    value={subCateName}
                    className="h-25 "
                    onChange={(e) => setSubCateName(e.target.value)}
                  />
                  {subCatNameError ? (
                    <p style={{ color: "red", margin: "10px 0 0 0" }}>
                      Sub-Category field is required!
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Card>
      </Modal>
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
            UPDATE CATEGORY
          </h5>
        }
        open={previewOpenupdate}
        // onOk={submitUpdateCategory}
        okText="Update"
        onCancel={handleCloseUpdateModal}
      >
        <Card
          className="header-solid h-full"
          bordered={false}
          bodyStyle={{ paddingTop: "0" }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24} className="d-flex">
              <Card className="card-billing-info m-2 d-flex" bordered="false">
                <div className="row col-info">
                  <div className="col-md-12">
                    <Descriptions title="" />
                    <div className="col-md-12">
                      <label style={{ margin: "10px 0" }}>Category Image</label>
                      {/* <ImgCrop rotate> */}
                      <Upload
                        listType="picture-card"
                        fileList={fileList3}
                        onChange={onChange3}
                        onPreview={handlePreview}
                      >
                        {fileList3.length < 1 && "+ Upload"}
                      </Upload>
                      {/* </ImgCrop> */}
                    </div>
                    <div className="col-md-12">
                      <label style={{ margin: "10px 0" }}>Category Name</label>
                      <input
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            // submitUpdateCategory();
                          }
                        }}
                        type="text"
                        className="form-control h-25 w-100"
                        value={cateName}
                        onChange={(e) => setCateName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Card>
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
            DELETE CATEGORY
          </h5>
        }
        open={previewOpenDelete}
        // onOk={deleteCategory}
        okText="Delete"
        onCancel={() => setPreviewOpenDelete(false)}
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to delete category!</h6>
      </Modal>

      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="CATEGORIES"
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

export default SingleVariation;
