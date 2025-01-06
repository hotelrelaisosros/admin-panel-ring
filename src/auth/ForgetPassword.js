import React, { useEffect, useState } from "react";
import { Card, Layout } from "antd";
import { Field, Form, Formik } from "formik";
import { Loader } from "react-overlay-loader";
import { useHistory } from "react-router-dom";
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

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const load = useSelector((state) => state.common.loading);
  const data = useSelector((state) => state.auth);
  console.log(data);
  //verification state
  const [getcode, setGetCode] = useState("");
  const [verificationCard, setVerificationCard] = useState(false);
  const [code, setCode] = useState("");
  //verification state
  useEffect(() => {
    localStorage.setItem("restshow", "false");
    const show = localStorage.getItem("show");
    if (show === "true") {
      history.push("/forgetpassword");
    } else {
      history.push("/");
    }
  }, []);

  function forgetpass() {
    const formData = new FormData();
    formData.append("emailphone", email);
    dispatch(AuthMiddleware.UserForgetPassword(formData))
      .then((res) => {
        setEmail("");
        setLoading(false);
        setGetCode(res.token);
        setVerificationCard(true);
        console.log("SUCCSS LOGIN =>", res);
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
  const verifycode = () => {
    if (getcode == code) {
      console.log("you are verifed", getcode, code);
      localStorage.setItem("restshow", "true");
      localStorage.setItem("show", "false");
      history.push({ pathname: "/resetpassword", state: data });
    } else {
      toast.error("Something Went Wrong!", {
        position: "bottom-left",
        autoClose: 2000,
      });
      console.log("Wrong Verify Code");
    }
  };
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
          {verificationCard ? (
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
              <Formik initialValues={{ code: "" }} onSubmit={verifycode}>
                <Form className="row">
                  <div className="form-group col-md-12  mt-4">
                    <Field
                      name="code"
                      className="form-control antd"
                      placeholder="Enter Verification Code"
                      type="number"
                      required
                      minlength="4"
                      maxlength="6"
                      onChange={(e) => setCode(e.target.value)}
                      value={code}
                    />
                    {/* <div className="text-danger text-start mt-2">
                      {validations?.emailphone ==
                      "The selected emailphone is invalid."
                        ? `*Invalid Your Email.`
                        : null}
                      {validations?.emailphone ==
                      "The emailphone field is required."
                        ? `*The Email Field is Required.`
                        : null}
                    </div> */}
                  </div>
                  <div className="form-group mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block w-100 antd"
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Formik>
            </Card>
          ) : (
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
              <Formik initialValues={{ email: "" }} onSubmit={forgetpass}>
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
                  <div className="form-group mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block w-100 antd"
                    >
                      Forget Password
                    </button>
                  </div>
                </Form>
              </Formik>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
