import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
  Upload,
} from "antd";
// import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import IMG_URL from "../../utils/imageurl";
// Images
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { BannerMiddleware } from "../../store/banner/BannerMiddleware";
import { setLoading } from "../../store/common/commonSlice";
import { HomeImageMiddleware } from "../../store/homePageImage/homePageImageMiddleware";

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
  const [previewHomeImage, setPreviewHomeImage] = useState(false);
  const [previewUpdateImage, setPreviewUpdateImage] = useState("");
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [homeImageId, setUpdateHomeImageId] = useState();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [selectval, setSelectval] = useState("");
  const [selectSec, setSelectSec] = useState("Discount");
  const [selectthird, setSelectthird] = useState("");
  const [promotionImageError, setPromotionImageError] = useState(false);
  const [promotionRoleError, setPromotionRoleError] = useState(false);
  const [promotionSecError, setPromotionSecError] = useState(false);
  const [selectRole, setSelectRole] = useState("All");
  const [selectApp, setSelectApp] = useState("Web");
  const [url, setUrl] = useState("");
  const [createUrl, setCreateUrl] = useState("");

  const { Option } = Select;
  const opt = [
    { option: "Discount" },
    { option: "Featured" },
    { option: "NewArrival" },
    { option: "TopRating" },
    { option: "JustForYou" },
    { option: "Trending" },
    { option: "BestSeller" },
  ];
  const optCreate = [
    { option: "Discount" },
    { option: "Featured" },
    { option: "NewArrival" },
    { option: "TopRating" },
    { option: "JustForYou" },
    { option: "Trending" },
    { option: "BestSeller" },
  ];
  const optsec = [{ option: "Retailer" }, { option: "Wholesaler" }];
  const opt2 = [
    { option: "All" },
    { option: "Wholesaler" },
    { option: "Retailer" },
  ];
  const opt3 = [{ option: "All" }, { option: "Web" }, { option: "App" }];

  const dispatch = useDispatch();
  const data = useSelector((state) => state.homeImage.images.homePageImages);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  let token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(
      HomeImageMiddleware.GetHomeImage(
        {
          section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1),
          role: selectRole.toLowerCase(),
        },
        token
      )
    );
  }, [selectSec]);

  useEffect(() => {
    console.log("selectRole==.=>", selectRole);
    console.log("selectSec==.=>", selectSec);
    console.log("selectApp==.=>", selectApp);
    if (selectRole.toLowerCase() === "all") {
      dispatch(
        HomeImageMiddleware.GetHomeImage(
          {
            section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1),
            is_app: selectApp.toLowerCase(),
            role: null,
          },
          token
        )
      );
    } else {
      dispatch(
        HomeImageMiddleware.GetHomeImage(
          {
            section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1),
            is_app: selectApp.toLowerCase(),
            role: selectRole.toLowerCase(),
          },
          token
        )
      );
    }
  }, [selectRole, selectApp]);

  useEffect(() => {
    if (fileList?.length === 0) setPromotionImageError(true);
    else if (fileList?.length > 0) setPromotionImageError(false);
  }, [fileList]);

  useEffect(() => {
    if (selectthird === "") setPromotionRoleError(true);
    else if (selectthird !== "") setPromotionRoleError(false);
  }, [selectthird]);

  useEffect(() => {
    if (selectval === "") setPromotionSecError(true);
    else if (selectval !== "") setPromotionSecError(false);
  }, [selectval]);

  const handleOpenAdd = () => {
    setPreviewHomeImage(true);
    setPromotionImageError(false);
    setPromotionRoleError(false);
    setPromotionSecError(false);
  };

  const handleCloseAdd = () => {
    setPreviewHomeImage(false);
    setPromotionSecError(false);
    setPromotionImageError(false);
    setPromotionRoleError(false);
    setFileList([]);
  };

  const handleAddHomeImages = () => {
    const formData = new FormData();
    formData.append("role", selectthird.toLowerCase());
    formData.append("url", createUrl);
    fileList.map((x) => formData.append("images[]", x.originFileObj));
    formData.append(
      "section",
      selectval.charAt(0).toLowerCase() + selectval.slice(1)
    );
    if (!selectval || !selectthird || fileList?.length === 0) {
      toast.error("Please fill all fields!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
    if (fileList?.length === 0) {
      setPromotionImageError(true);
    } else if (fileList?.length > 0) {
      setPromotionImageError(false);
    }
    if (selectthird === "") {
      setPromotionRoleError(true);
    } else if (selectthird !== "") {
      setPromotionRoleError(false);
    }
    if (selectval === "") {
      setPromotionSecError(true);
    } else if (selectval !== "") {
      setPromotionSecError(false);
    }
    if (selectval && selectthird && fileList?.length > 0) {
      setPreviewHomeImage(false);
      dispatch(setLoading(true));
      setSelectval("");
      setSelectthird("");
      setFileList([]);
      setPromotionSecError(false);
      setPromotionRoleError(false);
      setPromotionImageError(false);
      dispatch(HomeImageMiddleware.AddHomeImage(formData, token))
        .then((res) => {
          dispatch(setLoading(false));
          dispatch(
            HomeImageMiddleware.GetHomeImage(
              {
                section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1),
              },
              token
            )
          );
          toast.success(res?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("SUCCESS ADDED BANNER =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          dispatch(
            HomeImageMiddleware.GetHomeImage(
              {
                section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1),
              },
              token
            )
          );
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ERROR ADDED BANNER =>", err);
        });
    }
  };

  const handleOpenUpdate = (rowData) => {
    setPreviewUpdateImage(true);
    const imgsp = `${IMG_URL}/`;
    setFileList([{ url: imgsp + rowData.image }]);
    setUpdateHomeImageId(rowData.id);
    setUrl(rowData?.url);
  };

  const handleCloseUpdate = () => {
    setPreviewUpdateImage(false);
    setFileList([]);
  };

  const handleUpdateHomeImages = () => {
    setPreviewUpdateImage(false);
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("id", homeImageId);
    formData.append("url", url);
    console.log("fileList=>", fileList);

    fileList.map((x) => {
      if (x.originFileObj) {
        formData.append("images", x.originFileObj);
      }
    });
    console.log({ url, fileList });
    dispatch(HomeImageMiddleware.UpdateHomeImage(formData, token))
      .then((res) => {
        dispatch(setLoading(false));
        toast.success(res?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(
          HomeImageMiddleware.GetHomeImage(
            { section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1) },
            token
          )
        );
        console.log("SUCCESS UPDATE BANNER =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(
          HomeImageMiddleware.GetHomeImage(
            { section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1) },
            token
          )
        );
        console.log("ERROR UPDATE BANNER =>", err);
      });
  };

  const handleOpenDelete = (rowData) => {
    setPreviewOpenDelete(true);
    setDeleteData(rowData);
  };

  const handleDeleteHomeImages = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    dispatch(HomeImageMiddleware.DeleteHomeImage({ id: deleteData.id }, token))
      .then((res) => {
        dispatch(setLoading(false));
        toast.success(res?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(
          HomeImageMiddleware.GetHomeImage(
            { section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1) },
            token
          )
        );
        console.log("SUCCESS DELETE BANNER =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(
          HomeImageMiddleware.GetHomeImage(
            { section: selectSec.charAt(0).toLowerCase() + selectSec.slice(1) },
            token
          )
        );
        console.log("ERROR DELETE BANNER =>", err);
      });
    console.log(selectSec, "selectSec");
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

  const onChange2 = ({ fileList: newFileList }) => {
    // if (newFileList.type === 'image/png' || newFileList.type === 'image/jpeg' || newFileList.type === 'image/jpg') {
    setFileList(newFileList);
    // } else {
    //   message.error("You can only upload JPEG/JPG/PNG file!")
    // }
  };

  const beforeUpload = (file) => {
    const isPNG = file.type === "image/png" || file.type === "image/jpg";
    if (!isPNG) {
      message.error(`${file.name} is not a png file`);
    }
    return false;
  };
  const handleChangeSelect = (value, event) => {
    setSelectval(value);
  };

  const handleChangeSelectRole = (value, event) => {
    setSelectthird(value);
  };

  const handleChangeTable = (value) => {
    setSelectSec(value);
    console.log(value);
  };

  const handleChangeApp = (value) => {
    setSelectApp(value);
    console.log(value);
  };

  const handleChangeRole = (value) => {
    setSelectRole(value);
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
      title: <p>ROLE</p>,
      render: (text, record) => (
        <h6>
          {record.is_retailer == "1"
            ? "Retailer"
            : record.is_wholesaler == "1"
            ? "Wholesaler"
            : ""}
        </h6>
      ),
    },
    selectSec === "JustForYou"
      ? {
          title: <p>PLATFORM</p>,
          render: (text, record) => (
            <h6>
              {record.is_app == "1" ? "App" : record.is_app == "0" ? "Web" : ""}
            </h6>
          ),
        }
      : {},
    {
      title: <p>SECTION</p>,
      dataIndex: "section",
      key: "section",
      render: (text, record) => {
        console.log("record", record);
        return (
          <h6>
            {record.is_discount == "1"
              ? "Discount"
              : record.is_featured == "1"
              ? "Featured"
              : record.is_new_arrival == "1"
              ? "New Arrival"
              : record.is_top_rating == "1"
              ? "Top Rating"
              : record.is_just_for_you == "1"
              ? "Just For You"
              : record.is_trending == "1"
              ? "Trending"
              : record.is_best_seller == "1"
              ? "Best Seller"
              : null}
          </h6>
        );
      },
    },
    {
      title: <p>ACTION</p>,
      render: (rowData) => (
        <div>
          <Tooltip title="edit">
            <a onClick={() => handleOpenUpdate(rowData)}>
              <EditOutlined style={{ color: "green", fontSize: "20px" }} />
            </a>
          </Tooltip>
          {selectSec == "JustForYou" ? null : (
            <Tooltip title="delete">
              <a onClick={() => handleOpenDelete(rowData)}>
                <DeleteOutlined
                  style={{ marginLeft: "15px", color: "red", fontSize: "20px" }}
                />
              </a>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (networkError === true) {
      toast.error("No internet connection please check your connection!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
  }, [networkError]);

  const handleCancel = () => setPreviewOpen(false);

  return (
    <>
      {load ? <Loader fullPage loading /> : null}
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
                    PROMOTION
                  </p>

                  <div>
                    <label
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginRight: "10px",
                      }}
                    >
                      Role
                    </label>
                    <Select
                      size="medium"
                      defaultValue="ALL"
                      style={{ width: "120px" }}
                      value={selectRole}
                      onSelect={(value, event) =>
                        handleChangeRole(value, event)
                      }
                    >
                      {opt2.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div>
                  {selectSec === "JustForYou" && (
                    <div>
                      <label
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginRight: "10px",
                        }}
                      >
                        Application
                      </label>
                      <Select
                        size="medium"
                        defaultValue="All"
                        style={{ width: "120px" }}
                        onSelect={(value, event) =>
                          handleChangeApp(value, event)
                        }
                      >
                        {opt3.map((v, i) => (
                          <Option key={i} value={v.option}></Option>
                        ))}
                      </Select>
                    </div>
                  )}

                  <div>
                    <label
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginRight: "10px",
                      }}
                    >
                      Section
                    </label>
                    <Select
                      size="medium"
                      defaultValue="Discount"
                      style={{ width: "120px" }}
                      onSelect={(value, event) =>
                        handleChangeTable(value, event)
                      }
                    >
                      {opt.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div>

                  <button className="btn btn-primary" onClick={handleOpenAdd}>
                    CREATE PROMOTION
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
                CREATE PROMOTION
              </h5>
            }
            open={previewHomeImage}
            onOk={handleAddHomeImages}
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
                            handleAddHomeImages();
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
                        defaultValue="SELECT"
                        value={selectval}
                        onSelect={(value, event) =>
                          handleChangeSelect(value, event)
                        }
                        style={{ width: "100%", margin: "10px 0 0 0" }}
                      >
                        {optCreate.map((v, i) => (
                          <Option key={i} value={v.option}></Option>
                        ))}
                      </Select>
                      {promotionSecError ? (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          Promotion section field is required!
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label>Select Role</label>
                      <Select
                        size="large"
                        defaultValue="SELECT"
                        value={selectthird}
                        onSelect={(value, event) =>
                          handleChangeSelectRole(value, event)
                        }
                        style={{ width: "100%", margin: "10px 0 0 0" }}
                      >
                        {optsec.map((v, i) => (
                          <Option key={i} value={v.option}></Option>
                        ))}
                      </Select>
                      {promotionRoleError ? (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          Promotion Role field is required!
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
                        accept="image/png, image/jpeg"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange2}
                        onPreview={handlePreview}
                        beforeUpload={beforeUpload}
                      >
                        {fileList.length < 1 && "+ Upload"}
                      </Upload>
                      {/* </ImgCrop> */}
                      {promotionImageError ? (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          Promotion image field is required!
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
                UPDATE PROMOTION
              </h5>
            }
            open={previewUpdateImage}
            onOk={handleUpdateHomeImages}
            okText="Update"
            onCancel={handleCloseUpdate}
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
                        accept="image/png, image/jpeg"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange2}
                        onPreview={handlePreview}
                        beforeUpload={beforeUpload}
                      >
                        {fileList.length < 1 && "+ Upload"}
                      </Upload>
                      {/* </ImgCrop> */}
                    </div>
                    <div className="col-md-8">
                      <label className="">URL:</label>
                      <Input
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateHomeImages();
                          }
                        }}
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
                DELETE PROMOTION
              </h5>
            }
            open={previewOpenDelete}
            onOk={handleDeleteHomeImages}
            okText="Delete"
            onCancel={() => setPreviewOpenDelete(false)}
            okButtonProps={{ color: "red" }}
          >
            <h6>Are you sure want to delete image!</h6>
          </Modal>
          {/* Delete Banner */}

          {/* Preview Banner */}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="img" style={{ width: "100%" }} src={previewImage} />
          </Modal>
          {/* Preview Banner */}
        </Row>
      </div>
    </>
  );
};

export default Banner;
