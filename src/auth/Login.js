import { Card, Layout } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Realbazar from "../assets/images/realbazar.png";
import requestPermission from "../firebaseConfig";
import { AuthMiddleware } from "../store/auth/authMiddleware";
// import { currentAppToken } from "../store/currentAppToken/currentAppToken";
import "./Login.css";

const { Content } = Layout;

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [currentUser, setCurrentUser] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const load = useSelector((state) => state.common.loading);
  const state = useSelector((state) => state.auth);
  const networkError = useSelector((state) => state.common.networkError);
  // const appToken = useSelector((state) => state);
  const role = state.currentUser?.role;
  const appToken = localStorage.getItem("appToken");
  console.log("networkError =>", networkError);

  useEffect(() => {
    toast.error(networkError.message, {
      autoClose: 2000,
      position: "bottom-left"
    })
  }, [networkError])

  useEffect(() => {
    // localStorage.setItem("role", state?.currentUser?.role.name);
    requestPermission();
    localStorage.setItem("show", "false");
    const token = localStorage.getItem("token");
    if (token) {
      history.push("/dashboard");
    } else {
      history.push("/");
    }
  }, []);

  function login() {
    const formData = new FormData();
    formData.append("role", "admin");
    formData.append("emailphone", email);
    formData.append("password", password);
    formData.append("token", appToken);
    dispatch(AuthMiddleware.UserLogin(formData))
      .then((res) => {
        setEmail("");
        setPassword("");
        localStorage.setItem("token", res?.token);
        localStorage.setItem("role", res?.user.role.name);

        history.push({
          pathname: "/dashboard",
          state: res,
          successMessage: res?.Message,
        });
        console.log("SUCCESS LOGIN =>", res);
      })
      .catch((err) => {
        setError(err?.data.errors);
        toast.error(err?.data.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR LOGIN =>", err);
      });
  }

  const forgetfunc = () => {
    localStorage.setItem("show", "true");
    history.push("/forgetpassword");
  };

  const validations = error;

  return (
    <div>
      <div className="layout-default ant-layout layout-sign-up">
        {load ? <Loader fullPage loading /> : null}
        <ToastContainer />
        <div className="p-0">
          <div className="sign-up-header content">
            <Content className="content p-4"></Content>
          </div>
          <Card
            className="card-signup header-solid h-full ant-card pt-0 text-center"
            title={
              <img
                style={{ textAlign: "center" }}
                src={Realbazar}
                width="200"
              />
            }
            bordered="false"
          >
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={login}
            >
              <Form className="row">
                <div className="form-group col-md-12  mt-4">
                  <Field
                    name="email"
                    className="form-control antd"
                    placeholder="Email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <div className="text-danger mt-2 text-start">
                    {validations?.emailphone ==
                      "The selected emailphone is invalid."
                      ? `*Invalid Your Email.`
                      : null}
                    {validations?.emailphone ==
                      "The emailphone field is required."
                      ? `*The Email Field is Required.`
                      : null}
                  </div>
                </div>
                <div className="form-group col-md-12  mt-4">
                  <Field
                    name="password"
                    className="form-control antd"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <div className="text-danger mt-2 text-start">
                    {/* {validations?.password == "The selected password is invalid."
                    ? `*Invalid Your Email.`
                    : null} */}

                    {validations?.password == "The password field is required."
                      ? `*The Password Field is Required.`
                      : null}
                  </div>
                </div>
                <span>
                  <a href="#" onClick={forgetfunc}>
                    ForgetPassword
                  </a>
                </span>
                <div className="form-group mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block w-100 antd"
                  >
                    LOGIN
                  </button>
                </div>
              </Form>
            </Formik>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
