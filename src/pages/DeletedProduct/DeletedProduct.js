import { DeleteOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
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
import { setLoading } from "../../store/common/commonSlice";
import IMG_URL from "../../utils/imageurl";

const DeletedProduct = () => {
  const { Search } = Input;
  const [previewOpenDelete1, setPreviewOpenDelete1] = useState(false);
  const [previewOpenDelete2, setPreviewOpenDelete2] = useState(false);
  const [deletedProductId, setDeletedProductId] = useState();
  const [selectRole, setSelectRole] = useState("Retailer");
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const data = useSelector((state) => state.auth.deletedProducts.Products);
  const opt = [{ option: "Retailer" }, { option: "Wholesaler" }];
  const { Option } = Select;
  let token = localStorage.getItem("token");

  const handleChangeRole = (value) => {
    setSelectRole(value);
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("role", selectRole.toLowerCase());
    formData.append("search", search);
    dispatch(AuthMiddleware.GetDeletedProducts(formData, token));
  }, []);

  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("role", selectRole.toLowerCase());
    formData.append("search", search);
    dispatch(AuthMiddleware.GetDeletedProducts(formData, token));
  }, [selectRole]);

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    const formData = new FormData();
    formData.append("skip", page);
    formData.append("take", pageSize);
    formData.append("role", selectRole.toLowerCase());
    formData.append("search", search);
    dispatch(AuthMiddleware.GetDeletedProducts(formData, token));
  }

  function handleSearch() {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("role", selectRole.toLowerCase());
    formData.append("search", search);
    dispatch(AuthMiddleware.GetDeletedProducts(formData, token))
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

  const handleOpenDelete1 = () => {
    setPreviewOpenDelete1(true);
  };
  const handleDeleteAllProducts = () => {
    dispatch(setLoading(true));
    setPreviewOpenDelete1(false);
    dispatch(AuthMiddleware.DeleteAllProduct(token)).then((res) => {
      dispatch(setLoading(false));
      const formData = new FormData();
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("role", selectRole.toLowerCase());
      formData.append("search", search);
      dispatch(AuthMiddleware.GetDeletedProducts(formData, token));
      toast.success(res.data?.Message, {
        position: "bottom-left",
        autoClose: 2000,
      });
    });
  };

  const handleOpenDelete2 = (rowData) => {
    setPreviewOpenDelete2(true);
    setDeletedProductId(rowData.id);
  };
  const handleDeleteProductById = (rowData) => {
    setPreviewOpenDelete2(false);
    dispatch(setLoading(true));
    dispatch(
      AuthMiddleware.DeleteSpecificProduct({ id: deletedProductId }, token)
    ).then((res) => {
      dispatch(setLoading(false));
      const formData = new FormData();
      formData.append("skip", 0);
      formData.append("take", 10);
      formData.append("role", selectRole.toLowerCase());
      formData.append("search", search);
      dispatch(AuthMiddleware.GetDeletedProducts(formData, token));
      toast.success(res.data?.Message, {
        position: "bottom-left",
        autoClose: 2000,
      });
    });
  };

  const columns = [
    {
      title: <p>IMAGE</p>,
      render: (rowData) => {
        return (
          <>
            <Avatar
              className="shape-avatar"
              shape="square"
              size={70}
              src={`${IMG_URL}/` + rowData?.image[0]?.image}
            />
            <p className="mt-2 text-dark">{rowData.title}</p>
          </>
        );
      },
    },
    {
      title: <p>SHOP</p>,
      render: (rowData) => {
        return (
          <>
            <h6>{rowData.shop.username}</h6>
            <p>{rowData.shop.email}</p>
          </>
        );
      },
    },
    {
      title: <p>ROLE</p>,
      render: (text, record) => {
        return <p>{record.shop.role.name}</p>;
      },
    },
    {
      title: <p>COLLECTION</p>,
      render: (rowData) => {
        return <p className="text-dark">{rowData.category.name}</p>;
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
    {
      title: <p className="ant-employed fw-bold">ACTION</p>,
      render: (rowData) => (
        <div
          className="ant-employed"
          onClick={() => handleOpenDelete2(rowData)}
          style={{ cursor: "pointer" }}
        >
          <Tooltip title="delete">
            <DeleteOutlined
              className="text-danger"
              style={{ fontSize: "21px" }}
            />
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
          <Col span={24} md={24}>
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
                    PRODUCTS
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
                      defaultValue="Retailer"
                      style={{ width: "170px" }}
                      onSelect={(value, event) =>
                        handleChangeRole(value, event)
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
                      placeholder="Search Product"
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
                  <div>
                    <button
                      className="btn btn-danger fw-bold"
                      onClick={handleOpenDelete1}
                    >
                      DELETE ALL
                    </button>
                  </div>
                </div>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={data}
                  className="ant-border-space"
                  pagination={{
                    position: ["bottomCenter"],
                    current: 1,
                    pageSize: 10,
                    total: data?.length,
                    onChange: (page, pageSize) =>
                      handlePagination(page, pageSize),
                  }}
                />
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
              color: "white",
              textAlign: "center",
            }}
          >
            DELETE ALL PRODUCTS
          </h5>
        }
        open={previewOpenDelete1}
        onOk={handleDeleteAllProducts}
        okText="Delete"
        onCancel={() => setPreviewOpenDelete1(false)}
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to delete all products!</h6>
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
            DELETE ALL PRODUCTS
          </h5>
        }
        open={previewOpenDelete2}
        onOk={handleDeleteProductById}
        okText="Delete"
        onCancel={() => setPreviewOpenDelete2(false)}
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to delete product!</h6>
      </Modal>
    </>
  );
};

export default DeletedProduct;
