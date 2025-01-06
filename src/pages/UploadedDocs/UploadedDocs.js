import { EyeTwoTone } from "@ant-design/icons";
import {
  Card,
  Carousel,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthMiddleware } from "../../store/auth/authMiddleware";
import IMG_URL from "../../utils/imageurl";

const UploadedDocs = () => {
  const [productPage, setProductPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectRole, setSelectRole] = useState("retailers");
  const [viewModal, setViewModal] = useState("");

  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const [previewOpendoc, setPreviewOpendoc] = useState(false);
  const { Option } = Select;
  const { Title } = Typography;
  const { Search } = Input;
  const opt = [{ option: "Retailers" }, { option: "Wholesalers" }];

  //token
  let token = localStorage.getItem("token");

  const handleChangeUserRole = (value) => {
    setSelectRole(value);
  };

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
      console.log(res);
    });
  }, []);

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    setProductPage(page);
    const formData = new FormData();
    formData.append("skip", pageSize * (page - 1));
    formData.append("take", pageSize);
    formData.append("search", "");
    dispatch(
      AuthMiddleware.GetUsers(
        formData,
        { role: selectRole.toLowerCase() },
        token
      )
    );
  }

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
    );
  }, [selectRole]);

  function viewdocfunc(rowData) {
    console.log("rowData=>>>", rowData);
    setViewModal(rowData);
    setPreviewOpendoc(true);
  }
  const handleClose = () => {
    setPreviewOpendoc(false);
  };

  const columns = [
    {
      title: <p>USERS</p>,
      render: (rowData) => {
        return (
          <>
            <Title level={5}>{rowData.username}</Title>
            <p>{rowData.email}</p>
          </>
        );
      },
    },
    {
      title: <p>ROLE</p>,
      render: (rowData) => {
        return <p>{rowData.role.name}</p>;
      },
    },
    {
      title: <p>PHONE NUMBER</p>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <p>BUSINESS NAME</p>,
      dataIndex: "business_name",
      key: "business_name",
    },
    {
      title: <p>BUSINESS ADDRESS</p>,
      dataIndex: "business_address",
      key: "business_address",
    },
    {
      title: <p>ACTION</p>,
      render: (rowData) => {
        return (
          <div className="ant-employed">
            <Tooltip title="view">
              <a
                onClick={() => {
                  viewdocfunc(rowData);
                }}
              >
                <EyeTwoTone style={{ fontSize: "20px" }} />
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
                    UPLOADED DOCUMENTS
                  </p>

                  <label
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
                      size="medium"
                      defaultValue="Retailers"
                      style={{ width: "170px" }}
                      onSelect={(value, event) =>
                        handleChangeUserRole(value, event)
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
                  </div>
                </div>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={data?.users.retailers || data?.users.wholesalers}
                  className="ant-border-space"
                  pagination={{
                    position: ["bottomCenter"],
                    current: productPage !== undefined ? productPage : 1,
                    pageSize: 10,
                    total:
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
        </Modal>
      </div>
    </>
  );
};

export default UploadedDocs;
