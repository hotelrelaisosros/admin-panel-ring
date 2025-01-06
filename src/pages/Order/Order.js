import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeTwoTone,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Card, Col, Input, Modal, Row, Select, Table, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthMiddleware } from "../../store/auth/authMiddleware";
import { setLoading } from "../../store/common/commonSlice";

const Order = () => {
  const { Search } = Input;
  let history = useHistory();
  const [productPage, setProductPage] = useState(1);
  const [selectSec, setSelectSec] = useState("Pending");
  const [selectRole, setSelectRole] = useState("All");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const orders = useSelector((state) => state.auth.orders);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewOpenApproveOrder, setPreviewOpenApproveOrder] = useState(false);
  const [previewOpenDeclineOrder, setPreviewOpenDeclineOrder] = useState(false);
  const [orderId, setOrderId] = useState();
  const [rejectMessage, setRejectMessage] = useState("");
  const [error, setError] = useState();
  
  const { Option } = Select;
  const opt = [
    { option: "Pending" },
    { option: "Delivered" },
    { option: "InProcess" },
    { option: "Rejected" },
  ];
  const opt2 = [{ option: "All" }, { option: "User" }, { option: "Retailer" }];

  let token = localStorage.getItem("token");

  useEffect(() => {
    const formData = new FormData();
    if (selectRole.toLowerCase() === "all") {
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("status", selectSec);
      formData.append("search", search);
      dispatch(AuthMiddleware.GetOrder(formData, token));
    } else {
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("status", selectSec);
      formData.append("role", selectRole.toLowerCase());
      formData.append("search", search);
      dispatch(AuthMiddleware.GetOrder(formData, token));
    }
  }, [dispatch, selectSec, search, selectRole, token]);

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    setProductPage(page);
    const formData = new FormData();
    if (selectRole.toLowerCase() === "all") {
      formData.append("skip", pageSize * (page - 1));
      formData.append("take", pageSize);
      formData.append("status", selectSec);
      formData.append("search", search);
      dispatch(AuthMiddleware.GetOrder(formData, token));
    } else {
      formData.append("skip", pageSize * (page - 1));
      formData.append("take", pageSize);
      formData.append("status", selectSec);
      formData.append("role", selectRole.toLowerCase());
      formData.append("search", search);
      dispatch(AuthMiddleware.GetOrder(formData, token));
    }
  }

  useEffect(() => {
    const formData = new FormData();
    if (selectRole.toLowerCase() === "all") {
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("status", selectSec);
      formData.append("search", search);
      dispatch(AuthMiddleware.GetOrderByRole(formData, token));
    } else {
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("status", selectSec);
      formData.append("role", selectRole.toLowerCase());
      formData.append("search", search);
      dispatch(AuthMiddleware.GetOrderByRole(formData, token));
    }
  }, [dispatch, selectRole, selectSec, search, token]);

  const handleSearch = () => {
    const formData = new FormData();
    if (selectRole.toLowerCase() === "all") {
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("status", selectSec);
      formData.append("search", search);
      dispatch(AuthMiddleware.GetOrderByRole(formData, token))
        .then((res) => {
          toast.success(res?.data.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ORDER FOUND ERROR", res);
        })
        .catch((err) => {
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ORDER FOUND ERROR", err);
        });
    } else {
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("status", selectSec);
      formData.append("role", selectRole.toLowerCase());
      formData.append("search", search);
      dispatch(AuthMiddleware.GetOrderByRole(formData, token))
        .then((res) => {
          toast.success(res?.data.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ORDER FOUND ERROR", res);
        })
        .catch((err) => {
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ORDER FOUND ERROR", err);
        });
    }
  };

  const handleOpenApproveOrder = (rowData) => {
    setPreviewOpenApproveOrder(true);
    setOrderId(rowData.id);
  };
  const handleApproveOrder = () => {
    setPreviewOpenApproveOrder(false);
    dispatch(setLoading(true));
    const formData = new FormData();
    if (selectSec === "InProcess") {
      formData.append("id", orderId);
      formData.append("status", "delivered");
      dispatch(AuthMiddleware.ChangeOrderStatus(formData, token))
        .then((res) => {
          dispatch(setLoading(false));
          const formData = new FormData();
          formData.append("skip", 0);
          formData.append("take", 10);
          formData.append("status", selectSec);
          {
            selectRole.toLowerCase() === "all"
              ? formData.append("role", "")
              : formData.append("role", selectRole.toLowerCase());
          }
          formData.append("search", "");
          dispatch(AuthMiddleware.GetOrder(formData, token));
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectSec === "Pending") {
      formData.append("id", orderId);
      formData.append("status", "inprocess");
      dispatch(AuthMiddleware.ChangeOrderStatus(formData, token))
        .then((res) => {
          dispatch(setLoading(false));
          const formData = new FormData();
          formData.append("skip", 0);
          formData.append("take", 10);
          formData.append("status", selectSec);
          {
            selectRole.toLowerCase() === "all"
              ? formData.append("role", "")
              : formData.append("role", selectRole.toLowerCase());
          }
          formData.append("search", "");
          dispatch(AuthMiddleware.GetOrder(formData, token)).then((res) => {
            console.log(res);
          });
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleOpenDeclineOrder = (rowData) => {
    setPreviewOpenDeclineOrder(true);
    setOrderId(rowData.id);
  };
  const handleDeclineOrder = () => {
    const formData = new FormData();
    formData.append("id", orderId);
    formData.append("status", "rejected");
    formData.append("message", rejectMessage);
    if (!rejectMessage) {
      setPreviewOpenDeclineOrder(true);
      dispatch(setLoading(false));
      toast.error("Please fill this field!", {
        position: "bottom-left",
        autoClose: 2000,
      });
      setError(true);
    }
    if (rejectMessage) {
      setPreviewOpenDeclineOrder(false);
      dispatch(setLoading(true));
      dispatch(AuthMiddleware.ChangeOrderStatus(formData, token)).then(
        (res) => {
          dispatch(setLoading(false));
          const formData = new FormData();
          formData.append("skip", 0);
          formData.append("take", 10);
          formData.append("status", selectSec);
          {
            selectRole.toLowerCase() === "all"
              ? formData.append("role", "")
              : formData.append("role", selectRole.toLowerCase());
          }
          formData.append("search", "");
          dispatch(AuthMiddleware.GetOrder(formData, token)).then((res) => {
            console.log(res);
          });
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
        }
      );
    }
  };

  const handleCancel = () => setPreviewOpen(false);

  // status
  const handleViewOrder = (rowData) => {
    history.push({
      pathname: `/orderProfile/${rowData.id}`,
      state: rowData,  // Pass order data to the OrderProfile page
    });
  };
  

  const columns = [
    {
      title: <p>CUSTOMER NAME</p>,

      render: (rowData) => (
        <a
          onClick={() => handleViewOrder(rowData)}
          style={{ color: "#1890ff", cursor: "pointer" }}
        >
          <h5>{rowData.customer_name}</h5>
          <p>{rowData.email}</p>
        </a>
      ),
     
    },
    {
      title: <p>ROLE</p>,
      
    },
    {
      title: <p>PHONE</p>,
      dataIndex: "phone",
      key: "phone",
    },
    
    {
      title: <p>STATUS</p>,
      dataIndex: "status",
      key: "status",
      render: (rowData) => {
        return (
          (rowData === "pending" && (
            <div style={{ backgroundColor: "#ECA52B", borderRadius: "4px" }}>
              <p style={{ color: "white", padding: "5px 10px" }}>Pending</p>
            </div>
          )) ||
          (rowData === "delivered" && (
            <div style={{ backgroundColor: "#28A745", borderRadius: "4px" }}>
              {" "}
              <p style={{ color: "white", padding: "5px 10px" }}>Delivered</p>
            </div>
          )) ||
          (rowData === "rejected" && (
            <div style={{ backgroundColor: "#FF4D4F", borderRadius: "4px" }}>
              <p style={{ color: "white", padding: "5px 10px" }}>Rejected</p>
            </div>
          ))
        );
      },
    },
    {
      title: <p align="center">ACTION</p>,
      render: (rowData) => (
        <div className="ant-employed">
          <Tooltip title="view">
            <EyeTwoTone
              style={{ fontSize: "20px" }}
              onClick={() => {
                history.push({
                  pathname: `/orderProfile/${rowData.id}`,
                  state: rowData,
                });
              }}
            />
          </Tooltip>
          {rowData.status === "delivered" || rowData.status === "rejected" ? (
            ""
          ) : (
            <>
              <Tooltip title="ACCEPT">
                <button
                  onClick={() => handleOpenApproveOrder(rowData)}
                  style={{ fontSize: "14px", marginLeft: "4px" }}
                  className="btn"
                >
                  <CheckCircleOutlined
                    className="text-success"
                    style={{ fontSize: "20px" }}
                  />
                </button>
              </Tooltip>
              <Tooltip title="REJECT">
                <button
                  onClick={() => handleOpenDeclineOrder(rowData)}
                  style={{ fontSize: "14px", marginLeft: "4px" }}
                  className="btn"
                >
                  <CloseCircleOutlined
                    className="text-danger"
                    style={{ fontSize: "20px" }}
                  />
                </button>
              </Tooltip>

              
            </>
          )}
        </div>
      ),
    },
  ];

  const handleChangeTable = (value) => {
    setSelectSec(value);
  };

  const handleChangeRole = (value) => {
    setSelectRole(value);
  };

  return (
    <>
      {load ? <Loader fullPage loading /> : null}
      {networkError === true
        ? toast.error("No internet connection please check your connection!", {
            position: "bottom-left",
            autoClose: 2000,
          })
        : ""}
      <ToastContainer />
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col md={24} xs="24" xl={24}>
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
                    ORDERS
                  </p>
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Role
                  </label>
                  <div>
                    <Select
                      size="medium"
                      defaultValue="User"
                      style={{ width: "170px" }}
                      onSelect={(value, event) =>
                        handleChangeRole(value, event)
                      }
                    >
                      {opt2.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div>

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
                      defaultValue="Pending"
                      style={{ width: "170px" }}
                      onSelect={(value, event) =>
                        handleChangeTable(value, event)
                      }
                    >
                      {opt.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Search
                      value={search}
                      placeholder="Search order"
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
              {/* {selectSec === "Pending" ? ( */}
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={orders?.Orders}
                     
                  className="ant-border-space"
                  pagination={{
                    position: ["bottomCenter"],
                    current: productPage !== undefined ? productPage : 1,
                    pageSize: 10,
                    total: orders?.OrdersCount,
                    onChange: (page, pageSize) =>
                      handlePagination(page, pageSize),
                  }}
                />
              </div>
            </Card>
          </Col>
          <Modal
            title={<h4 className="text-white text-center">Order Details</h4>}
            open={previewOpen}
            footer={null}
            onCancel={handleCancel}
          >
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
                    ORDER
                  </p>
                </span>
              }
            ></Card>
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
                ACCEPT ORDER
              </h5>
            }
            open={previewOpenApproveOrder}
            onOk={handleApproveOrder}
            okText="Accept"
            onCancel={() => setPreviewOpenApproveOrder(false)}
            okButtonProps={{ color: "red" }}
          >
            <h6>Are you sure want to accept order!</h6>
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
                REJECT ORDER
              </h5>
            }
            open={previewOpenDeclineOrder}
            onOk={handleDeclineOrder}
            okText="Reject"
            onCancel={() => setPreviewOpenDeclineOrder(false)}
            okButtonProps={{ color: "red" }}
          >
            <h6>Are you sure want to reject order!</h6>
            <label style={{ margin: "20px 0 10px 0" }}>Message</label>
            <TextArea
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleDeclineOrder();
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
          {/* <Modal
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
                REFUND
              </h5>
            }
            open={previewOpenApproveOrderStatus}
            onOk={handleApproveOrderStatus}
            okText="Yes"
            cancelText="No"
            onCancel={() => setPreviewOpenApproveOrderStatus(false)}
            okButtonProps={{ color: "blue" }}
            cancelButtonProps={{ color: "red" }}
          >
            <h6>Are you sure want to Check Status!</h6>
          </Modal> */}
        </Row>
        {/* <form action={Url} method="post">
          {ErrList.map((e, i) => (
            <input type="hidden" key={i} name={e} value={CheckoutData[e]} />
          ))}
          <button id="submitJazzCashForm" hidden>
            submit form
          </button>
        </form> */}
      </div>
    </>
  );
};

export default Order;
