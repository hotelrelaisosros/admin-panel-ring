import { useRef, useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Col,
  List,
  Modal,
  Row,
  Input,
  Switch,
  Table,
  Tooltip,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { WarningTwoTone, NotificationOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import BgProfile from "../../assets/images/background_image.jpg";
import convesionImg from "../../assets/images/face-3.jpg";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "react-overlay-loader";
import moment from "moment";
import { AuthMiddleware } from "../../store/auth/authMiddleware";
import { setLoading } from "../../store/common/commonSlice";
import { NotificationMiddleware } from "../../store/notifications/notificationMiddleware";
import IMG_URL from "../../utils/imageurl";
const RegisteredProfile = () => {
  const [previewOpenDisable, setPreviewOpenDisable] = useState(false);
  const [msgs, setMsgs] = useState();
  const location = useLocation();
  const state = useSelector((state) => state.chat.chat.chat);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const dispatch = useDispatch();

  const [previewOpenMessage, setPreviewOpenMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState("");
  const [message, setMessage] = useState("");
  const [titleMessageError, setTitleMessageError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [blockMessage, setBlockMessage] = useState("");
  const [blockMessageError, setBlockMessageError] = useState(false);
  const [accountStatus, setAccountStatus] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectSec, setSelectSec] = useState("pending");
  const uploadedProducts = useSelector(
    (state) => state.products.uploadedProducts.Products
  );
  console.log(uploadedProducts, "data");

  console.log(location.state, "location");
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(
      AuthMiddleware.GetUploadedProducts({ id: location.state.id }, token)
    )
      .then((res) => {
        toast.success(res.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("UPLOADED PRODUCTS FOUND SUCCESS =>", res);
      })
      .catch((err) => {
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("UPLOADED PRODUCTS FOUND ERROR =>", err);
      });
  }, []);

  useEffect(() => {
    if (titleMessage === "") {
      setTitleMessageError(true);
    } else if (titleMessage !== "") {
      setTitleMessageError(false);
    }
  }, [titleMessage]);

  useEffect(() => {
    if (message === "") {
      setMessageError(true);
    } else if (message !== "") {
      setMessageError(false);
    }
  }, [message]);

  // Block account

  const handleOpenDisable = () => {
    setPreviewOpenDisable(true);
  };
  const handleClose = () => {
    setPreviewOpenDisable(false);
  };
  const handleDisableAccount = () => {
    if (!blockMessage) {
      setPreviewOpenDisable(true);
      dispatch(setLoading(false));
      setBlockMessageError(true);
      toast.error("Please fill this field!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    } else {
      setPreviewOpenDisable(false);
      dispatch(setLoading(true));
      dispatch(
        AuthMiddleware.BlockUserAccount(
          { id: location.state.id, blockMessage: blockMessage },
          token
        )
      ).then((res) => {
        dispatch(setLoading(false));
        dispatch(AuthMiddleware.GetUsers({ selectSec: "users" }, token));
        toast.success(res?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        if (res?.data?.User.is_block === true) {
          setAccountStatus(true);
        } else {
          setAccountStatus(false);
        }
      });
    }
  };

  // Send notification

  const handleOpencreatemessage2 = () => {
    setPreviewOpenMessage(true);
    setMessageError(false);
    setTitleMessageError(false);
  };
  const handleMessageClose = () => {
    setPreviewOpenMessage(false);
    setTitleMessage("");
    setMessage("");
  };
  const handleSendMessageById = () => {
    const formdata = new FormData();
    formdata.append("id", location.state.id);
    formdata.append("title", titleMessage);
    formdata.append("message", message);
    if (!titleMessage || message) {
      setPreviewOpenMessage(true);
      dispatch(setLoading(false));
      toast.error("Please fill all fields!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
    if (titleMessage === "") {
      setTitleMessageError(true);
    } else if (titleMessage !== "") {
      setTitleMessageError(false);
    }
    if (message === "") {
      setMessageError(true);
    } else if (message !== "") {
      setMessageError(false);
    }
    if (titleMessage && message) {
      setPreviewOpenMessage(false);
      dispatch(setLoading(true));
      dispatch(NotificationMiddleware.SendNotificationById(formdata, token))
        .then((res) => {
          dispatch(setLoading(false));
          setTitleMessage("");
          setMessage("");
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          dispatch(NotificationMiddleware.getNotification(token));
          console.log("SUCCESS SEND NOTIFICATION BY ID =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          dispatch(NotificationMiddleware.getNotification(token));
          console.log("ERROR SEND NOTIFICATION BY ID =>", err);
        });
    }
  };

  function getChat(item) {
    setMsgs(item);
    console.log(item);
  }

  const columns = [
    {
      title: <p>IMAGE</p>,
      render: (rowData) => {
        console.log(rowData, "imgssssssssssssss");
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
      render: (rowData) => {
        return <p className="text-dark">{rowData.title}</p>;
      },
    },
    {
      title: <p>COLLECTION</p>,
      render: (rowData) => {
        return <p className="text-dark">{rowData.category.name}</p>;
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
              {" "}
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
    {
      title: <p>DESCRIPTION</p>,
      dataIndex: "product_description",
      key: "product_description",
    },
    // {
    //   title: <p>ACTION</p>,
    //   render: (rowData) => (
    //     <div className="ant-employed">
    //       {/* <button
    //         onClick={() => handleOpenViewDetail(rowData)}
    //         style={{ fontSize: "14px", marginLeft: "4px" }}
    //         className="btn btn-info text-white"
    //       >
    //         VIEW DETAIL
    //       </button> */}
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      <div
        className="profile-nav-bg"
        style={{ backgroundImage: "url(" + BgProfile + ")" }}
      ></div>
      {load ? <Loader fullPage loading /> : null}
      {/* {networkError === true ? toast.error("No internet connection please check your connection!", {
        position: "bottom-left",
        autoClose: 2000,
      }) : ""} */}
      {location.state.role.name !== "user" && <ToastContainer />}
      <Card
        className="card-profile-head"
        bodyStyle={{ display: "none" }}
        title={
          <Row gutter={[24, 0]}>
            <Col md={12}>
              <Avatar.Group>
                <Avatar size={74} shape="square" src={location?.state?.image} />
                <div className="avatar-info">
                  <h4 className="font-semibold m-0">
                    {location?.state?.username} ({location?.state?.role?.name})
                  </h4>
                  <p>{location?.state?.email}</p>
                  {location.state.is_block === "1" ? (
                    <div
                      style={{
                        backgroundColor: "#FF4D4F",
                        borderRadius: "4px",
                        width: "130px",
                      }}
                    >
                      <p style={{ color: "white", padding: "5px 10px" }}>
                        Account Blocked
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#28A745",
                        borderRadius: "4px",
                        width: "130px",
                      }}
                    >
                      <p style={{ color: "white", padding: "5px 10px" }}>
                        Account Unblock
                      </p>
                    </div>
                  )}
                </div>
              </Avatar.Group>
            </Col>
            <Col md={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "flex-end",
                }}
              >
                <Tooltip title="send notification">
                  <a onClick={handleOpencreatemessage2}>
                    <NotificationOutlined
                      style={{ color: "gray", fontSize: "20px" }}
                    />
                  </a>
                </Tooltip>
                <div style={{ margin: "0 0 0 30px" }}>
                  <Switch
                    checked={location.state.is_block === "1" ? true : false}
                    onChange={handleOpenDisable}
                  />
                  <p className="mt-1">
                    {location.state.is_block === "1" ? "Enable" : "Disable"}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        }
      ></Card>
      {location.state.role.name !== "user" && (
        <Card
          bordered={false}
          className="criclebox tablespace mb-24"
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "24px",
                  color: "black",
                }}
              >
                UPLOADED PRODUCTS
              </p>

              {/* <label style={{ fontSize: "16px", fontWeight: "600", margin: "0 10px 0 40px" }}>status</label>
            <div>
              <Select
                size="medium"
                defaultValue="Pending"
                style={{ width: "150px" }}
                onSelect={(value, event) => handleChangeTable(value, event)}
              >
                {opt.map((v, i) => (
                  <Option key={i} value={v.option}></Option>
                ))}
              </Select>
            </div> */}
            </div>
          }
        >
          {/* {selectSec === "Pending" ? ( */}
          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={uploadedProducts}
              className="ant-border-space"
              pagination={{
                position: ["bottomCenter"],
                current: page,
                pageSize: pageSize,
                total: uploadedProducts?.length,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
              }}
            />
          </div>
        </Card>
      )}
      <Card
        style={{ margin: "30px 0" }}
        bordered={true}
        title="CHATS"
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 16,
          paddingLeft: 11.5,
          paddingRight: 11.5,
        }}
      >
        <Row gutter={[24, 0]}>
          <Col
            span={16}
            md={8}
            style={{ padding: "0", overflowY: "scroll", height: "50vh" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={state}
              split={false}
              className="conversations-list"
              renderItem={(item) => (
                <List.Item
                  onClick={() => getChat(item)}
                  style={{
                    backgroundColor: item.id === msgs?.id ? "#0084FF" : "",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" size={48} src={convesionImg} />
                    }
                    title={
                      <p
                        style={{
                          margin: "0",
                          color: item.id === msgs?.id ? "white" : "black",
                        }}
                      >
                        {item?.receiver?.username}
                      </p>
                    }
                    description={
                      <p
                        style={{
                          margin: "0",
                          color: item.id === msgs?.id ? "white" : "black",
                        }}
                      >
                        {item?.messages[item?.messages?.length - 1]?.message}
                      </p>
                    }
                    style={{ cursor: "pointer" }}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col
            span={16}
            md={16}
            style={{
              padding: "0",
              overflowY: "scroll",
              height: "50vh",
              border: "1px solid #E3E5E6",
            }}
          >
            {!msgs ? (
              <p>No chats selected</p>
            ) : (
              <div>
                {msgs?.messages.map((msg) => {
                  return (
                    <div style={{ margin: "10px" }}>
                      <p
                        style={{
                          margin: "10px 0",
                          color: "black",
                          fontSize: "18px",
                          fontWeight: "700",
                          textAlign:
                            location.state?.id.toString() === msg.sender_id
                              ? "right"
                              : "left",
                        }}
                      >
                        {location.state?.id.toString() === msg.sender_id
                          ? msgs.sender.username
                          : msgs.receiver.username}
                      </p>
                      <div
                        style={{
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius:
                            location.state?.id.toString() === msg.sender_id
                              ? "20px 20px 0px 20px"
                              : "20px 20px 20px 0",
                          backgroundColor:
                            location.state?.id.toString() === msg.sender_id
                              ? "#0084FF"
                              : "rgba(0, 0, 0, 0.1)",
                          justifyContent:
                            location.state?.id.toString() === msg.sender_id
                              ? "end"
                              : "start",
                          alignItems:
                            location.state?.id.toString() === msg.sender_id
                              ? "end"
                              : "start",
                        }}
                      >
                        {(msg.message && (
                          <>
                            <p
                              style={{
                                margin: "13px 20px 0 20px",
                                fontWeight: "600",
                                color:
                                  location.state?.id.toString() ===
                                  msg.sender_id
                                    ? "white"
                                    : "black",
                              }}
                            >
                              {msg.message}
                            </p>
                            <p
                              style={{
                                margin: "0 20px 13px 20px",
                                fontWeight: "400",
                                color:
                                  location.state?.id.toString() ===
                                  msg.sender_id
                                    ? "white"
                                    : "black",
                              }}
                            >
                              {moment(msg?.created_at?.toDate()).fromNow()}
                            </p>
                          </>
                        )) ||
                          (msg.image && (
                            <>
                              <img
                                style={{ margin: "13px 20px 0 20px" }}
                                width={100}
                                src={IMG_URL + msg.image}
                              />
                              <p style={{ margin: "10px 20px" }}>{msg.title}</p>
                              <p
                                style={{
                                  margin: "0 20px 13px 20px",
                                  fontWeight: "400",
                                  color:
                                    location.state?.id.toString() ===
                                    msg.sender_id
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {moment(msg?.created_at?.toDate()).fromNow()}
                              </p>
                            </>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Col>
        </Row>
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
              {accountStatus === true ? "UNBLOCK ACCOUNT" : "BLOCK ACCOUNT"}
            </h5>
          }
          open={previewOpenDisable}
          onOk={handleDisableAccount}
          onCancel={handleClose}
        >
          <div className="d-flex justify-content-center align-item-center">
            <WarningTwoTone style={{ marginRight: "7px" }} />
            {accountStatus === true
              ? "Are you sure want to unblock account!"
              : "Are you sure want to block account!"}
          </div>
          <label style={{ margin: "20px 0 10px 0" }}>Message</label>
          <TextArea
            style={{ height: "100px" }}
            placeholder="Enter Your Message"
            type="text"
            value={blockMessage}
            onChange={(e) => setBlockMessage(e.target.value)}
          />
          {blockMessageError ? (
            <p style={{ color: "red", marginTop: "10px" }}>
              Message field is required!
            </p>
          ) : (
            ""
          )}
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
              CREATE MESSAGE
            </h5>
          }
          open={previewOpenMessage}
          onOk={handleSendMessageById}
          onCancel={handleMessageClose}
        >
          <label style={{ margin: "10px 0" }}>Title</label>
          <Input
            style={{ width: "100%" }}
            type="text"
            value={titleMessage}
            onChange={(e) => setTitleMessage(e.target.value)}
          />
          {titleMessageError ? (
            <p style={{ color: "red", marginTop: "10px" }}>
              Title field is required!
            </p>
          ) : (
            ""
          )}
          <Row>
            <Col md={24}>
              <label style={{ margin: "10px 0" }}>Message</label>
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Col>
            {messageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                Message field is required!
              </p>
            ) : (
              ""
            )}
          </Row>
        </Modal>
      </Card>
    </>
  );
};

export default RegisteredProfile;
