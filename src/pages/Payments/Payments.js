import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Card,
  Typography,
  Space,
  Tooltip,
  Popconfirm,
  notification,
} from "antd";
import {
  EyeTwoTone,
  DollarCircleTwoTone,
  FilePdfOutlined,
} from "@ant-design/icons";
import apiServices from "./apiServices";
import jsPDF from "jspdf";
import "jspdf-autotable";
const { Title } = Typography;

const Payments = () => {
  const [data, setData] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await apiServices.fetchItems(
        "/stripe/getAllTransaction",
        setData,
        "payments"
      );
    } catch (error) {
      notification.error({
        message: "Failed to Load Data",
        description:
          error.message || "An error occurred while fetching payments.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const showModal = (record) => {
    setSelectedTransaction(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  const handleRefund = async (paymentIntent) => {
    try {
      await apiServices.refundTransaction("/stripe/refundTransaction", {
        payment_intent_id: paymentIntent,
      });
      apiServices.fetchItems("/stripe/getAllTransaction", setData, "payments");
    } catch (error) {
      notification.error({
        message: "Refund Failed",
        description: error?.response?.data?.message || "An error occurred.",
      });
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Payments", 14, 10);

    const columns = [
      "Customer Name",
      "Amount",
      "City",
      "State",
      "Country",
      "Created",
      "Delivery Address",
      "Order Number",
      "Phone",
      "Status",
    ];
    const rows = data.map((item) => [
      item.metadata.customer_name,
      `$${(item.amount / 100).toFixed(2)}`,
      item.billing_details.address.city,
      item.billing_details.address.state,
      item.billing_details.address.country,
      formatDate(item.created),
      item.metadata.delivery_address,
      item.metadata.order_number,
      item.metadata.phone,
      item.status,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("payments.pdf");
  };
  const columns = [
    {
      title: "Customer Name",
      dataIndex: ["metadata", "customer_name"],
      key: "customer_name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${(amount / 100).toFixed(2)}`,
    },
    {
      title: "City",
      dataIndex: ["billing_details", "address", "city"],
      key: "city",
    },
    {
      title: "State",
      dataIndex: ["billing_details", "address", "state"],
      key: "state",
    },
    {
      title: "Country",
      dataIndex: ["billing_details", "address", "country"],
      key: "country",
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      render: (created) => formatDate(created),
    },
    {
      title: "Delivery Address",
      dataIndex: ["metadata", "delivery_address"],
      key: "delivery_address",
    },
    {
      title: "Order Number",
      dataIndex: ["metadata", "order_number"],
      key: "order_number",
    },
    {
      title: "Phone",
      dataIndex: ["metadata", "phone"],
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeTwoTone />}
              onClick={() => showModal(record)}
            >
              View
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to refund this transaction?"
            onConfirm={() => handleRefund(record.payment_intent)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Refund">
              <Button
                type="link"
                icon={<DollarCircleTwoTone twoToneColor="red" />}
                danger
              >
                Refund
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Title level={3} style={{ marginBottom: 0 }}>
            Payments
          </Title>
          <Button
            type="primary"
            icon={<FilePdfOutlined style={{ color: "black" }} />}
            onClick={downloadPDF}
          >
            Download
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
        />

        <Modal
          title="Transaction Details"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              Close
            </Button>,
          ]}
          confirmLoading={isModalLoading}
        >
          {selectedTransaction && (
            <div>
              <p>
                <b>Customer Name:</b>{" "}
                {selectedTransaction.metadata.customer_name}
              </p>
              <p>
                <b>Amount:</b> ${(selectedTransaction.amount / 100).toFixed(2)}
              </p>
              <p>
                <b>City:</b> {selectedTransaction.billing_details.address.city}
              </p>
              <p>
                <b>State:</b>{" "}
                {selectedTransaction.billing_details.address.state}
              </p>
              <p>
                <b>Country:</b>{" "}
                {selectedTransaction.billing_details.address.country}
              </p>
              <p>
                <b>Created:</b> {formatDate(selectedTransaction.created)}
              </p>
              <p>
                <b>Delivery Address:</b>{" "}
                {selectedTransaction.metadata.delivery_address}
              </p>
              <p>
                <b>Order Number:</b> {selectedTransaction.metadata.order_number}
              </p>
              <p>
                <b>Phone:</b> {selectedTransaction.metadata.phone}
              </p>
              <p>
                <b>Status:</b> {selectedTransaction.status}
              </p>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default Payments;
