import { EyeTwoTone } from "@ant-design/icons";
import { Card, Col, Modal, Row, Select, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AuthMiddleware } from "../../store/auth/authMiddleware";
import { setLoading } from "../../store/common/commonSlice";

const Reports = () => {
  const [productPage, setProductPage] = useState(1);
  const dispatch = useDispatch();
  const history = useHistory();
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  const [deleteDataById, setDeleteDataById] = useState();
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const data = useSelector((state) => state.auth.userReport.data);
  console.log("data=>", data);

  let token = localStorage.getItem("token");

  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    dispatch(AuthMiddleware.GetReport(formData, token));
  }, []);

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    setProductPage(page);
    const formData = new FormData();
    formData.append("skip", pageSize * (page - 1));
    formData.append("take", pageSize);
    dispatch(AuthMiddleware.GetReport(formData, token));
  }

  const handleDeleteReport = (rowData) => {
    setPreviewOpenDelete(true);
    setDeleteDataById(rowData);
    console.log("rowData=>", rowData);
  };
  const deleteAll = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    dispatch(AuthMiddleware.DeleteAllReport(token))
      .then((res) => {
        dispatch(setLoading(false));
        const formData = new FormData();
        formData.append("skip", 0);
        formData.append("take", 10);
        dispatch(AuthMiddleware.GetReport(formData, token));
        toast.success(res.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETE ALL REPORT =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        const formData = new FormData();
        formData.append("skip", 0);
        formData.append("take", 10);
        dispatch(AuthMiddleware.GetReport(formData, token));
        toast.error("Catch error!", {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETE ALL REPORT =>", err);
      });
  };
  const deleteReportbyid = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    dispatch(AuthMiddleware.DeleteReportId({ id: deleteDataById.id }, token))
      .then((res) => {
        dispatch(setLoading(false));
        const formData = new FormData();
        formData.append("skip", 0);
        formData.append("take", 10);
        dispatch(AuthMiddleware.GetReport(formData, token));
        toast.success(res.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETE REPORT =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        const formData = new FormData();
        formData.append("skip", 0);
        formData.append("take", 10);
        dispatch(AuthMiddleware.GetReport(formData, token));
        toast.error("Catch error!", {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETE REPORT =>", err);
      });
  };

  const columns = [
    {
      title: <p>REPORT BY</p>,
      render: (rowData) => {
        console.log(rowData);
        return <p>{rowData.users.username}</p>;
      },
    },
    {
      title: <p>NO OF REPORTS</p>,
      render: (rowData) => {
        console.log(rowData);
        return <p>{rowData.total}</p>;
      },
    },
    {
      title: <p className="fw-bold">ACTION</p>,
      render: (rowData) => {
        return (
          <div className="w-25 ant-employed">
            <Tooltip title="View">
              <a
                onClick={() =>
                  history.push({
                    pathname: "/reportDetails",
                    state: rowData,
                  })
                }
              >
                <EyeTwoTone style={{ fontSize: "20px" }} />
              </a>
            </Tooltip>
            {/* <Tooltip title="Delete">
              <a onClick={() => handleDeleteReport(rowData)}>
                <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
              </a>
            </Tooltip> */}
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
      <ToastContainer limit={1} />
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="REPORTS"
              extra={
                <>
                  <button className="btn btn-danger" onClick={deleteAll}>
                    DELETE ALL
                  </button>
                </>
              }
            >
              <div className="tabled">
                <Row gutter={[24, 0]}>
                  <Col xs="24" xl={24}>
                    <div className="table-responsive">
                      <Table
                        className="ant-border-space"
                        columns={columns}
                        dataSource={data?.count}
                        pagination={{
                          position: ["bottomCenter"],
                          current: productPage !== undefined ? productPage : 1,
                          pageSize: 10,
                          total: data?.totalCount,
                          onChange: (page, pageSize) =>
                            handlePagination(page, pageSize),
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          {/* Delete Reports */}
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
                DELETE REPORT
              </h5>
            }
            open={previewOpenDelete}
            onOk={deleteReportbyid}
            okText="Delete"
            onCancel={() => setPreviewOpenDelete(false)}
            okButtonProps={{ color: "red" }}
          >
            <h6>Are you sure want to Delete Reports!</h6>
          </Modal>
        </Row>
      </div>
    </>
  );
};

export default Reports;
