import { Card, Col, Row, Typography } from "antd";
import { useEffect } from "react";
import Echart from "../../components/chart/EChart";
import LineChart from "../../components/chart/LineChart";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AuthMiddleware } from "../../store/auth/authMiddleware";

const Home = () => {

  const { Title } = Typography;
  const wholesalers = useSelector((state) => state.auth.wholesalers);
  const retailers = useSelector((state) => state.auth.retailers);
  const dispatch = useDispatch();
  const location = useLocation();
  const networkError = useSelector((state) => state.auth.networkError);

  useEffect(() => {
    toast.success(location.state?.Message, {
      position: "bottom-left",
      autoClose: 2000,
    });
  }, [location.state?.token]);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const formData = new FormData();
    formData.append("skip", 0);
    formData.append("take", 10);
    dispatch(AuthMiddleware.GetRetailers(formData, token));
    dispatch(AuthMiddleware.GetWholeSalers(formData, token));
  }, []);

  const profile = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6Z"
        fill="#fff"
      ></path>
      <path
        d="M17 6C17 7.65685 15.6569 9 14 9C12.3431 9 11 7.65685 11 6C11 4.34315 12.3431 3 14 3C15.6569 3 17 4.34315 17 6Z"
        fill="#fff"
      ></path>
      <path
        d="M12.9291 17C12.9758 16.6734 13 16.3395 13 16C13 14.3648 12.4393 12.8606 11.4998 11.6691C12.2352 11.2435 13.0892 11 14 11C16.7614 11 19 13.2386 19 16V17H12.9291Z"
        fill="#fff"
      ></path>
      <path
        d="M6 11C8.76142 11 11 13.2386 11 16V17H1V16C1 13.2386 3.23858 11 6 11Z"
        fill="#fff"
      ></path>
    </svg>,
  ];

  return (
    <>
      <div className="layout-content">
        <ToastContainer />
        {/* {networkError === true
          ? toast.error(
            "No internet connection please check your connection!",
            {
              position: "bottom-left",
              autoClose: 2000,
            }
          )
          : ""} */}
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
            <Card bordered={false} className="criclebox">
              <div className="number">
                <Row
                  align="middle"
                  gutter={[24, 0]}
                  style={{ padding: "0 10px" }}
                >
                  <Col xs={18} style={{ padding: "0" }}>
                    <span>Wholesalers</span>
                    <Title level={3}>
                      <span
                        style={{
                          fontSize: "22px",
                          fontWeight: "700",
                          color: "black",
                        }}
                      >
                        {wholesalers?.wholesalersCount
                          ? wholesalers?.wholesalersCount
                          : 0}
                      </span>
                    </Title>
                  </Col>
                  <Col xs={6} style={{ padding: "0" }}>
                    <div className="icon-box">{profile}</div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
            <Card bordered={false} className="criclebox">
              <div className="number">
                <Row
                  align="middle"
                  gutter={[24, 0]}
                  style={{ padding: "0 10px" }}
                >
                  <Col xs={18} style={{ padding: "0" }}>
                    <span>Retailers</span>
                    <Title level={3}>
                      <span
                        style={{
                          fontSize: "22px",
                          fontWeight: "700",
                          color: "black",
                        }}
                      >
                        {retailers?.retailersCount
                          ? retailers?.retailersCount
                          : 0}
                      </span>
                    </Title>
                  </Col>
                  <Col xs={6} style={{ padding: "0" }}>
                    <div className="icon-box">{profile}</div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Echart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Home;