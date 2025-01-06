import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Col, Input, Modal, Row, Select, Table, Tooltip } from "antd";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../../store/common/commonSlice";
import { PackageMiddleware } from "../../store/package/packageMiddleware";
import { AuthMiddleware } from "../../store/auth/authMiddleware";

const Package = () => {

  const [previewOpenAdd, setPreviewOpenAdd] = useState(false);
  const [previewOpenupdate, setPreviewOpenUpdate] = useState(false);
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  const [updatedata, setUpdatedata] = useState();
  const [deleteData, setDeleteData] = useState();

  // create packages fields
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();
  const data = useSelector((state) => state.package.packages?.Package);
  const [nameError, setNameError] = useState(false);
  const [qtyError, setQtyError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);

  let token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(PackageMiddleware.GetPackage(token));
    dispatch(AuthMiddleware.GetReport(token));
  }, []);

  useEffect(() => {
    if (name === "") setNameError(true);
    else if (name !== "") setNameError(false);
  }, [name]);

  useEffect(() => {
    if (qty === "") setQtyError(true);
    else if (qty !== "") setQtyError(false);
  }, [qty]);

  useEffect(() => {
    if (amount === "") setAmountError(true);
    else if (amount !== "") setAmountError(false);
  }, [amount]);

  const handleOpenAdd = () => {
    setPreviewOpenAdd(true);
    setNameError(false);
    setAmountError(false);
    setQtyError(false);
  };
  const handleCloseAdd = () => {
    setPreviewOpenAdd(false);
    setName("");
    setQty("");
    setAmount("");
    setNameError(false);
    setAmountError(false);
    setQtyError(false);
  };
  const handlesubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("product_qty", qty);
    formData.append("amount", parseInt(amount));
    if (!name || !qty || !amount) {
      setPreviewOpenAdd(true);
      dispatch(setLoading(false));
      toast.error("Please fill all fields!", {
        position: "bottom-left",
        autoClose: 2000,
      });
    }
    if (name === "") {
      setNameError(true);
    } else if (name !== "") {
      setNameError(false);
    }
    if (qty === "") {
      setQtyError(true);
    } else if (qty !== "") {
      setQtyError(false);
    }
    if (amount === "") {
      setAmountError(true);
    } else if (amount !== "") {
      setAmountError(false);
    }
    if (name && qty && amount) {
      setPreviewOpenAdd(false);
      dispatch(setLoading(true));
      dispatch(PackageMiddleware.CreatePackage(formData, token))
        .then((res) => {
          setName("");
          setQty("");
          setAmount("");
          dispatch(setLoading(false));
          dispatch(PackageMiddleware.GetPackage(token));
          toast.success(res.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("SUCCESS CREATE PACKAGE =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          dispatch(PackageMiddleware.GetPackage(token));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ERROR CREATE PACKAGE =>", err);
        });
      console.log("ERROR CREATE PACKAGE =>");
    }
  };

  const handleOpenUpdate = (rowData) => {
    setPreviewOpenUpdate(true);
    setUpdatedata(rowData);
    setName(rowData.name);
    setQty(rowData.product_qty);
    setAmount(rowData.amount);
  };
  const handleCloseUpdate = () => {
    setPreviewOpenUpdate(false);
  };
  const updatePackage = () => {
    setPreviewOpenUpdate(false);
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("id", updatedata.id);
    formData.append("name", name);
    formData.append("product_qty", qty);
    formData.append("amount", amount);
    dispatch(PackageMiddleware.UpdatePackage(formData, token))
      .then((res) => {
        setName("");
        setQty("");
        setAmount("");
        dispatch(setLoading(false));
        dispatch(PackageMiddleware.GetPackage(token));
        toast.success(res.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS UPDATE PACKAGE =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(PackageMiddleware.GetPackage(token));
        toast.error("Catch error!", {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR UPDATE PACKAGE =>", err);
      });
  };

  const handleOpenDelete = (rowData) => {
    setPreviewOpenDelete(true);
    setDeleteData(rowData);
  };
  const deletePackage = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    dispatch(PackageMiddleware.DeletePackage({ id: deleteData.id }, token))
      .then((res) => {
        dispatch(setLoading(false));
        dispatch(PackageMiddleware.GetPackage(token));
        toast.success(res.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETE PACKAGE =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(PackageMiddleware.GetPackage(token));
        toast.error("Catch error!", {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETE PACKAGE =>", err);
      });
  };

  const columns = [
    {
      title: <p>PACKAGE NAME</p>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <p>QUANTITY</p>,
      dataIndex: "product_qty",
      key: "product_qty",
    },
    {
      title: <p>AMOUNT</p>,
      dataIndex: "amount",
      key: "amount",
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
              title="PACKAGES"
              extra={
                <>
                  <button className="btn btn-primary">
                    <a className="text-white" onClick={handleOpenAdd}>
                      CREATE PACKAGE
                    </a>
                  </button>
                </>
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
            {/* Create packages */}
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
                  CREATE PACKAGES
                </h5>
              }
              open={previewOpenAdd}
              onOk={handlesubmit}
              okText="Add"
              onCancel={handleCloseAdd}
            >
              <Row>
                <Col md={24}>
                  <label style={{ margin: "10px 0" }}>Name</label>
                  <Input
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handlesubmit();
                      }
                    }}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {nameError ? (
                    <p style={{ color: "red", marginTop: "10px" }}>
                      Name field is required!
                    </p>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={24}>
                  <label style={{ margin: "10px 0" }}>Quantity</label>
                  <Input
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handlesubmit();
                      }
                    }}
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                  {qtyError ? (
                    <p style={{ color: "red", marginTop: "10px" }}>
                      Quantity field is required!
                    </p>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={24}>
                  <label style={{ margin: "10px 0" }}>Amount</label>
                  <Input
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handlesubmit();
                      }
                    }}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {amountError ? (
                    <p style={{ color: "red", marginTop: "10px" }}>
                      Amount field is required!
                    </p>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </Modal>
            {/* Update packages */}
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
                  UPDATE PACKAGES
                </h5>
              }
              open={previewOpenupdate}
              onOk={updatePackage}
              okText="Update"
              onCancel={handleCloseUpdate}
            >
              <Row>
                <Col md={24}>
                  <label style={{ margin: "10px 0" }}>Name</label>
                  <Input
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        updatePackage();
                      }
                    }}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={24}>
                  <label style={{ margin: "10px 0" }}>Quantity</label>
                  <Input
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        updatePackage();
                      }
                    }}
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={24}>
                  <label style={{ margin: "10px 0" }}>Amount</label>
                  <Input
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        updatePackage();
                      }
                    }}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Col>
              </Row>
            </Modal>
            {/* Delete packages */}
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
                  DELETE PACKAGES
                </h5>
              }
              open={previewOpenDelete}
              onOk={deletePackage}
              okText="Delete"
              onCancel={() => setPreviewOpenDelete(false)}
              okButtonProps={{ color: "red" }}
            >
              <h6>Are you sure want to delete package!</h6>
            </Modal>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Package;
