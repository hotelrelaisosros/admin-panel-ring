import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Input,
  Modal,
  Row,
  Table,
  Tooltip,
  Upload,
} from "antd";
// import ImgCrop from "antd-img-crop";
import { Loader } from "react-overlay-loader";
import { useHistory } from "react-router-dom";
import IMG_URL from "../../../../utils/imageurl";
import {
  EyeTwoTone,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { CategoryMiddleware } from "../../../../store/category/categoryMiddleware";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../../../../store/common/commonSlice";
import {
  ImageMiddleware,
  VariationMiddleware,
} from "../../../../store/variation/variationMiddleware";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useLocation } from "react-router-dom";
import { Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Images = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const variant_id = queryParams.get("variant_id") ?? "";
  const product_id = queryParams.get("product_id");
  const commonData = new FormData();
  commonData.append("product_id", product_id);
  if (variant_id) {
    commonData.append("variant_id", variant_id);
  }

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [cateName, setCateName] = useState("");
  const [subCateName, setSubCateName] = useState("");

  const [fileList, setFileList] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [fileList3, setFileList3] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();

  //   const data = useSelector((state) => state.category.categories.Category);
  const data = useSelector((state) => state.image.images);

  const [varId, setVarId] = useState("");
  const [fileList1Error, setFileList1Error] = useState(false);
  const [fileList2Error, setFileList2Error] = useState(false);
  const load = useSelector((state) => state.common.loading);
  const networkError = useSelector((state) => state.common.networkError);
  const [previewOpenAdd, setPreviewOpenAdd] = useState(false);
  const [previewOpenupdate, setPreviewOpenupdate] = useState(false);
  const [previewOpenDelete, setPreviewOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [click, setclick] = useState(false);
  const [catId, setCatId] = useState();
  const { id } = useParams();

  // new fields
  const [indImage, setIndImage] = useState([]);

  const [recordToDelete, setRecordToDelete] = useState(null); // State to track the record being deleted
  const [previewOpenDeleteSingleImage, setPreviewOpenDeleteSingleImage] =
    useState(false); // Modal visibility state

  let token = localStorage.getItem("token");

  //images handle

  const [records, setRecords] = useState(data);

  const handleDeleteImage = (recordId, imageUrl, type) => {
    setRecordToDelete({ recordId, imageUrl, type }); // Set the record to delete
    setPreviewOpenDeleteSingleImage(true); // Open the modal
  };

  // This function will be called when the user clicks OK to delete the image
  const deleteOneProductImage = async () => {
    const { recordId, imageUrl, type } = recordToDelete; // Extract data of the image to delete

    const modifiedImageUrl = imageUrl.split("storage/")[1]; // Modify imageUrl to match storage path
    const formData = new FormData();
    formData.append("id", recordId);
    formData.append("image_url", modifiedImageUrl);
    formData.append("type", type);

    dispatch(ImageMiddleware.DeleteOneImageRecord(formData, token))
      .then((res) => {
        dispatch(setLoading(false)); // Stop loading spinner
        dispatch(ImageMiddleware.GetImages(commonData, token)); // Refresh images
        toast.success(res?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETING ONE IMAGE =>", res);
        setPreviewOpenDeleteSingleImage(false);
      })
      .catch((err) => {
        dispatch(setLoading(false)); // Stop loading spinner
        dispatch(ImageMiddleware.GetImages(commonData, token)); // Refresh images on error
        toast.error(err?.data?.message || "Failed to delete image.", {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETING ONE IMAGE =>", err);
        setPreviewOpenDeleteSingleImage(false); // Close modal on error
      });
  };

  useEffect(() => {
    dispatch(ImageMiddleware.GetImages(commonData, token));
  }, []);

  useEffect(() => {
    if (fileList?.length === 0) {
      setFileList1Error(true);
    } else {
      setFileList1Error(false);
    }
  }, [fileList]);

  useEffect(() => {
    if (fileList2?.length === 0) {
      setFileList2Error(true);
    } else {
      setFileList2Error(false);
    }
  }, [fileList2]);

  const handleCancel = () => setPreviewOpen(false);

  const handleOpenAddModal = () => {
    setPreviewOpenAdd(true);
    // setSubCatNameError(false);
    setFileList1Error(false);
    setFileList2Error(false);
  };

  const handleCloseAddModalInd = () => {
    setPreviewOpenAddInd(false);
    setIndImage([]);
    setFileList1Error(false);
  };

  const handleCloseAddModal = () => {
    setPreviewOpenAdd(false);
    setFileList([]);
    setFileList2([]);
    setFileList1Error(false);
    setFileList2Error(false);
  };

  const handleOpenDelete = (rowData) => {
    setVarId(rowData.id);
    setPreviewOpenDelete(true);
    setDeleteData(rowData);
  };

  const deleteVariation = () => {
    setPreviewOpenDelete(false);
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("id", varId);

    dispatch(ImageMiddleware.DeleteAllImages(formData, token))
      .then((res) => {
        dispatch(setLoading(false));

        dispatch(ImageMiddleware.GetImages(commonData, token));
        toast.success(res.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETED IMAGE =>", res);
      })
      .catch((err) => {
        dispatch(setLoading(false));
        const formdata = new FormData();
        formdata.append("product_id", id);
        dispatch(ImageMiddleware.GetImages(commonData, token));
        toast.error(err?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETED IMAGE =>", err);
      });
  };

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageOnly, setPreviewImageOnly] = useState("");

  const handlePreviewImageOnly = (image) => {
    setPreviewImageOnly(image);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const [image, setImage] = React.useState("");
  const [imageCollection, setImageCollection] = React.useState([]);
  const [storedFile, setStoredFile] = useState(null); // Variable to store the file

  const handlePreview = async (file) => {
    setPreviewImage(file?.url || file?.thumbUrl);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setPreviewOpen(true);
  };

  const validateImageFile = (
    file,
    allowedTypes = ["image/jpeg", "image/png", "image/gif"]
  ) => {
    const isValid = allowedTypes.includes(file.type);
    if (!isValid) {
      toast.error("You can only upload JPG, PNG, or GIF files!");
    }
    return isValid;
  };

  // Handle image change
  const onChangeimage = ({ fileList }) => {
    if (fileList.length > 1) {
      setFileList([fileList[fileList.length - 1]]);
    } else {
      setFileList(fileList);
    }
    setStoredFile(fileList[0]);
  };

  const onChangeIndImage = ({ fileList }) => {
    if (fileList.length > 1) {
      setIndImage([fileList[fileList.length - 1]]);
    } else {
      setIndImage(fileList);
    }
    console.log(fileList[0]);
  };

  // Handle image collection change
  const onChangeimagec = ({ fileList }) => {
    const maxImages = 10; // Update limit to 10

    let updatedFileList = fileList.slice(0, maxImages); // Limit to maxImages
    if (fileList.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images.`);
    }

    setFileList2(updatedFileList); // Update the state
    console.log(updatedFileList); // Log the new file list directly
  };

  const [previewOpenAddInd, setPreviewOpenAddInd] = useState(false);

  const [checkRecordId, setCheckRecordId] = useState("");
  const [checkType, setCheckType] = useState("");

  const handleAddOneImage = (recordId, type) => {
    setPreviewOpenAddInd(true);
    setCheckRecordId(recordId);
    setCheckType(type);
  };
  const submitAddIndImage = () => {
    const formData = new FormData();

    formData.append("image_id", checkRecordId);
    formData.append("type", checkType);
    if (indImage.length > 0) {
      formData.append("image", indImage[0].originFileObj || indImage[0]);
    }

    // Submit data (assuming you combine with the previous fields later)
    dispatch(ImageMiddleware.AddSingleImage(formData, token))
      .then((res) => {
        dispatch(setLoading(false));

        dispatch(ImageMiddleware.GetImages(commonData, token));
        toast.success(res?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS ADDED Single IMAGE =>", res);
        handleCloseAddModalInd();
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR ADDING Single IMAGE =>", err);
      });
  };
  // Submission function
  const submitAddImages = () => {
    // Assuming these are the expected final values
    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("variant_id", variant_id);
    if (fileList.length > 0) {
      formData.append(
        "product_single_image",
        fileList[0].originFileObj || fileList[0]
      );
    }

    fileList2.forEach((file, index) => {
      formData.append("product_multiple_images[]", file.originFileObj || file);
    });
    // Resetting new fields after submission

    // Submit data (assuming you combine with the previous fields later)
    dispatch(ImageMiddleware.AddImage(formData, token))
      .then((res) => {
        dispatch(setLoading(false));

        dispatch(ImageMiddleware.GetImages(commonData, token));
        toast.success(res?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS ADDED IMAGE =>", res);
        handleCloseAddModal();
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR ADDING IMAGE =>", err);
      });
    // handleCloseAddModal();
  };

  const columns = [
    {
      title: <p>ID</p>,
      dataIndex: "id",
      key: "id",
    },
    {
      title: <p>Image</p>,
      dataIndex: "image",
      key: "image",
      render: (image, record) => (
        <div style={{ position: "relative", display: "inline-block" }}>
          {image ? (
            <div
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.querySelector(".image-actions").style.display =
                  "flex")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.querySelector(".image-actions").style.display =
                  "none")
              }
            >
              <img
                src={image}
                alt="Product"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <div
                className="image-actions"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <DeleteOutlined
                  style={{
                    fontSize: "18px",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteImage(record.id, image, "main")}
                />
                <EyeOutlined
                  style={{
                    fontSize: "18px",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePreviewImageOnly(image)}
                />
              </div>
            </div>
          ) : (
            <button
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#e9e9e9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px dashed #ccc",
                cursor: "pointer",
              }}
              onClick={() => handleAddOneImage(record.id, "main")}
            >
              +
            </button>
          )}
        </div>
      ),
    },
    {
      title: <p>Additional Images</p>,
      dataIndex: "image_collection",
      key: "image_collection",
      render: (images, record) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {images.map((img, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                margin: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.querySelector(".image-actions").style.display =
                  "flex")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.querySelector(".image-actions").style.display =
                  "none")
              }
            >
              <img
                src={img}
                alt={`Additional ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <div
                className="image-actions"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <DeleteOutlined
                  style={{
                    fontSize: "18px",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleDeleteImage(record.id, img, "additional")
                  }
                />
                <EyeOutlined
                  style={{
                    fontSize: "18px",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePreviewImageOnly(img)}
                />
              </div>
            </div>
          ))}
          <button
            style={{
              width: "100px",
              height: "100px",
              margin: "10px",
              backgroundColor: "#e9e9e9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px dashed #ccc",
              cursor: "pointer",
            }}
            onClick={() => handleAddOneImage(record.id, "additional")}
          >
            +
          </button>
        </div>
      ),
    },
    {
      title: <p className="ant-employed fw-bold">ACTION</p>,
      render: (rowData) => (
        <div>
          <Tooltip title="delete">
            <a onClick={() => handleOpenDelete(rowData)}>
              <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
            </a>
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
            DELETE THIS IMAGE
          </h5>
        }
        open={previewOpenDeleteSingleImage}
        onOk={deleteOneProductImage} // Call delete function on OK
        okText="Delete"
        onCancel={() => setPreviewOpenDeleteSingleImage(false)} // Close modal on Cancel
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to delete this image?</h6>
      </Modal>
      {/* open image model */}
      <Modal
        open={isPreviewOpen}
        footer={null}
        onCancel={handleClosePreview}
        centered
      >
        <img
          src={previewImageOnly}
          alt="Preview"
          style={{ width: "100%", height: "auto" }}
        />
      </Modal>
      {/* create variant model */}
      <Modal
        centered
        title={
          <h5
            style={{
              margin: "0",
              fontWeight: "600",
              textAlign: "center",
              color: "white",
            }}
          >
            CREATE Image
          </h5>
        }
        open={previewOpenAdd}
        onOk={submitAddImages}
        okText="Add"
        onCancel={handleCloseAddModal}
      >
        <Card
          className="header-solid h-full"
          bordered={false}
          bodyStyle={{ paddingTop: "0" }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24} className="d-flex flex-column align-items-center">
              {/* Single Image Upload */}
              <Card className="mb-5" style={{ width: "100%" }}>
                <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Upload Single Image
                </label>
                <div className="col-lg-12">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChangeimage}
                    beforeUpload={() => false} // Prevent automatic upload
                    showUploadList={false}
                  >
                    {fileList.length === 0 ? (
                      <Button icon={<UploadOutlined />}>+ Upload</Button>
                    ) : (
                      <img
                        src={
                          fileList[0]?.url ||
                          fileList[0]?.thumbUrl ||
                          URL.createObjectURL(fileList[0].originFileObj)
                        }
                        alt="Upload Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Upload>
                  {fileList1Error && (
                    <p style={{ color: "red", margin: "10px 0 0 0" }}>
                      Image field is required!
                    </p>
                  )}
                </div>
              </Card>

              {/* Multiple Images Upload */}
              <Card style={{ width: "100%" }}>
                <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Upload Other Images
                </label>
                <div className="col-lg-12">
                  <Upload
                    listType="picture-card"
                    fileList={fileList2}
                    onChange={onChangeimagec}
                    onPreview={handlePreview}
                    showUploadList={false} // Hide default list
                    beforeUpload={() => false} // Prevent automatic upload
                  >
                    {fileList2.length < 10 && "+ Upload More"}
                  </Upload>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "nowrap", // This ensures images stay in a line without wrapping
                      overflowX: "auto", // Allows horizontal scrolling if too many images
                      marginTop: "10px",
                    }}
                  >
                    {fileList2.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "1px solid #ddd",
                        }}
                      >
                        <img
                          src={
                            file?.url ||
                            file?.thumbUrl ||
                            URL.createObjectURL(file.originFileObj)
                          }
                          alt={`Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {fileList2Error && (
                    <p style={{ color: "red", margin: "10px 0 0 0" }}>
                      Additional images are required!
                    </p>
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Preview Modal */}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Card>
      </Modal>
      {/* create ind model */}
      <Modal
        centered
        title={
          <h5
            style={{
              margin: "0",
              fontWeight: "600",
              textAlign: "center",
              color: "white",
            }}
          >
            CREATE Image
          </h5>
        }
        open={previewOpenAddInd}
        onOk={submitAddIndImage}
        okText="Add"
        onCancel={handleCloseAddModalInd}
      >
        <Card
          className="header-solid h-full"
          bordered={false}
          bodyStyle={{ paddingTop: "0" }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24} className="d-flex flex-column align-items-center">
              {/* Single Image Upload */}
              <Card className="mb-5" style={{ width: "100%" }}>
                <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Upload Single Image
                </label>
                <div className="col-lg-12">
                  <Upload
                    listType="picture-card"
                    fileList={indImage}
                    onChange={onChangeIndImage}
                    beforeUpload={() => false} // Prevent automatic upload
                    showUploadList={false}
                  >
                    {indImage.length === 0 ? (
                      <Button icon={<UploadOutlined />}>+ Upload</Button>
                    ) : (
                      <img
                        src={
                          indImage[0]?.url ||
                          indImage[0]?.thumbUrl ||
                          URL.createObjectURL(indImage[0].originFileObj)
                        }
                        alt="Upload Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Upload>
                  {fileList1Error && (
                    <p style={{ color: "red", margin: "10px 0 0 0" }}>
                      Image field is required!
                    </p>
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Preview Modal */}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Card>
      </Modal>
      {/* delete models */}
      {/* all images */}
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
            DELETE IMAGES
          </h5>
        }
        open={previewOpenDelete}
        onOk={deleteVariation}
        okText="Delete"
        onCancel={() => setPreviewOpenDelete(false)}
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to delete IMAGES!</h6>
      </Modal>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="IMAGES"
              extra={
                <div className="header-control">
                  <button
                    className="btn btn-primary"
                    onClick={handleOpenAddModal}
                  >
                    Create Image
                  </button>
                </div>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Images;
