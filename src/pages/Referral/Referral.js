import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeTwoTone } from "@ant-design/icons";
import { Card, Col, Input, Modal, Row, Table, Tooltip } from "antd";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../../store/common/commonSlice";
import { ReferralMiddleware } from "../../store/referral/referralMiddleware";

const Referral = () => {
  const dispatch = useDispatch();
  const load = useSelector((state) => state.common.loading);
  const [deleteDataById, setDeleteDataById] = useState();
  const networkError = useSelector((state) => state.common.networkError);
  const data = useSelector((state) => state.referral.referrals.referral_users);
  console.log("data=>", data);
  console.log("networkError =>", networkError);

  const [previewOpenAddPerson, setPreviewOpenAddPerson] = useState(false);
  const [nameAddPerson, setNameAddPerson] = useState("");
  const [emailAddPerson, setEmailAddPerson] = useState("");
  const [numberAddPerson, setNumberAddPerson] = useState("");
  const [cnicAddPerson, setCnicAddPerson] = useState("");
  const [referredAddPerson, setReferredAddPerson] = useState("");
  const [nameMessageError, setNameMessageError] = useState(false);
  const [emailMessageError, setEmailMessageError] = useState(false);
  const [numberMessageError, setNumberMessageError] = useState(false);
  const [cnicMessageError, setCnicMessageError] = useState(false);
  const [error, setError] = useState([]);
  const [referralData, setReferralData] = useState([]);
  const [referralId, setReferralId] = useState("");
  const [previewReferralDetail, setPreviewReferralDetail] = useState(false);
  const [previewOpenUpdatePerson, setPreviewOpenUpdatePerson] = useState(false);
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  //Modal State End

  const [refferedMessageError, setRefferedMessageError] = useState(false);
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (nameAddPerson === "") {
      setNameMessageError(true);
    } else if (nameAddPerson !== "") {
      setNameMessageError(false);
    }
  }, [nameAddPerson]);

  useEffect(() => {
    if (emailAddPerson === "") {
      setEmailMessageError(true);
    } else if (emailAddPerson !== "") {
      setEmailMessageError(false);
    }
  }, [emailAddPerson]);

  useEffect(() => {
    if (numberAddPerson === "") {
      setNumberMessageError(true);
    } else if (numberAddPerson !== "") {
      setNumberMessageError(false);
    }
  }, [numberAddPerson]);

  useEffect(() => {
    if (cnicAddPerson === "") {
      setCnicMessageError(true);
    } else if (cnicAddPerson !== "") {
      setCnicMessageError(false);
    }
  }, [cnicAddPerson]);

  useEffect(() => {
    // const formData = new FormData();
    // formData.append("skip", 0);
    // formData.append("take", 10);
    dispatch(ReferralMiddleware.GetReferralUser(token));
  }, []);

  const handleOpenaddperson = () => {
    setPreviewOpenAddPerson(true);
    setNameAddPerson("");
    setEmailAddPerson("");
    setNumberAddPerson("");
    setCnicAddPerson("");
    setNameMessageError(false);
    setEmailMessageError(false);
    setNumberMessageError(false);
    setCnicMessageError(false);
  };

  const viewReferral = (rowData) => {
    setPreviewReferralDetail(true);
    setReferralData(rowData);
    console.log("rowDatachjhkdasf=>", rowData);
  };

  const updateReferral = (rowData) => {
    setPreviewOpenUpdatePerson(true);
    setReferralId(rowData.id);
    setNameAddPerson(rowData.name);
    setEmailAddPerson(rowData.email);
    setCnicAddPerson(rowData.cnic);
    setNumberAddPerson(rowData.phone);
    setReferredAddPerson(rowData.referral_code);
    setNameMessageError(false);
    setEmailMessageError(false);
    setNumberMessageError(false);
    setCnicMessageError(false);
    setError([]);
  };

  const handleDeleteReferral = (rowData) => {
    setPreviewOpenDelete(true);
    setDeleteDataById(rowData);
  };

  const handleCloseAdd = () => {
    setPreviewOpenAddPerson(false);
    setNameAddPerson("");
    setEmailAddPerson("");
    setNumberAddPerson("");
    setCnicAddPerson("");
    setNameMessageError(false);
    setEmailMessageError(false);
    setNumberMessageError(false);
    setCnicMessageError(false);
  };

  const handleAddPerson = () => {
    const formData = new FormData();
    formData.append("name", nameAddPerson);
    formData.append("email", emailAddPerson);
    formData.append("phone", numberAddPerson);
    formData.append("cnic", cnicAddPerson);
    formData.append("referral_code", referredAddPerson);

    if (nameAddPerson === "") {
      setNameMessageError(true);
    } else if (nameAddPerson !== "") {
      setNameMessageError(false);
    }
    if (emailAddPerson === "") {
      setEmailMessageError(true);
    } else if (emailAddPerson !== "") {
      setEmailMessageError(false);
    }
    if (numberAddPerson === "") {
      setNumberMessageError(true);
    } else if (numberAddPerson !== "") {
      setNumberMessageError(false);
    }
    if (cnicAddPerson === "") {
      setCnicMessageError(true);
    } else if (cnicAddPerson !== "") {
      setCnicMessageError(false);
    }
    if (referredAddPerson === "") {
      setRefferedMessageError(true);
    } else if (referredAddPerson !== "") {
      setRefferedMessageError(false);
    }
    if (
      nameAddPerson &&
      emailAddPerson &&
      numberAddPerson &&
      cnicAddPerson &&
      referredAddPerson
    ) {
      dispatch(setLoading(true));
      dispatch(ReferralMiddleware.AddReferralUser(formData, token))
        .then((res) => {
          setNameAddPerson("");
          setEmailAddPerson("");
          setNumberAddPerson("");
          setCnicAddPerson("");
          setReferredAddPerson("");
          setPreviewOpenAddPerson(false);
          dispatch(setLoading(false));
          dispatch(ReferralMiddleware.GetReferralUser(token));
          toast.success(res?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("SUCCESS ADDED REFFERAL =>", res);
        })
        .catch((err) => {
          setError(err?.data?.errors);
          dispatch(setLoading(false));
          dispatch(ReferralMiddleware.GetReferralUser(token));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ERROR ADDED REFFERAL =>", err);
        });
    }
  };

  const handleUpdatePerson = () => {
    setPreviewOpenUpdatePerson(false);
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("referral_user_id", referralId);
    formData.append("name", nameAddPerson);
    formData.append("email", emailAddPerson);
    formData.append("phone", numberAddPerson);
    formData.append("cnic", cnicAddPerson);
    formData.append("referral_code", referredAddPerson);

    dispatch(ReferralMiddleware.UpdateReferralUser(formData, token))
      .then((res) => {
        dispatch(setLoading(false));
        toast.success(res?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(ReferralMiddleware.GetReferralUser(token));
        console.log("SUCCESS UPDATE REFFERAL =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        dispatch(ReferralMiddleware.GetReferralUser(token));
        console.log("ERROR UPDATE REFFERAL =>", err);
      });
  };

  const deleteReferralbyid = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    dispatch(
      ReferralMiddleware.DeleteReferral({ id: deleteDataById.id }, token)
    )
      .then((res) => {
        dispatch(setLoading(false));
        dispatch(ReferralMiddleware.GetReferralUser(token));
        toast.success(res?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS ADDED REFFERAL =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(ReferralMiddleware.GetReferralUser(token));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR ADDED REFFERAL =>", err);
      });
  };

  const columns = [
    {
      title: <p>REFFERAL NAME</p>,
      render: (rowData) => {
        return (
          <>
            <p>{rowData.name}</p>
            <p>{rowData.email}</p>
          </>
        );
      },
    },
    {
      title: <p>PHONE NUMBER</p>,
      render: (rowData) => {
        return <p>{rowData.phone}</p>;
      },
    },
    {
      title: <p>CNIC</p>,
      render: (rowData) => {
        return <p>{rowData.cnic}</p>;
      },
    },
    {
      title: <p>REFERRAL CODE</p>,
      render: (rowData) => {
        return <p>{rowData.referral_code}</p>;
      },
    },
    {
      title: <p>REFERRAL COUNT</p>,
      render: (rowData) => {
        return <p>{rowData.referral_count}</p>;
      },
    },
    {
      title: <p className="fw-bold text-center">ACTION</p>,
      render: (rowData) => {
        return (
          <div>
            <Tooltip title="View">
              <a onClick={() => viewReferral(rowData)}>
                <EyeTwoTone style={{ fontSize: "20px" }} />
              </a>
            </Tooltip>
            <Tooltip title="Update">
              <a onClick={() => updateReferral(rowData)}>
                <EditOutlined
                  className="text-success"
                  style={{ fontSize: "20px", margin: "0 15px" }}
                />
              </a>
            </Tooltip>
            <Tooltip title="Delete">
              <a onClick={() => handleDeleteReferral(rowData)}>
                <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
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
      <ToastContainer />
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="REFFERAL"
              extra={
                <button
                  className="btn btn-primary text-white"
                  onClick={handleOpenaddperson}
                >
                  ADD PERSON
                </button>
              }
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
            ADD PERSON
          </h5>
        }
        open={previewOpenAddPerson}
        onOk={handleAddPerson}
        onCancel={handleCloseAdd}
      >
        <Row gutter={[24, 0]}>
          <Col md={12}>
            <label style={{ margin: "10px 0" }}>NAME</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddPerson();
                }
              }}
              type="text"
              value={nameAddPerson}
              onChange={(e) => setNameAddPerson(e.target.value)}
            />
            <span className="text-danger">{error.name}</span>

            {nameMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
          <Col md={12}>
            <label style={{ margin: "10px 0" }}>EMAIL</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddPerson();
                }
              }}
              type="email"
              value={emailAddPerson}
              onChange={(e) => setEmailAddPerson(e.target.value)}
            />
            <span className="text-danger">{error.email}</span>
            {emailMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>

          <Col md={12}>
            <label style={{ margin: "10px 0" }}>CNIC</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddPerson();
                }
              }}
              type="number"
              maxlength="13"
              minLength="13"
              value={cnicAddPerson}
              onChange={(e) => setCnicAddPerson(e.target.value)}
            />
            <span className="text-danger">{error.cnic}</span>
            {cnicMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
          <Col md={12}>
            <label style={{ margin: "10px 0" }}>PHONE NUMBER</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddPerson();
                }
              }}
              type="number"
              value={numberAddPerson}
              onChange={(e) => setNumberAddPerson(e.target.value)}
            />
            <span className="text-danger">{error.phone}</span>
            {numberMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
          <Col md={24}>
            <label style={{ margin: "10px 0" }}>REFFERED CODE</label>
            <Input
              type="text"
              // disabled
              value={referredAddPerson}
              onChange={(e) => setReferredAddPerson(e.target.value)}
            />
            {refferedMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>
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
            REFERRAL DETAIL
          </h5>
        }
        open={previewReferralDetail}
        onOk={() => setPreviewReferralDetail(false)}
        onCancel={() => setPreviewReferralDetail(false)}
      >
        <Row gutter={[24, 0]}>
          <Col md={24} lg={24} className="mt-3">
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: "600" }}>NAME:</p>
                <p style={{ fontSize: "16px" }}>{referralData?.name}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: "600" }}>EMAIL:</p>
                <p style={{ fontSize: "16px" }}>{referralData?.email}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: "600" }}>CNIC:</p>
                <p style={{ fontSize: "16px" }}>{referralData?.cnic}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: "600" }}>PHONE:</p>
                <p style={{ fontSize: "16px" }}>{referralData?.phone}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: "600" }}>
                  REFERRED CODE:
                </p>
                <p style={{ fontSize: "16px" }}>
                  {referralData?.referral_code}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: "600" }}>
                  REFERRED COUNT:
                </p>
                <p style={{ fontSize: "16px" }}>
                  {referralData?.referral_count}
                </p>
              </div>
            </Card>
          </Col>
        </Row>
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
            UPDATE PERSON
          </h5>
        }
        open={previewOpenUpdatePerson}
        onOk={handleUpdatePerson}
        onCancel={() => setPreviewOpenUpdatePerson(false)}
      >
        <Row gutter={[24, 0]}>
          <Col md={12}>
            <label style={{ margin: "10px 0" }}>NAME</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUpdatePerson();
                }
              }}
              type="text"
              value={nameAddPerson}
              onChange={(e) => setNameAddPerson(e.target.value)}
            />
            {nameMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
          <Col md={12}>
            <label style={{ margin: "10px 0" }}>EMAIL</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUpdatePerson();
                }
              }}
              type="email"
              value={emailAddPerson}
              onChange={(e) => setEmailAddPerson(e.target.value)}
            />
            {emailMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>

          <Col md={12}>
            <label style={{ margin: "10px 0" }}>CNIC</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUpdatePerson();
                }
              }}
              type="number"
              value={cnicAddPerson}
              onChange={(e) => setCnicAddPerson(e.target.value)}
            />
            <span className="text-danger">{error.cnic}</span>
            {cnicMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
          <Col md={12}>
            <label style={{ margin: "10px 0" }}>PHONE NUMBER</label>
            <Input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUpdatePerson();
                }
              }}
              type="number"
              value={numberAddPerson}
              onChange={(e) => setNumberAddPerson(e.target.value)}
            />
            <span className="text-danger">{error.phone}</span>
            {numberMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
          <Col md={24}>
            <label style={{ margin: "10px 0" }}>REFFERED CODE</label>
            <Input
              // onKeyPress={(e) => {
              //   if (e.key === "Enter") {
              //     handleUpdatePerson();
              //   }
              // }}
              type="text"
              // disabled
              value={referredAddPerson}
              onChange={(e) => setReferredAddPerson(e.target.value)}
            />
            {refferedMessageError ? (
              <p style={{ color: "red", marginTop: "10px" }}>
                This field is required!
              </p>
            ) : (
              ""
            )}
          </Col>
        </Row>
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
            DELETE REFERRAL
          </h5>
        }
        open={previewOpenDelete}
        onOk={deleteReferralbyid}
        okText="Delete"
        onCancel={() => setPreviewOpenDelete(false)}
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to Delete Referral!</h6>
      </Modal>
    </>
  );
};

export default Referral;
