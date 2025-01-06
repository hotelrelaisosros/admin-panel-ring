import { Card, Col, Row, Table, Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthMiddleware } from "../../store/auth/authMiddleware";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../../store/common/commonSlice";
import { Loader } from "react-overlay-loader";
import { DeleteOutlined, EyeTwoTone } from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";

const Reports = () => {
  const [productPage, setProductPage] = useState(1);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const postid = location.state.users.id;
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const data = useSelector((state) => state.auth?.userReport?.data);

  console.log("getdataprofile=>", data);

  let token = localStorage.getItem("token");

  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("id", postid);
    dispatch(AuthMiddleware.GetReportDetails(formData, token));
  }, []);

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    setProductPage(page);
    const formData = new FormData();
    formData.append("skip", pageSize * (page - 1));
    formData.append("take", pageSize);
    formData.append("id", postid);
    dispatch(AuthMiddleware.GetReportDetails(formData, token));
  }

  // function getProfileId() {
  //   console.log("=>");
  //   // history.push({
  //   //   pathname: "/registeredProfile",
  //   //   state: rowData,
  //   // });
  // }

  const handleDeleteReport = (record) => {
    setPreviewOpenDelete(true);
    setDeleteData(record);
    console.log("rowData=>", record);
  };

  const deleteReport = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));
    dispatch(AuthMiddleware.DeleteReport({ id: deleteData.id }, token))
      .then((res) => {
        dispatch(setLoading(false));
        const formData = new FormData();
        formData.append("skip", 0);
        formData.append("take", 10);
        formData.append("id", postid);
        dispatch(AuthMiddleware.GetReportDetails(formData, token));
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
        formData.append("id", postid);
        dispatch(AuthMiddleware.GetReportDetails(formData, token));
        toast.error("Catch error!", {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETE REPORT =>", err);
      });
  };

  const columns = [
    {
      title: "REPORT BY",
      render: (text, record) => {
        return <p>{record.users.username}</p>;
      },
    },
    {
      title: "REPORT TO",
      render: (text, record) => {
        return <p>{record.shop.username}</p>;
      },
    },
    {
      title: "MESSAGE",
      render: (text, record) => {
        return <p>{record.reason}</p>;
      },
    },
    {
      title: "ACTION",
      render: (text, record) => {
        console.log(record, "shopss");
        return (
          <>
            <div className="ant-employed">
              <Tooltip title="View">
                <a
                  onClick={() => {
                    history.push({
                      pathname: "/registeredProfile",
                      state: record.shop,
                    });
                  }}
                >
                  <EyeTwoTone style={{ fontSize: "20px" }} />
                </a>
              </Tooltip>
              <Tooltip title="Delete">
                <a onClick={() => handleDeleteReport(record)}>
                  <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
                </a>
              </Tooltip>
            </div>
          </>
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
            >
              <div className="tabled">
                <Row gutter={[24, 0]}>
                  <Col xs="24" xl={24}>
                    <div className="table-responsive">
                      <Table
                        className="ant-border-space"
                        columns={columns}
                        dataSource={data?.reports}
                        pagination={{
                          position: ["bottomCenter"],
                          current: productPage !== undefined ? productPage : 1,
                          pageSize: 10,
                          total: data?.reportsCount,
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
                DELETE REPORTDETAILS
              </h5>
            }
            open={previewOpenDelete}
            onOk={deleteReport}
            okText="Delete"
            onCancel={() => setPreviewOpenDelete(false)}
            okButtonProps={{ color: "red" }}
          >
            <h6>Are you sure want to Delete Report Details!</h6>
          </Modal>
        </Row>
      </div>
    </>
  );
};

export default Reports;
