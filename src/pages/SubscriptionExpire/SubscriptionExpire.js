import React, { useState } from "react";
import { Row, Col, Card, Table, Select, Input, Tooltip } from "antd";
import TimerComp from "../../components/timer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { PackageMiddleware } from "../../store/package/packageMiddleware";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { Loader } from "react-overlay-loader";
import { EyeTwoTone } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const SubscriptionExpire = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = useSelector((state) => state.package.expirePackages);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const [productPage, setProductPage] = useState(1);
  const [selectRole, setSelectRole] = useState("Retailer");
  const [search, setSearch] = useState("");

  const opt = [
    // { option: "All" },
    { option: "Retailer" },
    { option: "Wholesaler" },
  ];
  const { Option } = Select;
  const { Search } = Input;

  const handleChangeRole = (value) => {
    setSelectRole(value);
  };

  const columns = [
    {
      title: <p>Name</p>,
      render: (text, record) => (
        <>
          <h6>{record.user.username}</h6>
          <p>{record.user.email}</p>
        </>
      ),
    },
    {
      title: <p>Name</p>,
      render: (text, record) => {
        return <p>{record.user.role.name}</p>;
      },
    },
    {
      title: <p>PACKAGE NAME</p>,
      dataIndex: "package_name",
      key: "package_name",
      filters: [
        {
          text: "Platinium",
          value: "Platinium",
        },
        {
          text: "Gold",
          value: "Gold",
        },
        {
          text: "Silver",
          value: "Silver",
        },
        {
          text: "Bronze",
          value: "Bronze",
        },
      ],
      onFilter: (value, record) => value === record.package.name,
      render: (text, record) => {
        return <p>{record.package.name}</p>;
      },
    },
    {
      title: <p>DATE OF ISSUE</p>,
      dataIndex: "start_date",
      key: "start_date",
      render: (text, record) => {
        return <p>{record.start_date}</p>;
      },
    },
    {
      title: <p>DATE OF EXPIRY</p>,
      key: "end_date",
      dataIndex: "end_date",
      render: (text, record) => {
        return <p>{record.end_date}</p>;
      },
    },
    {
      title: <p>EXPIRES IN</p>,
      dataIndex: "expires_in",
      key: "expires_in",
      render: (text, record) => {
        console.log(record);
        return <TimerComp end_date={record.end_date} />;
      },
    },
    {
      title: <p className="ant-employed fw-bold">ACTION</p>,
      render: (rowData) => (
        <div className="w-75 ant-employed">
          <Tooltip title="view">
            <a
              onClick={() =>
                history.push({
                  pathname: "/registeredProfile",
                  state: rowData.user,
                })
              }
            >
              <EyeTwoTone style={{ fontSize: "20px" }} />
            </a>
          </Tooltip>
        </div>
      ),
    },
  ];

  const token = localStorage.getItem("token");

  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("role", selectRole.toLowerCase());
    formData.append("search", "");
    dispatch(PackageMiddleware.ExpirePackage(token)).then((res) => {
      console.log(res);
    });
  }, []);

  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("role", selectRole.toLowerCase());
    formData.append("search", "");
    dispatch(PackageMiddleware.ExpirePackage(formData, token));
  }, [selectRole]);

  function handlePagination(page, pageSize) {
    console.log(page, pageSize);
    setProductPage(page);
    const formData = new FormData();
    formData.append("skip", pageSize * (page - 1));
    formData.append("take", pageSize);
    formData.append("role", selectRole.toLowerCase());
    formData.append("search", "");
    dispatch(PackageMiddleware.ExpirePackage(formData, token));
  }

  function handleSearch() {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    formData.append("role", selectRole.toLowerCase());
    formData.append("search", "");
    dispatch(PackageMiddleware.ExpirePackage(formData, token))
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

  return (
    <div>
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
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "24px",
                      color: "black",
                    }}
                  >
                    SUBSCRIPTION EXPIRED
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
                      placeholder="Search package"
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
              <div className="tabled">
                <Row gutter={[24, 0]}>
                  <Col xs="24" xl={24}>
                    <div className="table-responsive">
                      <Table
                        className="ant-border-space"
                        columns={columns}
                        dataSource={data.expiry}
                        pagination={{
                          position: ["bottomCenter"],
                          current: productPage !== undefined ? productPage : 1,
                          pageSize: 10,
                          total: data?.expiryCount,
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
        </Row>
      </div>
    </div>
  );
};

export default SubscriptionExpire;
