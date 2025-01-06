import React, { useEffect, useState } from "react";
import { Avatar, Card, Col, Descriptions, Modal, Row, Table, Tooltip, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { Loader } from "react-overlay-loader";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { SubCategoryMiddleware } from "../../../store/category/categoryMiddleware";
import IMG_URL from "../../../utils/imageurl";
import { setLoading } from "../../../store/common/commonSlice";

const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Viewsubcategory = () => {

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [subcatename, setSubcatename] = useState("");
  const [previewOpenAdd, setPreviewOpenAdd] = useState(false);
  const [previewOpenupdate, setPreviewOpenupdate] = useState(false);
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  const [catId, setCatId] = useState();
  const [subCatId, setSubCatId] = useState();
  const [deleteUserId, setDeleteUserId] = useState();
  const { id } = useParams();
  const [fileList, setFileList] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.subCategory.subCategories?.SubCategory
  );
  const [subCatNameError, setSubCatNameError] = useState(false);
  const [fileList1Error, setFileList1Error] = useState(false);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);

  let token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(SubCategoryMiddleware.GetSubCategory({ id: id }, token));
  }, []);

  useEffect(() => {
    if (fileList?.length === 0) setFileList1Error(true);
    else if (fileList?.length > 0) setFileList1Error(false);
  }, [fileList]);

  useEffect(() => {
    if (subcatename === "") setSubCatNameError(true);
    else if (subcatename !== "") setSubCatNameError(false);
  }, [subcatename]);

  //functions
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setFileList2(newFileList);
  };

  const handleCancel = () => {
    setPreviewOpenAdd(false);
    setPreviewOpen(false);
  };

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
    // setSubcatename("")
    // setFileList([])
    setSubCatNameError(false);
    setFileList1Error(false);
  };
  const handleCloseAddModal = () => {
    setPreviewOpenAdd(false);
    setSubcatename("");
    setFileList([]);
    setFileList1Error("");
    setSubCatNameError("");
  };
  const submitAddSubCat = () => {
    const formData = new FormData();
    formData.append("category_id", id);
    formData.append("sub_category", subcatename);
    formData.append("subcategory_image", fileList[0]?.originFileObj);
    if (fileList?.length === 0 || !subcatename) {
      setPreviewOpenAdd(true);
      dispatch(setLoading(false));
      toast.error("Please fill all fields!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
    if (fileList?.length === 0) {
      setFileList1Error(true);
    } else if (fileList?.length > 0) {
      setFileList1Error(false);
    }
    if (subcatename === "") {
      setSubCatNameError(true);
    } else if (subcatename !== "") {
      setSubCatNameError(false);
    }
    if (subcatename && fileList?.length > 0) {
      setPreviewOpenAdd(false);
      dispatch(setLoading(true));
      setSubcatename("");
      setFileList([]);
      setFileList1Error("");
      setSubCatNameError("");
      dispatch(SubCategoryMiddleware.AddSubCategory(formData, token))
        .then((res) => {
          dispatch(setLoading(false));
          toast.success(res?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          dispatch(SubCategoryMiddleware.GetSubCategory({ id: id }, token));
          console.log("SUCCESS ADDED SUB-CATEGORY =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          dispatch(SubCategoryMiddleware.GetSubCategory({ id: id }, token));
          console.log("ERROR ADDED SUB-CATEGORY =>", err);
        });
    }
  };

  const handleOpenUpdateModal = (rowData) => {
    setPreviewOpenupdate(true);
    const imgsp = `${IMG_URL}/`;
    setFileList2([{ url: imgsp + rowData.image }]);
    setSubcatename(rowData.name);
    setCatId(rowData.category.id);
    setSubCatId(rowData.id);
  };
  const handleCloseUpdateModal = () => {
    setPreviewOpenupdate(false);
    setSubcatename("");
    setFileList([]);
  };
  const submitUpdateSubCategory = () => {
    setPreviewOpenupdate(false);
    dispatch(setLoading(true));
    const formData = new FormData();
    if (fileList2[0]?.originFileObj == undefined) {
      formData.append("subcategory", subcatename);
      formData.append("category_id", catId);
      formData.append("id", subCatId);
    } else {
      formData.append("category_id", catId);
      formData.append("id", subCatId);
      formData.append("subcategory", subcatename);
      formData.append("subcategory_image", fileList2[0]?.originFileObj);
    }
    dispatch(SubCategoryMiddleware.UpdateSubCategory(formData, token))
      .then((res) => {
        setSubcatename("");
        dispatch(setLoading(false));
        dispatch(SubCategoryMiddleware.GetSubCategory({ id: id }, token));
        toast.success(res?.data?.Message, {
          position: "bottom-left",
          autoClose: 1000,
        });
        console.log("SUCCESS UPDATE SUB-CATEGORY =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(SubCategoryMiddleware.GetSubCategory({ id: id }, token));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 1000,
        });
        console.log("ERROR UPDATE SUB-CATEGORY =>", err);
      });
  };

  const handleOpenDeleteModal = (rowData) => {
    setPreviewOpenDelete(true);
    setDeleteUserId(rowData.id);
  };
  const handleCloseDeleteModal = () => {
    setPreviewOpenDelete(false);
  };
  const deleteSubCategory = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    const formdata = new FormData();
    formdata.append("id", deleteUserId);
    dispatch(SubCategoryMiddleware.DeleteSubCategory(formdata, token))
      .then((res) => {
        dispatch(setLoading(false));
        dispatch(SubCategoryMiddleware.GetSubCategory({ id: id }, token));
        toast.success(res.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETED SUB-CATEGORY =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(SubCategoryMiddleware.GetSubCategory({ id: id }, token));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETED SUB-CATEGORY =>", err);
      });
  };

  // table code start
  const columns = [
    {
      title: <p>IMAGE</p>,
      render: (rowData) => (
        <Avatar
          className="shape-avatar"
          shape="square"
          size={70}
          src={`${IMG_URL}/` + rowData.image}
        />
      ),
      // dataIndex: "image",
      // key: "image",
    },
    {
      title: <p>NAME</p>,
      dataIndex: "name",
      key: "name",
    },

    {
      title: <p className="ant-employed fw-bolder">ACTION</p>,
      render: (rowData) => (
        <div className="w-25 ant-employed">
          <Tooltip title="edit">
            <a onClick={() => handleOpenUpdateModal(rowData)}>
              <EditOutlined style={{ color: "green", fontSize: "20px" }} />
            </a>
          </Tooltip>

          <Tooltip title="delete">
            <a
              onClick={() => {
                handleOpenDeleteModal(rowData);
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
              fontWeight: "700",
              textAlign: "center",
              color: "white",
            }}
          >
            CREATE SUB-CATEGORY
          </h5>
        }
        open={previewOpenAdd}
        onOk={submitAddSubCat}
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
              <Card className="card-billing-info" bordered="false">
                <div className="row col-info">
                  <Descriptions title="" />
                  <div className="col-md-12">
                    <label style={{ margin: "10px 0" }}>
                      Subcategory Image
                    </label>
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
                  <div className="col-md-12">
                    <label style={{ margin: "10px 0" }}>Subcategory Name</label>
                    <input
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          submitAddSubCat();
                        }
                      }}
                      value={subcatename}
                      type="text"
                      className="form-control h-30 w-100"
                      onChange={(e) => setSubcatename(e.target.value)}
                    />
                    {subCatNameError ? (
                      <p style={{ color: "red", margin: "10px 0 0 0" }}>
                        Sub-category name field is required!
                      </p>
                    ) : (
                      ""
                    )}
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
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </Card>
      </Modal>
      <Modal
        centered
        title={
          <h5
            style={{
              margin: "0",
              fontWeight: "700",
              textAlign: "center",
              color: "white",
            }}
          >
            UPDATE SUB-CATEGORY
          </h5>
        }
        open={previewOpenupdate}
        onOk={submitUpdateSubCategory}
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
                      <label style={{ margin: "10px 0" }}>
                        Subcategory Image
                      </label>
                      {/* <ImgCrop rotate> */}
                      <Upload
                        listType="picture-card"
                        fileList={fileList2}
                        onChange={onChange}
                        onPreview={handlePreview}
                      >
                        {fileList2.length < 1 && "+ Upload"}
                      </Upload>
                      {/* </ImgCrop> */}
                    </div>
                    <div className="col-md-12">
                      <label style={{ margin: "10px 0" }}>
                        Subcategory Name
                      </label>
                      <input
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            submitUpdateSubCategory();
                          }
                        }}
                        type="text"
                        className="form-control h-25 w-100"
                        value={subcatename}
                        onChange={(e) => setSubcatename(e.target.value)}
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
            DELETE SUB-CATEGORY
          </h5>
        }
        open={previewOpenDelete}
        onOk={deleteSubCategory}
        okText="Delete"
        onCancel={() => setPreviewOpenDelete(false)}
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to delete sub_category!</h6>
      </Modal>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="SUB-CATEGORIES"
              extra={
                <button
                  className="btn btn-primary"
                  onClick={handleOpenAddModal}
                >
                  CREATE SUBCATEGORIES
                </button>
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

export default Viewsubcategory;
