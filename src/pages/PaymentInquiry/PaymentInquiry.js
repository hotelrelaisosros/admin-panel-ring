import {
  CreditCardOutlined,
  EyeTwoTone,
  FileSearchOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Select,
  Table,
  Tooltip,
  Typography,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { paymentInquiryMiddleware } from "../../store/paymentInquiry/paymentInquiryMiddleware";
import { setLoading } from "../../store/common/commonSlice";

const PaymentInquiry = () => {
  const [productPage, setProductPage] = useState(1);
  //   const [search, setSearch] = useState("");
  const [selectData, setSelectData] = useState({
    paymentmethod: "JazzCash",
    inquiry: "Orders",
    // role: "",
  });
  //   const [viewModal, setViewModal] = useState("");

  const dispatch = useDispatch();
  const data = useSelector((state) => state.paymentInquiry);
  console.log("data=>", data);
  const load = useSelector((state) => state.common.loading);

  // refund preview
  const [
    previewOpenApproveOrderRefundCard,
    setPreviewOpenApproveOrderRefundCard,
  ] = useState(false);
  const [
    previewOpenApproveOrderRefundMobile,
    setPreviewOpenApproveOrderRefundMobile,
  ] = useState(false);
  const [refundIdMobile, setRefundIdMobile] = useState({});
  const [refundIdCard, setRefundIdCard] = useState({});
  // refund preview
  // refund response
  const [Url, setUrl] = useState("");
  const [ErrList, setErrList] = useState([]);
  const [CheckoutData, setCheckoutData] = useState([]);
  // refund response
  const [previewOpenApproveOrderStatus, setPreviewOpenApproveOrderStatus] =
    useState(false);
  const [statusinquiry, setStatusinquiry] = useState({});

  //   const networkError = useSelector((state) => state.common.networkError);
  //   const [previewOpendoc, setPreviewOpendoc] = useState(false);
  const { Option } = Select;
  const { Title } = Typography;
  //   const { Search } = Input;
  const opt = [{ option: "EasyPaisa" }, { option: "JazzCash" }];
  const optsec = [{ option: "Orders" }, { option: "Users" }];
  // const optrole = [
  //   { option: "All" },
  //   { option: "User" },
  //   { option: "Retailer" },
  //   { option: "WholeSeller" },
  // ];
  //token
  let token = localStorage.getItem("token");

  useEffect(() => {
    const formData = new FormData();
    console.log("method=>", selectData.paymentmethod.toLowerCase());
    console.log("methodinquiry=>", selectData.inquiry.toLowerCase());
    formData.append("skip", 0);
    formData.append("take", 10);
    // formData.append("search", "");
    formData.append("method", selectData.paymentmethod.toLowerCase());
    formData.append("section", selectData.inquiry.toLowerCase());
    dispatch(paymentInquiryMiddleware.GetInquiryData(formData, token)).then(
      (res) => {
        console.log("res", res.data.Orders);
      }
    );
  }, [selectData.paymentmethod, selectData.inquiry, selectData.role]);

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    setProductPage(page);
    const formData = new FormData();
    console.log("method=>", selectData.paymentmethod.toLowerCase());
    console.log("methodinquiry=>", selectData.inquiry.toLowerCase());
    formData.append("skip", 0);
    formData.append("take", 10);
    // formData.append("search", "");
    formData.append("method", selectData.paymentmethod.toLowerCase());
    formData.append("section", selectData.inquiry.toLowerCase());
    dispatch(paymentInquiryMiddleware.GetInquiryData(formData, token)).then(
      (res) => {
        console.log("res", res.data.Orders);
      }
    );
  }

  function handleSearch() {
    const formData = new FormData();
    console.log("method=>", selectData.paymentmethod.toLowerCase());
    console.log("methodinquiry=>", selectData.inquiry.toLowerCase());
    console.log("role=>", selectData.role.toLowerCase());
    formData.append("skip", 0);
    formData.append("take", 10);
    // formData.append("search", "");
    formData.append("method", selectData.paymentmethod.toLowerCase());
    formData.append("section", selectData.inquiry.toLowerCase());

    dispatch(paymentInquiryMiddleware.GetInquiryData(formData, token))
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
  }
  //   function viewdocfunc(rowData) {
  //     console.log("rowData=>>>", rowData);
  //     setViewModal(rowData);
  //     setPreviewOpendoc(true);
  //   }
  //   const handleClose = () => {
  //     setPreviewOpendoc(false);
  //   };

  // card
  const handleOpenApproveOrderRefundCard = (rowData) => {
    setPreviewOpenApproveOrderRefundCard(true);
    if (selectData.inquiry.toLowerCase() === "users") {
      setRefundIdCard({ txt_refno: rowData.txt_refno, price: rowData.price });
    } else {
      rowData.payment.map((id) => {
        console.log("rowData==>>sss", id.payments);
        setRefundIdCard(id.payments);
      });
    }
  };

  const handleApproveOrderRefundCard = () => {
    setPreviewOpenApproveOrderRefundCard(false);
    dispatch(setLoading(true));
    console.log("refundIdCard=>", refundIdCard.total);
    console.log("txt_refno=>", refundIdCard.txt_refno);
    const formData = new FormData();
    // formData.append("price", "2600");
    if (selectData.inquiry.toLowerCase() === "users") {
      formData.append("price", refundIdCard.price);
    } else {
      formData.append("price", refundIdCard.total);
    }
    formData.append("pp_TxnRefNo", refundIdCard.txt_refno);
    dispatch(paymentInquiryMiddleware.RefundCard(formData, token))
      .then((res) => {
        console.log("setUrl", res.data.url);
        console.log("setErrList", Object.keys(res.data.data));
        console.log("setCheckoutData", res.data.data);
        setUrl(res.data.url);
        setErrList(Object.keys(res.data.data));
        setCheckoutData(res.data.data);
        const jazzCashbutton = document.getElementById("submitJazzCashForm");
        setTimeout(() => {
          jazzCashbutton.click();
        }, 1000);
        // dispatch(paymentInquiryMiddleware.GetRefundUser(token));
        // toast.success(res.data?.Message, {
        //   position: "bottom-left",
        //   autoClose: 2000,
        // });
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
      });
  };
  // card

  // mobile
  const handleOpenApproveOrderRefundMobile = (rowData) => {
    setPreviewOpenApproveOrderRefundMobile(true);
    if (selectData.inquiry.toLowerCase() === "users") {
      setRefundIdMobile({ txt_refno: rowData.txt_refno, price: rowData.price });
    } else {
      rowData.payment.map((id) => {
        console.log("rowData==>>sss", id.payments);
        setRefundIdMobile(id.payments);
      });
    }
  };

  const handleApproveOrderRefundMobile = () => {
    setPreviewOpenApproveOrderRefundMobile(false);
    dispatch(setLoading(true));
    console.log("refundIdMobile=>", refundIdMobile);
    console.log("Mobiletxt_refno=>", refundIdMobile.txt_refno);
    const formData = new FormData();
    if (selectData.inquiry.toLowerCase() === "users") {
      formData.append("price", refundIdMobile.price);
    } else {
      formData.append("price", refundIdMobile.total);
    }
    formData.append("pp_TxnRefNo", refundIdMobile.txt_refno);
    formData.append("mpin", "1111");
    // formData.append("pp_TxnRefNo", "T20221219145749");
    // formData.append("price", "500");
    dispatch(paymentInquiryMiddleware.RefundMobile(formData, token))
      .then((res) => {
        setUrl(res.data.url);
        setErrList(Object.keys(res.data.data));
        setCheckoutData(res.data.data);
        const jazzCashbutton = document.getElementById("submitJazzCashForm");
        setTimeout(() => {
          jazzCashbutton.click();
        }, 1000);
        // dispatch(paymentInquiryMiddleware.GetRefundUser(token));
        // toast.success(res.data?.Message, {
        //   position: "bottom-left",
        //   autoClose: 2000,
        // });
        console.log("res", res);
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //mobile

  //status

  const handleOpenDeclineOrderStatusInquiry = (rowData) => {
    setPreviewOpenApproveOrderStatus(true);
    console.log("rowDataStatus--->", rowData);
    if (selectData.inquiry.toLowerCase() === "users") {
      setStatusinquiry({ txt_refno: rowData.txt_refno, price: rowData.price });
    } else {
      rowData.payment.map((id) => {
        console.log("rowData==>>sss", id.payments);
        setStatusinquiry(id.payments);
      });
    }
  };

  const handleApproveOrderStatus = () => {
    setPreviewOpenApproveOrderStatus(false);
    dispatch(setLoading(true));
    console.log("[statusinquiryprice]=>", statusinquiry.price);
    console.log("statusinquiry=>", statusinquiry.total);
    console.log("txt_refno=>", statusinquiry.txt_refno);
    const formData = new FormData();
    // formData.append("price", '2600');
    if (selectData.inquiry.toLowerCase() === "users") {
      formData.append("price", statusinquiry.price);
    } else {
      formData.append("price", statusinquiry.total);
    }
    formData.append("pp_TxnRefNo", statusinquiry.txt_refno);
    dispatch(paymentInquiryMiddleware.StatusInquiry(formData, token))
      .then((res) => {
        console.log("setUrl", res.data.url);
        console.log("setErrList", Object.keys(res.data.data));
        console.log("setCheckoutData", res.data.data);
        setUrl(res.data.url);
        setErrList(Object.keys(res.data.data));
        setCheckoutData(res.data.data);
        const jazzCashbutton = document.getElementById("submitJazzCashForm");
        setTimeout(() => {
          jazzCashbutton.click();
        }, 1000);
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
      });
  };

  //status

  const columns = [
    {
      title: <p>USERS</p>,
      render: (rowData) => {
        return (
          <>
            {selectData.inquiry.toLowerCase() === "users" ? (
              (console.log("selectData =>", selectData),
              (
                <>
                  <Title level={5}>{rowData.username}</Title>
                  <p>{rowData.email}</p>
                </>
              ))
            ) : (
              <>
                <Title level={5}>{rowData?.customer_name}</Title>
                <p>{rowData?.email}</p>
              </>
            )}
          </>
        );
      },
    },
    {
      title: <p>ROLE</p>,
      render: (rowData) => {
        return (
          <>
            {selectData.inquiry.toLowerCase() === "users" ? (
              <p>{rowData?.role?.name}</p>
            ) : (
              <>
                <p>{rowData?.seller?.role.name}</p>
              </>
            )}
          </>
        );
      },
    },
    {
      title: <p>PHONE NUMBER</p>,
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: <p>PAYMENT METHOD</p>,
      render: (rowData) => {
        return (
          <>
            {selectData.inquiry.toLowerCase() === "users" ? (
              (console.log("selectData =>", selectData),
              (
                <>
                  <p>{rowData?.payment_method}</p>
                </>
              ))
            ) : (
              <>
                {rowData?.payment?.map((pay) => {
                  return <p>{pay?.payments.payment_method}</p>;
                })}
              </>
            )}
          </>
        );
      },
    },
    {
      title: <p>TRANSECTION CODE</p>,
      render: (rowData) => {
        return (
          <>
            {selectData.inquiry.toLowerCase() === "users" ? (
              (console.log("selectData =>", selectData),
              (
                <>
                  <Title level={5}>Status Code: {rowData?.response_code}</Title>
                  <p>txt_refno:{rowData?.txt_refno}</p>
                  <p>Message:{rowData?.response_message}</p>
                </>
              ))
            ) : (
              <>
                {rowData?.payment?.map((pay) => {
                  console.log("pay>", pay);
                  return (
                    <>
                      <Title level={5}>
                        Status Code: {pay?.payments?.response_code}
                      </Title>
                      <p>txt_refno:{pay?.payments?.txt_refno}</p>
                      <p>Message:{pay?.payments?.response_message}</p>
                    </>
                  );
                })}
              </>
            )}
          </>
        );
      },
    },
    // {
    //   title: <p>RESPONSE MESSAGE</p>,
    //   render: (rowData) => {
    //     return (
    //       <>
    //         <p>{rowData.user.response_code}</p>
    //         <p>{rowData.user.response_message}</p>
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: <p>STATUS</p>,
    //   render: (rowData) => {
    //     return <p>{rowData.status}</p>;
    //   },
    // },
    // {
    //   title: <p>BUSINESS NAME</p>,
    //   dataIndex: "business_name",
    //   key: "business_name",
    // },
    // {
    //   title: <p>BUSINESS ADDRESS</p>,
    //   dataIndex: "business_address",
    //   key: "business_address",
    // },
    {
      title: <p>ACTION</p>,
      render: (rowData) => {
        return (
          <div className="ant-employed">
            {/* <Tooltip title="view">
              <a
              // onClick={() => {
              //   viewdocfunc(rowData);
              // }}
              >
                <EyeTwoTone style={{ fontSize: "20px" }} />
              </a>
            </Tooltip> */}
            <Tooltip title="CARD">
              <button
                onClick={() => handleOpenApproveOrderRefundCard(rowData)}
                style={{ fontSize: "14px", marginLeft: "4px" }}
                className="btn text-success"
              >
                <CreditCardOutlined
                  className="text-success"
                  style={{ fontSize: "20px" }}
                />
              </button>
            </Tooltip>
            <Tooltip title="MOBILE">
              <button
                onClick={() => handleOpenApproveOrderRefundMobile(rowData)}
                style={{ fontSize: "14px", marginLeft: "4px" }}
                className="btn text-success"
              >
                <MobileOutlined
                  className="text-success"
                  style={{ fontSize: "20px" }}
                />
              </button>
            </Tooltip>
            <Tooltip title="STATUS">
              <button
                onClick={() => handleOpenDeclineOrderStatusInquiry(rowData)}
                style={{ fontSize: "14px", marginLeft: "4px" }}
                className="btn"
              >
                <FileSearchOutlined
                  className="text-warning"
                  style={{ fontSize: "20px" }}
                />
              </button>
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
                      textAlign: "center",
                      fontSize: "24px",
                      color: "black",
                    }}
                  >
                    PAYMENT INQUIRY
                  </p>

                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "0 -50px 0 0",
                    }}
                  >
                    Method
                  </label>
                  <div>
                    <Select
                      name="paymentmethod"
                      size="medium"
                      defaultValue="JazzCash"
                      style={{ width: "150px" }}
                      onSelect={(value, event) =>
                        setSelectData({
                          ...selectData,
                          paymentmethod: value,
                        })
                      }
                    >
                      {opt.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div>
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "0 -50px 0 0",
                    }}
                  >
                    Section
                  </label>
                  <div>
                    <Select
                      name="inquiry"
                      size="medium"
                      defaultValue="Orders"
                      style={{ width: "150px" }}
                      onSelect={(value, event) =>
                        setSelectData({
                          ...selectData,
                          inquiry: value,
                        })
                      }
                    >
                      {optsec.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div>
                  {/* <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: "0 -50px 0 0",
                    }}
                  >
                    Role
                  </label>
                  <div>
                    <Select
                      name="role"
                      size="medium"
                      defaultValue="Select Role"
                      style={{ width: "150px" }}
                      onSelect={(value, event) =>
                        setSelectData({
                          ...selectData,
                          role: value,
                        })
                      }
                    >
                      {optrole.map((v, i) => (
                        <Option key={i} value={v.option}></Option>
                      ))}
                    </Select>
                  </div> */}
                  {/* <div>
                    <Search
                      value={search}
                      placeholder="Search document"
                      enterButton
                      onSearch={handleSearch}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </div> */}
                </div>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={
                    data?.paymentInquiry?.Orders || data?.paymentInquiry?.Users
                  }
                  className="ant-border-space"
                  pagination={{
                    position: ["bottomCenter"],
                    current: productPage !== undefined ? productPage : 1,
                    pageSize: 10,
                    total:
                      data?.paymentInquiry.retailersCount ||
                      data?.paymentInquiry.wholesalersCount,
                    onChange: (page, pageSize) =>
                      handlePagination(page, pageSize),
                  }}
                />
              </div>
            </Card>
          </Col>
        </Row>
        {/* <Modal
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
              DOCUMENTS
            </h5>
          }
          open={previewOpendoc}
          onOk={handleClose}
          onCancel={handleClose}
        >
          <Carousel>
            {viewModal.cnic_image?.map((img) => {
              console.log("img->", img.cnic_image);
              return (
                <>
                  <img
                    src={`${IMG_URL}/${img.cnic_image}`}
                    alt="img"
                    style={{
                      width: "200%",
                      height: "350px",
                      objectFit: "cover",
                    }}
                  />
                </>
              );
            })}
            <img
              src={`${IMG_URL}/${viewModal.bill_image}`}
              alt="img"
              style={{
                width: "200%",
                height: "350px",
                objectFit: "cover",
              }}
            />
          </Carousel>
        </Modal> */}
      </div>

      {/* Refund card */}

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
            REFUND
          </h5>
        }
        open={previewOpenApproveOrderRefundCard}
        onOk={handleApproveOrderRefundCard}
        okText="Yes"
        cancelText="No"
        onCancel={() => setPreviewOpenApproveOrderRefundCard(false)}
        okButtonProps={{ color: "blue" }}
        cancelButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to Refund from Card!</h6>
      </Modal>

      {/* Refund card */}

      {/* Refund mobile*/}

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
            REFUND
          </h5>
        }
        open={previewOpenApproveOrderRefundMobile}
        onOk={handleApproveOrderRefundMobile}
        okText="Yes"
        cancelText="No"
        onCancel={() => setPreviewOpenApproveOrderRefundMobile(false)}
        okButtonProps={{ color: "blue" }}
        cancelButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to Refund from Mobile Account!</h6>
      </Modal>

      {/* Refund  mobile*/}

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
            STATUS INQUIRY
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
      </Modal>

      {/* Refund sbumit form  */}

      <form action={Url} method="post">
        {ErrList.map((e, i) => (
          <input type="hidden" key={i} name={e} value={CheckoutData[e]} />
        ))}
        <button id="submitJazzCashForm" hidden>
          submit form
        </button>
      </form>

      {/* Refund sbumit form  */}
    </>
  );
};

export default PaymentInquiry;
