import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
  Upload,
  Input,
} from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useHistory } from "react-router-dom";
import IMG_URL from "../../utils/imageurl";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { BannerMiddleware } from "../../store/banner/BannerMiddleware";
import { setLoading } from "../../store/common/commonSlice";

const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Banner = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState(false);
  const [previewUpdateBanner, setPreviewUpdateBanner] = useState("");
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [updateBannerId, setUpdateBannerId] = useState();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [selectval, setSelectval] = useState("");
  const [selectSec, setSelectSec] = useState("header");
  const [bannerSecError, setBannerSecError] = useState(false);
  const [bannerImgError, setBannerImgError] = useState(false);
  const [url, setUrl] = useState("");
  const [createUrl, setCreateUrl] = useState("");
  const { Option } = Select;
  const opt = [{ option: "Header" }, { option: "Body" }, { option: "Footer" }];
  const dispatch = useDispatch();
  const data = useSelector((state) => state.banner.banners.banners);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  let token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(BannerMiddleware.GetBanner(selectSec.toLowerCase(), token));
  }, [selectSec]);

  useEffect(() => {
    if (fileList?.length === 0) setBannerImgError(true);
    else if (fileList?.length > 0) setBannerImgError(false);
  }, [fileList]);

  useEffect(() => {
    if (selectval === "") setBannerSecError(true);
    else if (selectval !== "") setBannerSecError(false);
  }, [selectval]);

  const addbanner = () => {
    setPreviewBanner(true);
    setBannerImgError(false);
    setBannerSecError(false);
  };
  const handleCloseAdd = () => {
    setPreviewBanner(false);
    setBannerImgError(false);
    setBannerSecError(false);
    setFileList([]);
    setSelectval("");
  };
  const handlesubmit = () => {
    const formData = new FormData();
    formData.append("url", createUrl);
    fileList.map((x) => formData.append("images[]", x.originFileObj));
    formData.append("section", selectval.toLowerCase());
    if (!selectval || fileList?.length === 0) {
      toast.error("Please fill all fields!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
    if (fileList?.length === 0) {
      setBannerImgError(true);
    } else if (fileList?.length > 0) {
      setBannerImgError(false);
    }
    if (selectval === "") {
      setBannerSecError(true);
    } else if (selectval !== "") {
      setBannerSecError(false);
    }
    if (selectval && fileList?.length > 0) {
      setPreviewBanner(false);
      dispatch(setLoading(true));
      setSelectval("");
      setFileList([]);
      setBannerImgError(false);
      setBannerSecError(false);
      dispatch(BannerMiddleware.AddBanner(formData, token))
        .then((res) => {
          dispatch(setLoading(false));
          dispatch(BannerMiddleware.GetBanner(selectSec.toLowerCase(), token));
          toast.success(res?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("SUCCESS ADDED BANNER =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          dispatch(BannerMiddleware.GetBanner(selectSec.toLowerCase(), token));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ERROR ADDED BANNER =>", err);
        });
    }
  };

  const editupdatebanner = (rowData) => {
    setPreviewUpdateBanner(true);
    setUrl(rowData?.url);
    const imgsp = `${IMG_URL}/`;
    setFileList([{ url: imgsp + rowData.image }]);
    setUpdateBannerId(rowData.id);
  };
  const handleCloseUdpate = () => {
    setPreviewUpdateBanner(false);
    setFileList([]);
    setSelectval("");
  };
  const handleUpdateBanner = () => {
    setPreviewUpdateBanner(false);
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("id", updateBannerId);
    formData.append("url", url);
    fileList.map((x) => {
      if (x.originFileObj) {
        formData.append("images", x.originFileObj);
      }
    });
    console.log({ url, fileList });
    dispatch(BannerMiddleware.UpdateBanner(formData, token))
      .then((res) => {
        dispatch(setLoading(false));
        toast.success(res?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(BannerMiddleware.GetBanner(selectSec.toLowerCase(), token));
        console.log("SUCCESS UPDATE BANNER =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(BannerMiddleware.GetBanner(selectSec.toLowerCase(), token));
        console.log("ERROR UPDATE BANNER =>", err);
      });
  };

  const handleOpenDelete = (rowData) => {
    setPreviewOpenDelete(true);
    setDeleteData(rowData);
  };
  const deleteBanner = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    dispatch(BannerMiddleware.DeleteBanner({ id: deleteData.id }, token))
      .then((res) => {
        dispatch(setLoading(false));
        toast.success(res?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(BannerMiddleware.GetBanner(selectSec.toLowerCase(), token));
        console.log("SUCCESS DELETE BANNER =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(BannerMiddleware.GetBanner(selectSec.toLowerCase(), token));
        console.log("ERROR DELETE BANNER =>", err);
      });
    console.log(selectSec, "selectSec");
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

  const onChange2 = ({ fileList: newFileList }) => {
    // if (newFileList.type === 'image/png' || newFileList.type === 'image/jpeg' || newFileList.type === 'image/jpg') {
    setFileList(newFileList);
    // } else {
    //   message.error("You can only upload JPEG/JPG/PNG file!")
    // }
  };

  const handleChangeSelect = (value, event) => {
    setSelectval(value);
  };

  const handleChangeTable = (value) => {
    setSelectSec(value);
  };

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
    },
    {
      title: <p>SECTION</p>,
      // dataIndex: "section",
      // key: "section",
      //
      render: (text, record) => {
        return (
          <h6>
            {record.is_header == "1"
              ? "Header"
              : record.is_body == "1"
              ? "Body"
              : record.is_footer == "1"
              ? "Footer"
              : null}
          </h6>
        );
      },
    },
    {
      title: <p className="ant-employed fw-bolder">ACTION</p>,
      render: (rowData) => (
        <div>
          <Tooltip title="edit">
            <a onClick={() => editupdatebanner(rowData)}>
              <EditOutlined style={{ color: "green", fontSize: "20px" }} />
            </a>
          </Tooltip>
          <Tooltip title="delete">
            <a onClick={() => handleOpenDelete(rowData)}>
              <DeleteOutlined
                style={{ marginLeft: "15px", color: "red", fontSize: "20px" }}
              />
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
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title={
                <span className="ant-employed">
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "24px",
                      color: "black",
                    }}
                  >
                    BANNER
                  </p>
                  <div>
                    <label
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        margin: "0 10px 0 0",
                      }}
                    >
                      Section
                    </label>
                    <Select
                      className="w-100"
                      size="medium"
                      defaultValue="Header"
                      onSelect={(value, event) =>
                        handleChangeTable(value, event)
                      }
                    >
                      {opt.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div>
                  <button className="btn btn-primary" onClick={addbanner}>
                    CREATE BANNER
                  </button>
                </span>
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
          {/* Create Banner */}
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
                CREATE BANNER
              </h5>
            }
            open={previewBanner}
            onOk={handlesubmit}
            okText="Add"
            onCancel={handleCloseAdd}
          >
            <Row>
              <Card
                className="card-billing-info m-2 d-flex justify-content-around"
                bordered="false"
              >
                <Descriptions title="">
                  <div className="row">
                    <div className="col-md-12">
                      <label className="">URL:</label>
                      <Input
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handlesubmit();
                          }
                        }}
                        type="text"
                        className=""
                        onChange={(e) => setCreateUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label>Select Section</label>
                      <Select
                        size="large"
                        defaultValue="Select"
                        onSelect={(value, event) =>
                          handleChangeSelect(value, event)
                        }
                        style={{ width: "100%", margin: "10px 0 0 0" }}
                      >
                        {opt.map((v, i) => (
                          <Option key={i} value={v.option}></Option>
                        ))}
                      </Select>
                      {bannerSecError ? (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          Banner section field is required!
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      {/* <ImgCrop rotate> */}
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange2}
                        // onPreview={handlePreview}
                      >
                        {fileList.length < 1 && "+ Upload"}
                      </Upload>
                      {/* </ImgCrop> */}
                      {bannerImgError ? (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          Banner image field is required!
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </Descriptions>
              </Card>
            </Row>
          </Modal>
          {/* Update Banner */}
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
                UPDATE BANNER
              </h5>
            }
            open={previewUpdateBanner}
            onOk={handleUpdateBanner}
            okText="Update"
            onCancel={handleCloseUdpate}
          >
            <Row>
              <Card
                className="card-billing-info m-2 d-flex justify-content-around"
                bordered="false"
              >
                <Descriptions title="">
                  <div className="row d-flex align-items-center mt-3">
                    <div className="col-md-4">
                      {/* <ImgCrop rotate> */}
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange2}
                        onPreview={handlePreview}
                      >
                        {fileList.length < 1 && "+ Upload"}
                      </Upload>
                      {/* </ImgCrop> */}
                    </div>
                    <div className="col-md-8">
                      <label className="">URL:</label>
                      <Input
                        type="text"
                        className=""
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </Descriptions>
              </Card>
            </Row>
          </Modal>
          {/* Delete Banner */}
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
                DELETE BANNER
              </h5>
            }
            open={previewOpenDelete}
            onOk={deleteBanner}
            okText="Delete"
            onCancel={() => setPreviewOpenDelete(false)}
            okButtonProps={{ color: "red" }}
          >
            <h6>Are you sure want to delete banner!</h6>
          </Modal>
        </Row>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="img" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    </>
  );
};

export default Banner;
