import {
  DesktopOutlined,
  FileProtectOutlined,
  OrderedListOutlined,
  RedoOutlined,
  RestOutlined,
  TagsOutlined,
  UploadOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  FileSearchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import {
  AddBoxOutlined,
  BrandingWatermark,
  CategoryOutlined,
  Report,
  SubscriptionsOutlined,
} from "@material-ui/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import ApiCaller from "../../utils/ApiCaller";
import { useHistory } from "react-router-dom"; // Import useHistory

function Sidenav({ color }) {
  const [nav, setNav] = useState(false);
  const [navsec, setNavsec] = useState(false);
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  // const dispatch = useDispatch()

  const [isCustomizeOpen, setCustomizeOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
  };
  const toggleCustomize = () => setCustomizeOpen(!isCustomizeOpen);
  const history = useHistory();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // getOrders();
    // getProducts();
    // getDeletedProducts();
    // getReports();
    // getExpirePackages();
    // const role = localStorage.getItem("role");
    const role = "superadmin";

    if (role === "superadmin") {
      setNav(true);
      setNavsec(true);
    } else if (role === "admin") {
      setNav(true);
      setNavsec(true);
    }
  }, []);

  return (
    <>
      <div className="brand w-100">
        <img src={logo} alt="" />
      </div>

      <hr />

      <Menu theme="light" mode="inline">
        {/* <Menu.Item className="menu-item-header">Overview</Menu.Item> */}
        {nav ? (
          <>
            <Menu.Item key="1" className="mt-4">
              <NavLink to="/dashboard">
                <span
                  className="icon"
                  style={{
                    background: page === "dashboard" ? color : "",
                  }}
                >
                  {/* {dashboard} */}
                  <DesktopOutlined style={{ fontSize: 20 }} />
                </span>
                <span className="label">Overview</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="2" className="mt-4">
              <NavLink to="/category">
                <span
                  className="icon"
                  style={{
                    background: page === "Category" ? color : "",
                  }}
                >
                  <CategoryOutlined style={{ fontSize: 20 }} />
                </span>
                <span className="label">Category</span>
              </NavLink>
            </Menu.Item>

     
            <Menu.Item key="7" className="mt-4">
  <div
onClick={() => {
  toggleProducts();
  history.push("/productApproval"); // Nacustovigate to the desired URL
}}    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      paddingLeft: 10,
      marginBottom: 10,
    }}
  >
    <span
      className="icon"
      style={{
        background: page === "Products" ? color : "",
      }}
    >
      <FileProtectOutlined style={{ fontSize: 20 }} />
    </span>
    <label className="">Products</label>
    {/* Toggle arrow icon based on submenu state */}

  </div>

  {/* Submenu for Products */}
  {isProductsOpen && (
    <div className="submenu" style={{ paddingLeft: 20 }}>
      {/* Product Approval */}
      {/* <Menu.Item key="7-1">
        <NavLink
          key={"productApproval"}
          to="/productApproval"
          state={{ myState: "myStateValue" }}
        >
        </NavLink>
      </Menu.Item> */}

      {/* Customize Section */}
      <Menu.Item key="7-2">
        <div
          onClick={toggleCustomize}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          <span
            className="icon"
            style={{
              background: page === "customize" ? color : "",
            }}
          >
            <CategoryOutlined style={{ fontSize: 20 }} />
          </span>
          <span className="label">Customize</span>
          {/* Toggle arrow icon for Customize submenu */}
          <span
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isCustomizeOpen ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          </span>
        </div>

        {/* Customize Submenu */}
        {isCustomizeOpen && (
          <div className="submenu" style={{ paddingLeft: 20 }}>
            <Menu.Item key="7-2-1">
              <NavLink to="/customize/gem-shape">Gem Shape</NavLink>
            </Menu.Item>
            <Menu.Item key="7-2-2">
              <NavLink to="/customize/birth-stone">Birth Stone</NavLink>
            </Menu.Item>
            <Menu.Item key="7-2-3">
              <NavLink to="/customize/gem-stone-color">
                Gem Stone Color
              </NavLink>
            </Menu.Item>
            <Menu.Item key="7-2-3">
              <NavLink to="/customize/bespoke">Bespoke</NavLink>
            </Menu.Item>
            <Menu.Item key="7-2-4">
              <NavLink to="/customize/gem-stone">Gem Stone</NavLink>
            </Menu.Item>
            <Menu.Item key="7-2-5">
              <NavLink to="/customize/metal-types">Metal Types</NavLink>
            </Menu.Item>
          </div>
        )}
      </Menu.Item>
    </div>
  )}
</Menu.Item>

     

            {/* <Menu.Item key="4" className="mt-4">
              <NavLink to="/banner">
                <span
                  className="icon"
                  style={{
                    background: page === "Banner" ? color : "",
                  }}
                >
                  {<BrandingWatermark style={{ fontSize: 20 }} />}
                </span>
                <span className="label">Banner</span>
              </NavLink>
            </Menu.Item> */}

            <Menu.Item key="5" className="mt-4">
              <NavLink
                key={"order"}
                to="/order"
                state={{ myState: "myStateValue" }}
              >
                <span
                  className="icon"
                  style={{
                    background: page === "order" ? color : "",
                  }}
                >
                  {/* {
                <Badge count={orders?.OrdersCount ? orders?.OrdersCount : 0}>
                </Badge>
              } */}
                  <OrderedListOutlined style={{ fontSize: 20 }} />
                </span>
                <label className="">Order</label>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="6" className="mt-4">
              <NavLink to="/payments">
                <span
                  className="icon"
                  style={{
                    background: page === "payments" ? color : "",
                  }}
                >
                  <TagsOutlined style={{ fontSize: 20 }} />
                </span>
                <span className="label">Payments</span>
              </NavLink>
            </Menu.Item>

        

            <Menu.Item key="8" className="mt-4">
              <NavLink
                key={"deletedProduct"}
                to="/deletedProduct"
                state={{ myState: "myStateValue" }}
              >
                <span
                  className="icon"
                  style={{
                    background: page === "deleted product" ? color : "",
                  }}
                >
                  {/* {
                <Badge
                  count={
                    deletedProducts?.ProductsCount
                      ? deletedProducts?.ProductsCount
                      : 0
                  }
                >
                </Badge>
              } */}
                  <RestOutlined style={{ fontSize: 20 }} />
                </span>
                <label className="">Deleted Products</label>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="9" className="mt-4">
              <NavLink
                key={"registeredAccount"}
                to="/registeredAccount"
                state={{ myState: "myStateValue" }}
              >
                <span
                  className="icon"
                  style={{
                    background: page === "registered-accounts" ? color : "",
                  }}
                >
                  {<UserAddOutlined style={{ fontSize: 20 }} />}
                </span>
                <label className="">Registered Accounts</label>
              </NavLink>
              {/* <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
            <Space direction="vertical">
              <Radio value={1}>Wholesalers</Radio>
              <Radio value={2}>Retailers</Radio>
            </Space>
          </Radio.Group> */}
            </Menu.Item>

            {/* <Menu.Item key="10" className="mt-4">
              <NavLink to="/report">
                <span
                  className="icon"
                  style={{
                    background: page === "Report" ? color : "",
                  }}
                >
                  <Report style={{ fontSize: 20 }} />
                </span>
                <span className="label">Report</span>
              </NavLink>
            </Menu.Item> */}

            {/* <Menu.Item key="11" className="mt-4">
              <NavLink to="/referral">
                <span
                  className="icon"
                  style={{
                    background: page === "Referral" ? color : "",
                  }}
                >
                  <UsergroupAddOutlined style={{ fontSize: 20 }} />
                </span>
                <span className="label">Referral</span>
              </NavLink>
            </Menu.Item> */}

            {/* <Menu.Item key="12" className="mt-4">
              <NavLink to="/jazzcashrefund">
                <span
                  className="icon"
                  style={{
                    background: page === "JazzCash Refund" ? color : "",
                  }}
                >
                  <RedoOutlined style={{ fontSize: 20 }} />
                </span>
                <span className="label">JazzCash Refund</span>
              </NavLink>
            </Menu.Item> */}

            {/* <Menu.Item key="13" className="mt-4">
              <NavLink to="/paymentinquiry">
                <span
                  className="icon"
                  style={{
                    background: page === "Payment Inquiry" ? color : "",
                  }}
                >
                  <FileSearchOutlined style={{ fontSize: 20 }} />
                </span>
                <span className="label">Payment Inquiry</span>
              </NavLink>
            </Menu.Item> */}

            <Menu.Item key="14" className="mt-4">
              <NavLink to="/users">
                <span
                  className="icon"
                  style={{
                    background: page === "Users" ? color : "",
                  }}
                >
                  <UploadOutlined style={{ fontSize: 20 }} />
                </span>
                <span className="label">Users</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="15" className="mt-4">
              <NavLink to="/settings">
                <span
                  className="icon"
                  style={{
                    background: page === "Settings" ? color : "",
                  }}
                >
                  <SubscriptionsOutlined style={{ fontSize: 20 }} />
                </span>
                <span className="label">Settings</span>
              </NavLink>
            </Menu.Item>
          </>
        ) : null}
      </Menu>
    </>
  );
}

export default Sidenav;
