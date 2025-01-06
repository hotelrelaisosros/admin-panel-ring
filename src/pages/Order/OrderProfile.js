import { Button, Modal, Table, Tag, Card, Row, Col, Descriptions, Typography } from 'antd';
import { ShoppingOutlined, UserOutlined, EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const { Title } = Typography;

const OrderProfile = () => {
  const location = useLocation();
  const CollectData = location?.state?.order_products || [];
  const Customer = location?.state || {};
  const [openDetail, setOpenDetail] = useState(false);
  const [details, setDetails] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customizationData, setCustomizationData] = useState(null);

  const columns = [
    { title: 'Product Name', dataIndex: 'title', key: 'title' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal' },
    {
      title: 'Actions',
      key: 'actions', 
      render: (text, record) => {
        if (!record.customizables) return null;
        
        const hasCustomizations = Object.keys(record.customizables).length > 0 && 
          Object.values(record.customizables).some(value => value !== null);

        return hasCustomizations ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => handleCustomizationModal(record.customizables)}
          >
            The Customization
          </Button>
        ) : null;
      }
    },
  ];

  const total = CollectData.reduce((acc, item) => acc + parseFloat(item.subtotal) - parseFloat(item.discount), 0);

  const handleCustomizationModal = (customizables) => {
    setCustomizationData(customizables);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCustomizationData(null);
  };

  return (
    <div className="p-6">
      <Title level={2}>
        <ShoppingOutlined className="mr-2" />
        Order Details
      </Title>

      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          <Card title="Order Information" className="mb-4">
            <Descriptions column={1}>
              <Descriptions.Item label="Order ID">{CollectData[0]?.order_id}</Descriptions.Item>
              <Descriptions.Item label="Date">{CollectData[0]?.created_at}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24} md={12}>
          <Card title="Customer Information" className="mb-4">
            <Descriptions column={1}>
              <Descriptions.Item label={<><UserOutlined /> Name</>}>{Customer?.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{Customer?.email}</Descriptions.Item>
             
              <Descriptions.Item label="Phone">{Customer?.phone}</Descriptions.Item>
              <Descriptions.Item label="Status">
           
                <Tag color={Customer?.status === "pending" ? "#ECA52B" : Customer?.status === "delivered" ? "#28A745" : "#FF4D4F"}>{Customer?.status}</Tag>

              </Descriptions.Item>

              {/* delivery_address */}
              <Descriptions.Item label="Delivery Address">{Customer?.delivery_address}</Descriptions.Item>

            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Order Items" className="mb-4">
        <Table
          columns={columns}
          dataSource={CollectData.map((item) => ({
            key: item.id,
            title: item.products.title,
            price: item.products.price,
            qty: item.qty,
            size: item.size,
            subtotal: (parseFloat(item.subtotal) - parseFloat(item.discount)).toFixed(2),
            customizables: item.customizables,
          }))}
          pagination={false}
          rowKey="id"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>${total.toFixed(2)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Modal
        title="Product Customization"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {customizationData ? (
          <Row gutter={[16, 16]}>
            {Object.entries(customizationData).map(([key, value]) => (
              <Col span={24} key={key}>
                <Card title={key}>
                  {value ? (
                    <>
                      {value.image && (
                        <img src={value.image} alt={value.name} width="100" />
                      )}
                      <span>{value.name}</span>

                      {key==="engraved_text" && (
                        <Descriptions column={2} size="small">
                          <Descriptions.Item >{value}</Descriptions.Item>
                        </Descriptions>
                      )}
                      {key==="metal_type_karat" && (
                        <Descriptions column={2} size="small">
                          <Descriptions.Item >{value}</Descriptions.Item>
                        </Descriptions>
                      )}
                      
                      {key==="gem_stone" && (
                        <Descriptions column={2} size="small">
                          <Descriptions.Item label="Carat">{value.carat}</Descriptions.Item>
                          <Descriptions.Item label="Shape">{value.shape}</Descriptions.Item>
                          <Descriptions.Item label="Color">{value.color}</Descriptions.Item>
                          <Descriptions.Item label="Clarity">{value.clarity}</Descriptions.Item>
                          <Descriptions.Item label="Faceting">{value.faceting}</Descriptions.Item>
                          <Descriptions.Item label="Dimension">{value.dimension}</Descriptions.Item>
                          <Descriptions.Item label="Price">${value.price}</Descriptions.Item>
                        </Descriptions>
                      )}
                    </>
                  ) : (
                    <span>No customization available</span>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No customizations available.</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderProfile;
