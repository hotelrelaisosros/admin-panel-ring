import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import React, { useEffect, useState } from "react";
import { Loader } from "react-overlay-loader";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import BgProfile from "../../assets/images/background_image.jpg";
import { AuthMiddleware } from "../../store/auth/authMiddleware";
import { setLoading } from "../../store/common/commonSlice";
import { useSelector } from "react-redux";
import IMG_URL from "../../utils/imageurl";
import "./userprofile.css";

const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const UserProfile = () => {

  const dispatch = useDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [userData, setUserData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [fileList, setFileList] = useState([]);
  const load = useSelector((state) => state.common.loading);
  const currentUser = useSelector((state) => state.auth.currentUser.user);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  //token
  let token = localStorage.getItem("token");
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = () => {
    dispatch(setLoading(true));
    dispatch(AuthMiddleware.GetAdminProfile(token)).then((data) => {
      dispatch(setLoading(false));
      console.log("UserDATA", data.data.user);
      setUserData(data.data.user);
      setName(data.data.user.username);
      setEmail(data.data.user.email);
      const imgadmin = `${IMG_URL}/`;
      setFileList([{ url: imgadmin + data.data.user.image }]);
      console.log(imgadmin, "imgadmin");
    });
  };

  const Update = () => {
    const formdata = new FormData();
    if (fileList[0]?.originFileObj === undefined) {
      formdata.append("username", name);
      formdata.append("emailphone", email);
    } else {
      formdata.append("username", name);
      formdata.append("emailphone", email);
      formdata.append("image", fileList[0]?.originFileObj);
    }

    if (fileList?.length === 0 || !name || !email) {
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
    if (fileList?.length === 0) {
      setFileError(true);
    } else if (fileList?.length > 0) {
      setFileError(false);
    }
    if (name && email && fileList?.length > 0) {
      dispatch(setLoading(true));
      dispatch(AuthMiddleware.UpdateProfile(formdata, token))
        .then((res) => {
          dispatch(setLoading(false));
          dispatch(AuthMiddleware.GetAdminProfile(token));
          toast.success(res?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          getProfile();
          console.log("SUCCESS UPDATE PROFILE =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          dispatch(AuthMiddleware.GetAdminProfile(token));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ERROR UPDATE PROFILE =>", err);
        });
    }
  };

  return (
    <>
      {load ? <Loader fullPage loading /> : null}
      <div
        className="profile-nav-bg"
        style={{ backgroundImage: "url(" + BgProfile + ")" }}
      ></div>
      <ToastContainer />
      <Card
        className="card-profile-head"
        bodyStyle={{ display: "none" }}
        title={
          <Row align="middle" jutify={"center"} gutter={[24, 0]}>
            <Col span={24} md={24} className="col-info">
              <Avatar.Group>
                <Avatar
                  size={74}
                  shape="square"
                  src={`${IMG_URL}/${userData.image}`}
                />
                <div className="avatar-info">
                  <h4 className="font-semibold m-0">{userData.username}</h4>
                  <p>{userData.email}</p>
                </div>
              </Avatar.Group>
            </Col>
          </Row>
        }
      ></Card>

      <Row gutter={[24, 0]}>
        <Col span={24} md={32} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">Profile Information</h6>}
            className="header-solid h-full card-profile-information"
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            <hr className="my-25" />
            <Form
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 14,
              }}
            >
              <Form.Item label="Profile Image">
                {/* <ImgCrop rotate> */}
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={handlePreview}
                >
                  {fileList.length < 1 && "+ Upload"}
                </Upload>
                {/* </ImgCrop> */}
                {fileError ? (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    Image field is required!
                  </p>
                ) : (
                  ""
                )}
              </Form.Item>
              <Form.Item label="Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                {nameError ? (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    Name field is required!
                  </p>
                ) : (
                  ""
                )}
              </Form.Item>
              <Form.Item label="Email">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError ? (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    Email field is required!
                  </p>
                ) : (
                  ""
                )}
              </Form.Item>
              <Form.Item className="d-flex justify-content-end">
                <Button onClick={Update}>Update</Button>
              </Form.Item>
            </Form>
          </Card>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default UserProfile;
