import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  List,
  Card,
  Typography,
  Space,
  Table,
  Tooltip,
  Form,
  Upload,
  Input,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { CustomizationMiddleware } from "../../store/customize/customizationMiddleware"; // Import the middleware to use fetch, create, update, and delete
import { message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { setLoading } from "../../store/common/commonSlice";
import { toast, ToastContainer } from "react-toastify";
import { CategoryMiddleware } from "../../store/category/categoryMiddleware";

const { Title } = Typography;

const Bespoke = () => {
  const dispatch = useDispatch();
  const bespoke = useSelector(
    (state) => state.customization.bespokeCustomizations
  );
  const bespoke_type = useSelector(
    (state) => state.customization.bespokeWithTypes
  );

  const [editingItem, setEditingItem] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [fileList1Error, setFileList1Error] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null); // State to track the record being deleted

  const [previewOpenDeleteSingleImage, setPreviewOpenDeleteSingleImage] =
    useState(false); // Modal visibility state

  // Fetch Bespoke Customizations when the component mounts
  useEffect(() => {
    dispatch(CustomizationMiddleware.fetchBsp());
  }, [dispatch]);

  useEffect(() => {
    if (fileList?.length === 0) {
      setFileList1Error(true);
    } else {
      setFileList1Error(false);
    }
  }, [fileList]);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (item) => {
    setEditingItem(item);
    setIsUpdateModalVisible(true);
  };

  const handleCancelBsp = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setEditingItem(null);
    setFileList([]);
    form.resetFields();
  };
  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const onCreateFinishBsp = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);

    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj || fileList[0]);
    }

    dispatch(CustomizationMiddleware.createBsp(formData))
      .then((res) => {
        dispatch(setLoading(false));

        dispatch(CustomizationMiddleware.fetchBsp());
        toast.success(res?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS ADDED Bespoke =>", res);
        handleCancelBsp();
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR ADDING Bespoke =>", err);
        handleCancelBsp();
      });
  };

  const onUpdateFinishBsp = (values) => {
    const formData = new FormData();
    console.log("VALUES =>", values);
    formData.append("name", values.name);

    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj || fileList[0]);
    }

    dispatch(CustomizationMiddleware.updateBsp(values.id, formData))
      .then((res) => {
        dispatch(setLoading(false));

        dispatch(CustomizationMiddleware.fetchBsp());
        toast.success(res?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS Updating Bespoke =>", res);
        handleCancelBsp();
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.error(err?.data?.Message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR Updating Bespoke =>", err);
        handleCancelBsp();
      });
  };

  const handleEdit = (item) => {
    showUpdateModal(item);
  };

  const handleEditType = (item) => {
    showUpdateModal(item);
  };

  const handleDeleteBsp = (recordId) => {
    setRecordToDelete(recordId); // Set the record to delete
    setPreviewOpenDeleteSingleImage(true); // Open the modal
  };

  const handleDeleteType = (recordId) => {
    setRecordToDelete(recordId); // Set the record to delete
    setPreviewOpenDeleteSingleImage(true); // Open the modal
  };

  const deleteOneProductImage = async () => {
    const id = recordToDelete;

    dispatch(CustomizationMiddleware.deleteBsp(id))
      .then((res) => {
        dispatch(setLoading(false)); // Stop loading spinner
        dispatch(CustomizationMiddleware.fetchBsp());
        toast.success(res?.data?.message, {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("SUCCESS DELETING ONE IMAGE =>", res);
        setPreviewOpenDeleteSingleImage(false);
      })
      .catch((err) => {
        dispatch(setLoading(false)); // Stop loading spinner
        dispatch(CustomizationMiddleware.fetchBsp());
        toast.error(err?.data?.message || "Failed to delete image.", {
          position: "bottom-left",
          autoClose: 2000,
        });
        console.log("ERROR DELETING ONE IMAGE =>", err);
        setPreviewOpenDeleteSingleImage(false); // Close modal on error
      });
  };

  const onChangeimage = ({ fileList }) => {
    if (fileList.length > 1) {
      setFileList([fileList[fileList.length - 1]]);
    } else {
      setFileList(fileList);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Bespoke Customization"
          style={{ width: 60, height: 60 }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <a onClick={() => handleEdit(record)}>
              <EditOutlined style={{ color: "green", fontSize: "20px" }} />
            </a>
          </Tooltip>
          <Tooltip title="Delete">
            <a onClick={() => handleDeleteBsp(record.id)}>
              <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleExpand = (expanded, record) => {
    if (expanded) {
      console.log("Expanding record ID:", record.id);
      console.log(record.id);

      dispatch(CustomizationMiddleware.fetch_bsp_type_by_bsp(record.id))
        .then((res) => {
          console.log("SUCCESS FETCHING BESPOKE TYPE =>", res);
          dispatch(setLoading(false));
          toast.success(res?.data?.message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("SUCCESS ADDED VARIATION =>", res);
        })
        .catch((err) => {
          dispatch(setLoading(false));
          toast.error(err?.data?.Message, {
            position: "bottom-left",
            autoClose: 2000,
          });
          console.log("ERROR ADDING VARIATION =>", err);
        });
    }
  };

  const subcolumns = [
    {
      title: "Types Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Type",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <a onClick={() => handleEditType(record)}>
              <EditOutlined style={{ color: "green", fontSize: "20px" }} />
            </a>
          </Tooltip>
          <Tooltip title="Delete">
            <a onClick={() => handleDeleteType(record.id)}>
              <DeleteOutlined style={{ color: "red", fontSize: "20px" }} />
            </a>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const expandedRowRender = (record) => {
    return (
      <>
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button type="primary" onClick={showCreateModal}>
            Add Type
          </Button>
        </Space>
        <Table
          columns={subcolumns}
          dataSource={bespoke_type} // Pass the subItems or other related data here
          pagination={false}
          rowKey="sub_id"
          size="small"
        />
      </>
    );
  };

  return (
    <div>
      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3>Bespoke Customizations</h3>
        <Button type="primary" onClick={showCreateModal}>
          Add Bespoke Customization
        </Button>
      </Space>

      {/* Table for Bespoke Customizations */}
      <Table
        columns={subcolumns}
        dataSource={bespoke}
        rowKey="id"
        pagination={false} // Disable pagination if needed
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => true,
          onExpand: (expanded, record) => {
            handleExpand(expanded, record);
          },
        }}
      />

      {/* Add "Type" Button for Subcolumns Table */}

      {/* <Table
        columns={columns}
        dataSource={bespoke}
        rowKey="id"
        pagination={false} // Enable pagination if needed
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => true,
          onExpand: (expanded, record) => {
            handleExpand(expanded, record);
          },
        }}
      /> */}
      {/*create bsp */}
      <Modal
        title="Add Bespoke Customization"
        open={isCreateModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onCreateFinishBsp}>
          <Form.Item
            label="Customization Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the customization name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Image" name="image" valuePropName="file">
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
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Customization
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* delte model */}
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
            DELETE VARIATIONS
          </h5>
        }
        open={previewOpenDeleteSingleImage}
        onOk={deleteOneProductImage}
        okText="Delete"
        onCancel={() => setPreviewOpenDeleteSingleImage(false)}
        okButtonProps={{ color: "red" }}
      >
        <h6>Are you sure want to delete Bespoke!</h6>
      </Modal>
      {/* Update Bespoke Customization Modal */}
      <Modal
        title="Update Bespoke Customization"
        open={isUpdateModalVisible}
        onCancel={handleCancelBsp}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onUpdateFinishBsp}
          initialValues={editingItem} // Set initial values from the selected item
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Customization Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the customization name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Image" name="image" valuePropName="file">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChangeimage}
              beforeUpload={() => false}
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
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Customization
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Bespoke;
