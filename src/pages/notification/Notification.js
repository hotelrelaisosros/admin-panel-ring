import { Row, Col, Card, Table } from "antd";
import React from "react";

const Notification = () => {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];
  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="CATEGORIES"
            extra={
              <button className="btn btn-primary" 
            //   onClick={handleOpenAddModal}
              >
                Add category
              </button>
            }
          >
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                className="ant-border-space"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Notification;
