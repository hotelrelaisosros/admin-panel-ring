import {
  EyeTwoTone,
  NotificationOutlined,
  WarningTwoTone,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthMiddleware } from "../../store/auth/authMiddleware";
import { setLoading } from "../../store/common/commonSlice";
import { NotificationMiddleware } from "../../store/notifications/notificationMiddleware";
import "./register.css";

const RegisteredAcount = () => {
  const { Search } = Input;
  const [search, setSearch] = useState("");

  const [productPage, setProductPage] = useState(1);
  let history = useHistory();
  const [previewOpenDisable, setPreviewOpenDisable] = useState(false);
  const [showTotalUsers, setShowTotalUsers] = useState();
  const [showTotalBlockUsers, setShowTotalBlockUsers] = useState();
  const [showTotalUnblockUsers, setShowTotalUnblockUsers] = useState();

  const [previewOpenMessage, setPreviewOpenMessage] = useState(false);
  const [titleMessage, setTitleMessage] = useState("");
  const [message, setMessage] = useState("");
  const [selectRole, setSelectRole] = useState("Users");

  const [previewOpenMessage2, setPreviewOpenMessage2] = useState(false);
  const [titleMessage2, setTitleMessage2] = useState("");
  const [message2, setMessage2] = useState("");
  const [notificationUserId, setNotificationUserId] = useState();
  const [selectUserRole, setSelectUserRole] = useState("");
  const [accountId, setAccountId] = useState();

  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const [userRoleError, setUserRoleError] = useState("");
  const [titleMessageError, setTitleMessageError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [blockMessage, setBlockMessage] = useState("");
  const [blockMessageError, setBlockMessageError] = useState(false);
  const [accountStatus, setAccountStatus] = useState(false);
  const { Option } = Select;
  const { Title } = Typography;

  const opt = [
    { option: "Users" },
    { option: "Retailers" },
    { option: "Wholesalers" },
  ];

  const optmsg = [
    { option: "All" },
    { option: "User" },
    { option: "Retailer" },
    { option: "Wholesaler" },
  ];

  let token = localStorage.getItem("token");

  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("search", "");
    dispatch(
      AuthMiddleware.GetUsers(
        formData,
        { role: selectRole.toLowerCase() },
        token
      )
    ).then((res) => {
      console.log("ALL USERS =>", res);
      setShowTotalUsers(
        res?.data?.totalUsersCount ||
          res?.data?.totalRetailersCount ||
          res?.data?.totalWholesalersCount
      );
      setShowTotalUnblockUsers(
        res?.data?.unblockUsersCount ||
          res?.data?.unblockRetailersCount ||
          res?.data?.unblockWholesalersCount
      );
      setShowTotalBlockUsers(
        res?.data?.blockUsersCount ||
          res?.data?.blockRetailersCount ||
          res?.data?.blockWholesalersCount
      );
    });
  }, [selectRole]);

  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("search", "");
    dispatch(
      AuthMiddleware.GetUsers(
        formData,
        { role: selectRole.toLowerCase() },
        token
      )
    ).then((res) => {
      console.log("ALL USERS =>", res);
      setShowTotalUsers(
        res?.data?.totalUsersCount ||
          res?.data?.totalRetailersCount ||
          res?.data?.totalWholesalersCount
      );
      setShowTotalUnblockUsers(
        res?.data?.unblockUsersCount ||
          res?.data?.unblockRetailersCount ||
          res?.data?.unblockWholesalersCount
      );
      setShowTotalBlockUsers(
        res?.data?.blockUsersCount ||
          res?.data?.blockRetailersCount ||
          res?.data?.blockWholesalersCount
      );
    });
    // dispatch(NotificationMiddleware.getNotification(token));
  }, [selectRole]);

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    setProductPage(page);
    const formData = new FormData();
    formData.append("skip", pageSize * (page - 1));
    formData.append("take", pageSize);
    formData.append("role", selectRole);
    dispatch(
      AuthMiddleware.GetUsers(
        formData,
        { role: selectRole.toLowerCase() },
        token
      )
    ).then((res) => {
      console.log("ALL USERS =>", res);
      setShowTotalUsers(
        res?.data?.totalUsersCount ||
          res?.data?.totalRetailersCount ||
          res?.data?.totalWholesalersCount
      );
      setShowTotalUnblockUsers(
        res?.data?.unblockUsersCount ||
          res?.data?.unblockRetailersCount ||
          res?.data?.unblockWholesalersCount
      );
      setShowTotalBlockUsers(
        res?.data?.blockUsersCount ||
          res?.data?.blockRetailersCount ||
          res?.data?.blockWholesalersCount
      );
    });
  }

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

  useEffect(() => {
    if (titleMessage2 === "") {
      setTitleMessageError(true);
    } else if (titleMessage2 !== "") {
      setTitleMessageError(false);
    }
  }, [titleMessage2]);

  useEffect(() => {
    if (message2 === "") {
      setMessageError(true);
    } else if (message2 !== "") {
      setMessageError(false);
    }
  }, [message2]);

  useEffect(() => {
    if (selectUserRole === "") {
      setUserRoleError(true);
    } else if (selectUserRole !== "") {
      setUserRoleError(false);
    }
  }, [selectUserRole]);

  const handleOpenDisable = (record) => {
    setPreviewOpenDisable(true);
    setAccountId(record);
  };

  const handleDisableAccount = (formData, rowData) => {
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
      console.log(selectRole);
      dispatch(
        AuthMiddleware.BlockUserAccount(
          { id: accountId.id, blockMessage: blockMessage },
          token
        )
      ).then((res) => {
        dispatch(setLoading(false));
        const formData = new FormData();
        formData.append("skip", 0);
        formData.append("take", 10);
        formData.append("search", "");
        dispatch(
          AuthMiddleware.GetUsers(
            formData,
            { role: selectRole.toLowerCase() },
            token
          )
        ).then((res) => {
          console.log("ALL USERS =>", res);
          setShowTotalUsers(res.data.totalUsersCount);
          setShowTotalUnblockUsers(res.data.unblockUsersCount);
          setShowTotalBlockUsers(res.data.blockUsersCount);
        });
        // dispatch(NotificationMiddleware.getNotification(token));
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

  const handleClose = () => {
    setPreviewOpenDisable(false);
  };

  const handleChangeTable = (value) => {
    setSelectRole(value);
  };

  const handleChangeUserRole = (value) => {
    setSelectUserRole(value);
  };

  function handleSearch() {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("search", search);
    dispatch(
      AuthMiddleware.GetUsers(
        formData,
        { role: selectRole.toLowerCase() },
        token
      )
    )
      .then((res) => {
        toast.success(res.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("REGISTERED ACCOUNT FOUND SUCCESS =>", res);
      })
      .catch((err) => {
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("REGISTERED ACCOUNT FOUND ERROR =>", err);
      });
  }

  // send notification users by role

  const handleOpencreatemessage = () => {
    setPreviewOpenMessage(true);
    setUserRoleError(false);
    setMessageError(false);
    setTitleMessageError(false);
  };
  const handleMessageClose = () => {
    setPreviewOpenMessage(false);
    setSelectRole("");
    setTitleMessage("");
    setMessage("");
  };
  const handleSendMessage = () => {
    const formdata = new FormData();
    formdata.append("role", selectUserRole.toLowerCase());
    formdata.append("title", titleMessage);
    formdata.append("message", message);
    if (!selectUserRole || !titleMessage || !message) {
      setPreviewOpenMessage(true);
      dispatch(setLoading(false));
      toast.error("Please fill all fields!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
    if (selectUserRole === "") {
      setUserRoleError(true);
    } else if (selectUserRole !== "") {
      setUserRoleError(false);
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
    if (selectUserRole === "All") {
      setPreviewOpenMessage(false);
      dispatch(setLoading(true));
      dispatch(NotificationMiddleware.SendNotificationAll(formdata, token))
        .then((res) => {
          setTitleMessage("");
          setMessage("");
          dispatch(setLoading(false));
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          // dispatch(NotificationMiddleware.getNotification(token));
          // console.log("SUCCESS SEND NOTIFICATION ALL =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          // dispatch(NotificationMiddleware.getNotification(token));
          // console.log("ERROR SEND NOTIFICATION ALL =>", err);
        });
    }
    if (selectUserRole !== "All" && titleMessage && message) {
      setPreviewOpenMessage(false);
      dispatch(setLoading(true));
      dispatch(NotificationMiddleware.SendNotification(formdata, token))
        .then((res) => {
          dispatch(setLoading(false));
          setSelectRole("");
          setTitleMessage("");
          setMessage("");
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 1000,
          });
          // dispatch(NotificationMiddleware.getNotification(token));
          // console.log("SUCCESS SEND NOTIFICATION =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 1000,
          });
          // dispatch(NotificationMiddleware.getNotification(token));
          // console.log("ERROR SEND NOTIFICATION =>", err);
        });
    }
  };

  // send notification users by id

  const handleOpencreatemessage2 = (rowData) => {
    setPreviewOpenMessage2(true);
    setNotificationUserId(rowData.id);
    setMessageError(false);
    setTitleMessageError(false);
  };
  const handleMessageClose2 = () => {
    setPreviewOpenMessage2(false);
    setTitleMessage2("");
    setMessage2("");
  };
  const handleSendMessageById = () => {
    const formdata = new FormData();
    formdata.append("id", notificationUserId);
    formdata.append("title", titleMessage2);
    formdata.append("message", message2);
    if (!titleMessage2 || !message2) {
      setPreviewOpenMessage2(true);
      dispatch(setLoading(false));
      toast.error("Please fill all fields!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
    if (titleMessage2 === "") {
      setTitleMessageError(true);
    } else if (titleMessage2 !== "") {
      setTitleMessageError(false);
    }
    if (message2 === "") {
      setMessageError(true);
    } else if (message2 !== "") {
      setMessageError(false);
    }
    if (titleMessage2 && message2) {
      setPreviewOpenMessage2(false);
      dispatch(setLoading(true));
      dispatch(NotificationMiddleware.SendNotificationById(formdata, token))
        .then((res) => {
          dispatch(setLoading(false));
          setTitleMessage2("");
          setMessage2("");
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          // dispatch(NotificationMiddleware.getNotification(token));
          // console.log("SUCCESS SEND NOTIFICATION BY ID =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          // dispatch(NotificationMiddleware.getNotification(token));
          // console.log("ERROR SEND NOTIFICATION BY ID =>", err);
        });
    }
  };

  const columns = [
    {
      title: <p>USERS</p>,
      dataIndex: "users",
      key: "users",
      onFilter: (value, record) => record.userName === "John Levi",
      render: (text, record) => {
        return (
          <Avatar.Group>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={40}
              src={record?.image}
            ></Avatar>
            <div className="avatar-info">
              <Title level={5}>{record.username}</Title>
              {/* <p>{record.email}</p> */}
            </div>
          </Avatar.Group>
        );
      },
    },
    {
      title: <p>ROLE</p>,
      render: (text, record) => {
        return <p>{record.role.name}</p>;
      },
    },
    {
      title: <p>EMAIL</p>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <p>STATUS</p>,
      key: "is_block",
      dataIndex: "is_block",
      render: (rowData) => {
        return rowData === "1" ? (
          <div style={{ backgroundColor: "#FF4D4F", borderRadius: "4px" }}>
            <p style={{ color: "white", padding: "5px 10px" }}>
              Account Blocked
            </p>
          </div>
        ) : (
          <div style={{ backgroundColor: "#28A745", borderRadius: "4px" }}>
            {" "}
            <p style={{ color: "white", padding: "5px 10px" }}>
              Account Unblock
            </p>
          </div>
        );
      },
    },
    // {
    //   title: "EMPLOYED",
    //   key: "employed",
    //   dataIndex: "employed",
    //   render: (text, record) => {
    //     return <Title level={5}>{record.role.created_at.slice(0, 10)}</Title>;
    //   },
    // },
    {
      title: <p>ENABLE / DISABLE</p>,
      key: "Enable / Disable",
      dataIndex: "Enable / Disable",
      render: (value, record) => {
        return (
          <>
            <Switch
              checked={record.is_block == "1" ? true : false}
              onChange={() => handleOpenDisable(record)}
            />
            <p>{record.is_block == "1" ? "Enable" : "Disable"}</p>
          </>
        );
      },
    },
    {
      title: <p>ACTION</p>,
      render: (rowData) => {
        return (
          <div className="ant-employed">
            <Tooltip title="view">
              <a
                onClick={() =>
                  history.push({
                    pathname: "/registeredProfile",
                    state: rowData,
                  })
                }
              >
                <EyeTwoTone style={{ fontSize: "20px" }} />
              </a>
            </Tooltip>

            <Tooltip title="send notification">
              <a onClick={() => handleOpencreatemessage2(rowData)}>
                <NotificationOutlined
                  style={{ color: "gray", fontSize: "20px" }}
                />
              </a>
            </Tooltip>
          </div>
        );
      },
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
                    REGISTERED ACCOUNTS
                  </p>
                  <div>
                    <label
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        margin: "0 10px 0 0",
                      }}
                    >
                      Role
                    </label>
                    <Select
                      size="medium"
                      defaultValue="Users"
                      className="w-100"
                      onSelect={(value, event) =>
                        handleChangeTable(value, event)
                      }
                    >
                      {opt.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleOpencreatemessage}
                  >
                    CREATE NOTIFICATION
                  </button>
                </span>
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 0 20px 15px",
                }}
              >
                <div style={{ margin: "0 12px", textAlign: "center" }}>
                  <Button
                    style={{
                      backgroundColor: "#0B5ED7",
                      fontSize: "16px",
                      color: "white",
                      width: "60px",
                    }}
                  >
                    {showTotalUsers ? showTotalUsers : 0}
                  </Button>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "5px 0 0 0",
                      fontWeight: "600",
                    }}
                  >
                    TOTAL
                  </p>
                </div>
                <div style={{ margin: "0 12px", textAlign: "center" }}>
                  <Button
                    style={{
                      backgroundColor: "rgb(40, 167, 69)",
                      fontSize: "16px",
                      color: "white",
                      width: "60px",
                    }}
                  >
                    {showTotalUnblockUsers ? showTotalUnblockUsers : 0}
                  </Button>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "5px 0 0 0",
                      fontWeight: "600",
                    }}
                  >
                    UNBLOCK
                  </p>
                </div>
                <div style={{ margin: "0 12px", textAlign: "center" }}>
                  <Button
                    style={{
                      backgroundColor: "rgb(255, 77, 79)",
                      fontSize: "16px",
                      color: "white",
                      width: "60px",
                    }}
                  >
                    {showTotalBlockUsers ? showTotalBlockUsers : 0}
                  </Button>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "5px 0 0 0",
                      fontWeight: "600",
                    }}
                  >
                    BLOCK
                  </p>
                </div>

                <div style={{ margin: "0 12px", textAlign: "center" }}>
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

              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={
                    data.users.users ||
                    data.users.retailers ||
                    data.users.wholesalers
                  }
                  className="ant-border-space"
                  pagination={{
                    position: ["bottomCenter"],
                    current: productPage !== undefined ? productPage : 1,
                    pageSize: 10,
                    total:
                      data?.users.usersCount ||
                      data?.users.retailersCount ||
                      data?.users.wholesalersCount,
                    onChange: (page, pageSize) =>
                      handlePagination(page, pageSize),
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      {/* send notification to specific types of users */}
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
        onOk={handleSendMessage}
        onCancel={handleMessageClose}
      >
        <Row gutter={[24, 0]}>
          <Col md={12}>
            <label style={{ margin: "10px 0" }}>Role</label>
            <Select
              value={selectUserRole}
              size="large"
              defaultValue="Select"
              onSelect={(value, event) => handleChangeUserRole(value, event)}
              style={{ width: "100%" }}
            >
              {optmsg.map((v, i) => (
                <Option key={i} value={v.option}></Option>
              ))}
            </Select>
            {userRoleError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                Role field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
          <Col md={12}>
            <label style={{ margin: "10px 0" }}>Title</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
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
          </Col>
        </Row>
        <Row>
          <Col md={24}>
            <label style={{ margin: "10px 0" }}>Message</label>
            <TextArea
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {messageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                Message field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Modal>
      {/* send notification by id */}
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
        open={previewOpenMessage2}
        onOk={handleSendMessageById}
        onCancel={handleMessageClose2}
      >
        <label style={{ margin: "10px 0" }}>Title</label>
        <Input
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessageById();
            }
          }}
          style={{ width: "100%" }}
          type="text"
          value={titleMessage2}
          onChange={(e) => setTitleMessage2(e.target.value)}
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
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessageById();
                }
              }}
              value={message2}
              onChange={(e) => setMessage2(e.target.value)}
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
    </>
  );
};

export default RegisteredAcount;
