import React, { useState } from "react";
import { Modal } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../store/common/commonSlice";
import { toast, ToastContainer } from 'react-toastify'
import { Loader } from 'react-overlay-loader'

function referal() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const dispatch = useDispatch();
    const load = useSelector((state) => state.common.loading);
    const networkError = useSelector((state) => state.common.networkError);

    useEffect(() => {
        if (name === "") setNameError(true);
        else if (name !== "") setNameError(false);
    }, [name]);

    useEffect(() => {
        if (email === "") setEmailError(true);
        else if (email !== "") setEmailError(false);
    }, [email]);

    useEffect(() => {
        if (password === "") setPasswordError(true);
        else if (password !== "") setPasswordError(false);
    }, [password]);

    const handleOpenAdd = () => {
        setPreviewOpen(true);
        setNameError(false);
        setPasswordError(false);
        setEmailError(false);
    };
    const handleCloseAdd = () => {
        setPreviewOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setNameError(false);
        setPasswordError(false);
        setEmailError(false);
    };

    const handlesubmit = () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (!name || !email || !password) {
            setPreviewOpen(true);
            dispatch(setLoading(false));
            toast.error("Please fill all fields!", {
                position: "bottom-left",
                autoClose: 2000,
            });
        }
        if (name === "") {
            setNameError(true);
        } else if (name !== "") {
            setNameError(false);
        }
        if (email === "") {
            setEmailError(true);
        } else if (email !== "") {
            setEmailError(false);
        }
        if (password === "") {
            setPasswordError(true);
        } else if (password !== "") {
            setPasswordError(false);
        }
        if (name && email && password) {
            setPreviewOpen(false);
            dispatch(setLoading(true));
            dispatch(PackageMiddleware.CreatePackage(formData, token))
                .then((res) => {
                    setName("");
                    setEmail("");
                    setPassword("");
                    dispatch(setLoading(false));
                    dispatch(PackageMiddleware.GetPackage(token));
                    toast.success(res.data?.Message, {
                        position: "bottom-left",
                        autoClose: 2000,
                    });
                    console.log("SUCCESS CREATE PACKAGE =>", res);
                })
                .catch((err) => {
                    dispatch(setLoading(false));
                    dispatch(PackageMiddleware.GetPackage(token));
                    toast.error(err?.data?.Message, {
                        position: "bottom-left",
                        autoClose: 2000,
                    });
                    console.log("ERROR CREATE PACKAGE =>", err);
                });
            console.log("ERROR CREATE PACKAGE =>");
        }
    };

    return (
        <>
            {load ? <Loader fullPage loading /> : null}
            {/* {networkError === true ? toast.error("No internet connection please check your connection!", {
        position: "bottom-left",
        autoClose: 2000,
      }) : ""} */}
            <ToastContainer />
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
                        CREATE REFERAL
                    </h5>
                }
                open={previewOpen}
                onOk={handlesubmit}
                okText="Add"
                onCancel={handleCloseAdd}
            >
                <Row>
                    <Col md={24}>
                        <label style={{ margin: "10px 0" }}>Name</label>
                        <Input
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handlesubmit();
                                }
                            }}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {nameError ? (
                            <p style={{ color: "red", marginTop: "10px" }}>
                                Name field is required!
                            </p>
                        ) : (
                            ""
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col md={24}>
                        <label style={{ margin: "10px 0" }}>Quantity</label>
                        <Input
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handlesubmit();
                                }
                            }}
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                        />
                        {emailError ? (
                            <p style={{ color: "red", marginTop: "10px" }}>
                                Quantity field is required!
                            </p>
                        ) : (
                            ""
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col md={24}>
                        <label style={{ margin: "10px 0" }}>Amount</label>
                        <Input
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handlesubmit();
                                }
                            }}
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        {passwordError ? (
                            <p style={{ color: "red", marginTop: "10px" }}>
                                Amount field is required!
                            </p>
                        ) : (
                            ""
                        )}
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default referal