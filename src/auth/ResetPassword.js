import React, { useEffect, useState } from "react";
import { Card, Layout } from "antd";
import { Field, Form, Formik } from "formik";
import { Loader } from "react-overlay-loader";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Realbazar from "../assets/images/realbazar.png";
// import axios from "../utils/axios";
// import * as Yup from "yup";
import BgProfile from "../assets/images/background_image.jpg";
import { toast, ToastContainer } from "react-toastify";
import { AuthMiddleware } from "../store/auth/authMiddleware";
import "./Login.css";
import { setLoading } from "../store/common/commonSlice";

const { Content } = Layout;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  // const [currentUser, setCurrentUser] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const load = useSelector((state) => state.common.loading);
  const state = useSelector((state) => state.auth);
  console.log("state=>", state);
  useEffect(() => {
    const restshow = localStorage.getItem("restshow");
    if (restshow === "true") {
      history.push("/resetpassword");
    } else {
      history.push("/");
    }
  }, []);

  function reset() {
    const formData = new FormData();
    formData.append("token", state.currentUser.token);
    formData.append("emailphone", email);
    formData.append("password", password);
    formData.append("c_password", confirmPassword);
    dispatch(AuthMiddleware.UserResetPassword(formData))
      .then((res) => {
        setEmail("");
        setPassword("");
        setLoading(false);
        console.log("SUCCSS LOGIN =>", res);
        history.push("/");
        localStorage.setItem("restshow", "false");
      })
      .catch((err) => {
        setError(err?.data?.errors);
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        toast.error(err?.data[1], {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR LOGIN =>", err?.data[1]);
      });
  }
  const validations = error;
  return (
    <>
      <div className="layout-default ant-layout layout-sign-up">
        {load ? <Loader fullPage loading /> : null}
        <ToastContainer limit={1} />
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
              initialValues={{ email: "", password: "", confirmpassword: "" }}
              onSubmit={reset}
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
                  <div className="text-danger text-start mt-2">
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
                    placeholder="New Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <div className="text-danger text-start mt-2">
                    {validations?.password ==
                    "The selected password is invalid."
                      ? `*Invalid Your Password.`
                      : null}
                    {validations?.password == "The password field is required."
                      ? `*The Password Field is Required.`
                      : null}
                  </div>
                </div>
                <div className="form-group col-md-12  mt-4">
                  <Field
                    name="confirmpassword"
                    className="form-control antd"
                    placeholder="Confirm Password"
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                  <div className="text-danger text-start mt-2">
                    {validations?.c_password ==
                    "The c password and password must match."
                      ? `*Mismatch Confrim Password.`
                      : null}
                    {validations?.c_password ==
                    "The c password field is required."
                      ? `*The Confirm Password Field is Required.`
                      : null}
                  </div>
                </div>
                <div className="form-group mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block w-100 antd"
                  >
                    Reset
                  </button>
                </div>
              </Form>
            </Formik>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
