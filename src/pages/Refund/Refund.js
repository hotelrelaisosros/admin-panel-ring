import { CreditCardOutlined, MobileOutlined } from "@ant-design/icons";
import { button, Card, Col, Modal, Row, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../../store/common/commonSlice";
import { RefundMiddleware } from "../../store/refund/refundMiddleware";

const Refund = () => {
  const dispatch = useDispatch();
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const data = useSelector((state) => state.refund.refund.orderRefund);
  // console.log("data=>", data);
  // console.log("networkError =>", networkError);
  // refund preview
  const [
    previewOpenApproveOrderRefundCard,
    setPreviewOpenApproveOrderRefundCard,
  ] = useState(false);
  const [
    previewOpenApproveOrderRefundMobile,
    setPreviewOpenApproveOrderRefundMobile,
  ] = useState(false);
  const [refundIdMobile, setRefundIdMobile] = useState();
  const [refundIdCard, setRefundIdCard] = useState();
  // refund preview
  // refund response
  const [Url, setUrl] = useState("");
  const [ErrList, setErrList] = useState([]);
  const [CheckoutData, setCheckoutData] = useState([]);
  // refund response

  // const [deleteDataById, setDeleteDataById] = useState();
  // const [previewOpenAddPerson, setPreviewOpenAddPerson] = useState(false);
  // const [nameAddPerson, setNameAddPerson] = useState("");
  // const [emailAddPerson, setEmailAddPerson] = useState("");
  // const [numberAddPerson, setNumberAddPerson] = useState("");
  // const [cnicAddPerson, setCnicAddPerson] = useState("");
  // const [referredAddPerson, setReferredAddPerson] = useState("");
  // const [nameMessageError, setNameMessageError] = useState(false);
  // const [emailMessageError, setEmailMessageError] = useState(false);
  // const [numberMessageError, setNumberMessageError] = useState(false);
  // const [cnicMessageError, setCnicMessageError] = useState(false);
  // const [error, setError] = useState([]);
  // const [referralData, setReferralData] = useState([]);
  // const [referralId, setReferralId] = useState("");
  // const [previewReferralDetail, setPreviewReferralDetail] = useState(false);
  // const [previewOpenUpdatePerson, setPreviewOpenUpdatePerson] = useState(false);
  // const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  // //Modal State End
  // const [refferedMessageError, setRefferedMessageError] = useState(false);

  let token = localStorage.getItem("token");
  useEffect(() => {
    if (networkError) {
      toast.error("Network Error", {
        position: "bottom-left",
        autoClose: 1000,
      });
    }
    dispatch(RefundMiddleware.GetRefundUser(token));
  }, [networkError]);

  // card
  const handleOpenApproveOrderRefundCard = (rowData) => {
    setPreviewOpenApproveOrderRefundCard(true);
    rowData.orders.user_payments.map((id) => {
      setRefundIdCard(id.payments);
    });
  };

  const handleApproveOrderRefundCard = () => {
    setPreviewOpenApproveOrderRefundCard(false);
    dispatch(setLoading(true));
    console.log("refundIdCard=>", refundIdCard.total);
    console.log("txt_refno=>", refundIdCard.txt_refno);
    const formData = new FormData();
    formData.append("price", refundIdCard.total);
    formData.append("pp_TxnRefNo", refundIdCard.txt_refno);
    dispatch(RefundMiddleware.RefundCard(formData, token))
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
        // dispatch(RefundMiddleware.GetRefundUser(token));
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
    rowData.orders.user_payments.map((id) => {
      setRefundIdMobile(id.payments);
      // console.log("refundIdMobile=>", id.payments);
    });
  };

  const handleApproveOrderRefundMobile = () => {
    setPreviewOpenApproveOrderRefundMobile(false);
    dispatch(setLoading(true));
    console.log("refundIdMobile=>", refundIdMobile.total);
    console.log("txt_refno=>", "");
    const formData = new FormData();
    // formData.append("pp_TxnRefNo", refundIdMobile.txt_refno);
    formData.append("pp_TxnRefNo", "T20221219145749");
    // formData.append("price", refundIdMobile.total);
    formData.append("price", "500");
    formData.append("mpin", "1111");
    // formData.append("price", "2400");
    // formData.append("pp_TxnRefNo", "T20221209205006");
    dispatch(RefundMiddleware.RefundMobile(formData, token))
      .then((res) => {
        setUrl(res.data.url);
        setErrList(Object.keys(res.data.data));
        setCheckoutData(res.data.data);
        const jazzCashbutton = document.getElementById("submitJazzCashForm");
        setTimeout(() => {
          jazzCashbutton.click();
        }, 1000);
        // dispatch(RefundMiddleware.GetRefundUser(token));
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

  // mobile

  // useEffect(() => {
  //   if (nameAddPerson === "") {
  //     setNameMessageError(true);
  //   } else if (nameAddPerson !== "") {
  //     setNameMessageError(false);
  //   }
  // }, [nameAddPerson]);

  // useEffect(() => {
  //   if (emailAddPerson === "") {
  //     setEmailMessageError(true);
  //   } else if (emailAddPerson !== "") {
  //     setEmailMessageError(false);
  //   }
  // }, [emailAddPerson]);

  // useEffect(() => {
  //   if (numberAddPerson === "") {
  //     setNumberMessageError(true);
  //   } else if (numberAddPerson !== "") {
  //     setNumberMessageError(false);
  //   }
  // }, [numberAddPerson]);

  // useEffect(() => {
  //   if (cnicAddPerson === "") {
  //     setCnicMessageError(true);
  //   } else if (cnicAddPerson !== "") {
  //     setCnicMessageError(false);
  //   }
  // }, [cnicAddPerson]);

  // const handleOpenaddperson = () => {
  //   setPreviewOpenAddPerson(true);
  //   setNameAddPerson("");
  //   setEmailAddPerson("");
  //   setNumberAddPerson("");
  //   setCnicAddPerson("");
  //   setNameMessageError(false);
  //   setEmailMessageError(false);
  //   setNumberMessageError(false);
  //   setCnicMessageError(false);
  // };

  // const viewReferral = (rowData) => {
  //   setPreviewReferralDetail(true);
  //   setReferralData(rowData);
  //   console.log("rowDatachjhkdasf=>", rowData);
  // };

  // const updateReferral = (rowData) => {
  //   setPreviewOpenUpdatePerson(true);
  //   setReferralId(rowData.id);
  //   setNameAddPerson(rowData.name);
  //   setEmailAddPerson(rowData.email);
  //   setCnicAddPerson(rowData.cnic);
  //   setNumberAddPerson(rowData.phone);
  //   setReferredAddPerson(rowData.referral_code);
  //   setNameMessageError(false);
  //   setEmailMessageError(false);
  //   setNumberMessageError(false);
  //   setCnicMessageError(false);
  //   setError([]);
  // };

  // const handleDeleteReferral = (rowData) => {
  //   setPreviewOpenDelete(true);
  //   setDeleteDataById(rowData);
  // };

  // const handleCloseAdd = () => {
  //   setPreviewOpenAddPerson(false);
  //   setNameAddPerson("");
  //   setEmailAddPerson("");
  //   setNumberAddPerson("");
  //   setCnicAddPerson("");
  //   setNameMessageError(false);
  //   setEmailMessageError(false);
  //   setNumberMessageError(false);
  //   setCnicMessageError(false);
  // };

  // const handleAddPerson = () => {
  //   const formData = new FormData();
  //   formData.append("name", nameAddPerson);
  //   formData.append("email", emailAddPerson);
  //   formData.append("phone", numberAddPerson);
  //   formData.append("cnic", cnicAddPerson);
  //   formData.append("cnic", referredAddPerson);

  //   if (nameAddPerson === "") {
  //     setNameMessageError(true);
  //   } else if (nameAddPerson !== "") {
  //     setNameMessageError(false);
  //   }
  //   if (emailAddPerson === "") {
  //     setEmailMessageError(true);
  //   } else if (emailAddPerson !== "") {
  //     setEmailMessageError(false);
  //   }
  //   if (numberAddPerson === "") {
  //     setNumberMessageError(true);
  //   } else if (numberAddPerson !== "") {
  //     setNumberMessageError(false);
  //   }
  //   if (cnicAddPerson === "") {
  //     setCnicMessageError(true);
  //   } else if (cnicAddPerson !== "") {
  //     setCnicMessageError(false);
  //   }
  //   if (referredAddPerson === "") {
  //     setRefferedMessageError(true);
  //   } else if (referredAddPerson !== "") {
  //     setRefferedMessageError(false);
  //   }
  //   if (nameAddPerson && emailAddPerson && numberAddPerson && cnicAddPerson) {
  //     setPreviewOpenAddPerson(false);
  //     dispatch(setLoading(true));
  //     dispatch(RefundMiddleware.AddRefundUser(formData, token))
  //       .then((res) => {
  //         setNameAddPerson("");
  //         setEmailAddPerson("");
  //         setNumberAddPerson("");
  //         setCnicAddPerson("");
  //         setReferredAddPerson("");
  //         setPreviewOpenAddPerson(false);
  //         dispatch(setLoading(false));
  //         dispatch(RefundMiddleware.GetRefundUser(token));
  //         toast.success(res?.data?.Message, {
  //           position: "bottom-left",
  //           autoClose: 2000,
  //         });
  //         console.log("SUCCESS ADDED REFUND =>", res);
  //       })
  //       .catch((err) => {
  //         setError(err?.data?.errors);
  //         dispatch(setLoading(false));
  //         dispatch(RefundMiddleware.GetRefundUser(token));
  //         toast.error(err?.data?.Message, {
  //           position: "bottom-left",
  //           autoClose: 2000,
  //         });
  //         console.log("ERROR ADDED REFUND =>", err);
  //       });
  //   }
  // };

  // const handleUpdatePerson = () => {
  //   setPreviewOpenUpdatePerson(false);
  //   dispatch(setLoading(true));
  //   const formData = new FormData();
  //   formData.append("referral_user_id", referralId);
  //   formData.append("name", nameAddPerson);
  //   formData.append("email", emailAddPerson);
  //   formData.append("phone", numberAddPerson);
  //   formData.append("cnic", cnicAddPerson);
  //   dispatch(RefundMiddleware.UpdateReferralUser(formData, token))
  //     .then((res) => {
  //       dispatch(setLoading(false));
  //       toast.success(res?.data?.Message, {
  //         position: "bottom-left",
  //         autoClose: 2000,
  //       });
  //       dispatch(RefundMiddleware.GetRefundUser(token));
  //       console.log("SUCCESS UPDATE REFUND =>", res);
  //     })
  //     .catch((err) => {
  //       dispatch(setLoading(false));
  //       toast.error(err?.data?.Message, {
  //         position: "bottom-left",
  //         autoClose: 2000,
  //       });
  //       dispatch(RefundMiddleware.GetRefundUser(token));
  //       console.log("ERROR UPDATE REFUND =>", err);
  //     });
  // };

  // const deleteReferralbyid = () => {
  //   setPreviewOpenDelete(false);
  //   dispatch(setLoading(true));
  //   dispatch(RefundMiddleware.DeleteReferral({ id: deleteDataById.id }, token))
  //     .then((res) => {
  //       dispatch(setLoading(false));
  //       dispatch(RefundMiddleware.GetRefundUser(token));
  //       toast.success(res?.data?.Message, {
  //         position: "bottom-left",
  //         autoClose: 2000,
  //       });
  //       console.log("SUCCESS ADDED REFUND =>", res);
  //     })
  //     .catch((err) => {
  //       dispatch(setLoading(false));
  //       dispatch(RefundMiddleware.GetRefundUser(token));
  //       toast.error(err?.data?.Message, {
  //         position: "bottom-left",
  //         autoClose: 2000,
  //       });
  //       console.log("ERROR ADDED REFUND =>", err);
  //     });
  // };

  const columns = [
    {
      title: <p>REFUND NAME</p>,
      render: (rowData) => {
        return (
          <>
            <p>{rowData?.orders.customer_name}</p>
            <p>{rowData?.orders.email}</p>
          </>
        );
      },
    },
    {
      title: <p>PHONE NUMBER</p>,
      render: (rowData) => {
        return <p>{rowData?.orders.phone}</p>;
      },
    },
    {
      title: <p>ORDER DETAILS</p>,
      render: (rowData) => {
        return (
          <>
            <p>{rowData?.orders.order_date}</p>
            <p>{rowData?.orders.order_number}</p>
          </>
        );
      },
    },
    {
      title: <p>REFUND PRICE</p>,
      render: (rowData) => {
        return rowData?.orders.user_payments.map((e) => {
          return <p>{e?.payments.total}</p>;
        });
      },
    },
    {
      title: <p>REFUND CODE</p>,
      render: (rowData) => {
        return rowData?.orders.user_payments.map((e) => {
          return <p>{e?.payments.txt_refno}</p>;
        });
      },
    },
    {
      title: <p>REFUND STATUS</p>,
      render: (rowData) => {
        return <p>{rowData.status}</p>;
      },
    },
    {
      title: <p className="fw-bold text-center">ACTION</p>,
      render: (rowData) => {
        return (
          <div align="center">
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
          </div>
        );
      },
    },
  ];

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
              title="REFUND"
              // extra={<button></button>}
            >
              <div className="tabled">
                <Row gutter={[24, 0]}>
                  <Col xs="24" xl={24}>
                    <div className="table-responsive">
                      <Table
                        className="ant-border-space"
                        columns={columns}
                        dataSource={data}
                        pagination={true}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
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

export default Refund;
