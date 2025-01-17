// import { app } from "./pages/firebase/Firebase";
// import { getMessaging, onMessage } from "firebase/messaging";
import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Promotion from "./pages/Promotion/Promotion";
import Dashboard from "./pages/Dashboard/Dashboard";
import RegisteredAcount from "./pages/RegisteredAccount/RegisteredAccount";
import Category from "./pages/Category/Category";
import Login from "./auth/Login";
import ForgetPassword from "./auth/ForgetPassword";
import Profile from "./pages/Profile";
import Main from "./components/layout/Main";
import Viewsubcategory from "./pages/Category/Subcategory/Viewsubcategory";
import Package from "./pages/Packages/Package";
import RegisteredProfile from "./pages/RegisteredAccount/RegisteredProfile";
import Banner from "./pages/Banner/Banner";
import Customize from "./pages/Customize/Customize";
import GemShape from "./pages/Customize/GemShape";
import Bespoke from "./pages/Customize/Bespoke";

import BirthStone from "./pages/Customize/BirthStone";
import GemStoneColor from "./pages/Customize/GemStoneColor";
import GemStone from "./pages/Customize/GemStone";
import Report from "./pages/Report/Report";
import Referral from "./pages/Referral/Referral";
import Refund from "./pages/Refund/Refund";
import ReportDetails from "./pages/Report/ReportDetails";
import SubscriptionExpire from "./pages/SubscriptionExpire/SubscriptionExpire";
import Order from "./pages/Order/Order";
import OrderProfile from "./pages/Order/OrderProfile";
import ProductProfile from "./pages/ProductApproval/ProductProfile";
import Variations from "./pages/ProductApproval/Variations/Variations";
import Images from "./pages/ProductApproval/Variations/Images/Images";
import SingleVariation from "./pages/ProductApproval/Variations/SingleVariation";



import EditProduct from "./pages/ProductApproval/EditProduct";
import ProductApproval from "./pages/ProductApproval/ProductApproval";
import DeletedProduct from "./pages/DeletedProduct/DeletedProduct";
import UserProfile from "./pages/UserProfile/UserProfile";
import UploadedDocs from "./pages/UploadedDocs/UploadedDocs";
import ResetPassword from "./auth/ResetPassword";
import MetalTypes from "./pages/Customize/MetalTypes";
import Payments from "./pages/Payments/Payments";
import "./firebaseConfig";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "./App.css";
import Error from "./pages/Error/Error";
import PaymentInquiry from "./pages/PaymentInquiry/PaymentInquiry";
import AddProduct from "./pages/ProductApproval/AddProduct";
import { ToastContainer } from "react-toastify";

// loginscreen

// const PrivateRoute = ({ component: Component, token, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         token ? (
//           <Component {...props} />
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/",
//             }}
//           />
//         )
//       }
//     />
//   );
// };

const paths = [
  "forgetpassword",
  "resetpassword",
  "promotion",
  "dashboard",
  "registeredAccount",
  "category",
  "viewSubcategory/:id",
  "package",
  "profile",
  "registeredProfile",
  "banner",
  "report",
  "referral",
  "reportDetails",
  "subscriptionExpire",
  "order",
  "orderProfile/:id",
  "productApproval",
  "deletedProduct",
  "userProfile",
  "uploadedDocuments",
  "variations/:id",
  '/viewVariationImages',
];

function App() {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  const match = paths.includes(page, 0);
  console.log("match=>", match);
  return (
    <div className="App">
      <ToastContainer />
      <Switch>


   

        <Route path="/" exact component={Login} />
        <Route path="/forgetpassword" exact component={ForgetPassword} />
        <Route path="/resetpassword" exact component={ResetPassword} />
        {/* {match === false && <Route path='*' component={Error} />} */}
        <Main>
        <Route path="/viewVariationImages" component={Images} />
      <Route path="/viewSingleVariation/:id" component={SingleVariation} />

      <Route path="/customize/bespoke" component={Bespoke} />

      <Route  path="/variations/:id" component={Variations} />

          <Route path="/promotion" component={Promotion} />
          <Route path="/payments" component={Payments} />
          <Route path="/dashboard" component={Dashboard} />
          <Route exact path="/registeredAccount" component={RegisteredAcount} />
          <Route exact path="/category" component={Category} />
          <Route
            exact
            path="/viewSubcategory/:id"
            component={Viewsubcategory}
          />
          <Route exact path="/package" component={Package} />
          <Route exact path="/profile" component={Profile} />
          <Route
            exact
            path="/registeredProfile"
            component={RegisteredProfile}
          />
          <Route exact path="/banner" component={Banner} />
          <Route exact path="/report" component={Report} />
          <Route exact path="/referral" component={Referral} />
          <Route exact path="/jazzcashrefund" component={Refund} />
          <Route exact path="/paymentinquiry" component={PaymentInquiry} />
          <Route exact path="/reportDetails" component={ReportDetails} />
          <Route exact path="/customize/gem-shape" component={GemShape} />
          <Route exact path="/customize/birth-stone" component={BirthStone} />
          <Route
            exact
            path="/customize/gem-stone-color"
            component={GemStoneColor}
          />
          <Route exact path="/customize/gem-stone" component={GemStone} />
          <Route exact path="/customize/metal-types" component={MetalTypes} />
          <Route exact path="/customization/:id" component={Customize} />

          <Route
            exact
            path="/subscriptionExpire"
            component={SubscriptionExpire}
          />
          <Route exact path="/order" component={Order} />
          <Route exact path="/orderProfile/:id" component={OrderProfile} />
          <Route exact path="/productApproval" component={ProductApproval} />
          <Route exact path="/deletedProduct" component={DeletedProduct} />
          <Route exact path="/productProfile/:id" component={ProductProfile} />
          <Route exact path="/editProduct/:id" component={EditProduct} />
          <Route exact path="/addProduct" component={AddProduct} />
          <Route exact path="/userProfile" component={UserProfile} />
          <Route exact path="/uploadedDocuments" component={UploadedDocs} />
        </Main>
        <Route path="*" element={<PageNotFound />} />
      </Switch>
    </div>
  );
}

export default App;

function PageNotFound() {
  return <div>Error 404 Page Not Found!</div>;
}
