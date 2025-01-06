import React, { useState } from 'react';
import { Form, Input, Button, Steps, Upload, message,Tooltip, List, Modal, Select, InputNumber, Card, Typography, Col,Row } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { bandWidth, prongType, ringSize } from '../../data';

const { Step } = Steps;
const { Option } = Select;
const { Title, Text } = Typography;

const MultiStepCRUDForm = () => {

  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [items, setItems] = useState({
    shapes: prongType,
    colors: [],
    metals: [],
    widths: bandWidth
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const steps = [
    { title: 'Select Setting', fields: ['shapes', 'colors'] },
    { title: 'Customize Setting', fields: ['metals', 'widths'] },
    { title: 'Bespoke Customisations', fields: [] },
    { title: 'Gemstone', fields: [] }
  ];

  const showModal = (field) => {
    setCurrentField(field);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    setCurrentField(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const currentItems = items[currentField];
    if (editingItem !== null) {
      const updatedItems = currentItems.map((item, index) =>
        index === editingItem ? { ...item, ...values } : item
      );
      setItems({ ...items, [currentField]: updatedItems });
    } else {
      setItems({ ...items, [currentField]: [...currentItems, values] });
    }
    setIsModalVisible(false);
    setEditingItem(null);
    setCurrentField(null);
    form.resetFields();
  };

  const onEdit = (field, index) => {
    setEditingItem(index);
    setCurrentField(field);
    form.setFieldsValue(items[field][index]);
    setIsModalVisible(true);
  };

  const onDelete = (field, index) => {
    const currentItems = items[field];
    const updatedItems = currentItems.filter((_, i) => i !== index);
    setItems({ ...items, [field]: updatedItems });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const renderForm = () => {
    switch (currentField) {
      case 'shapes':
        return (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Shape Name"
              rules={[{ required: true, message: 'Please input the shape name!' }]}
            >
              <Input />
            </Form.Item>
          
            <Form.Item
              name="picture"
              label="Picture"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload an image!' }]}
            >
              <Upload
                listType="picture-card"
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item>

              
              <button className='btn btn-primary' type="primary" htmlType="submit" size="large">
                {editingItem !== null ? 'Update' : 'Add'} Shape
              </button>
            </Form.Item>
          </Form>
        );
      case 'colors':
        return (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Color Name"
              rules={[{ required: true, message: 'Please input the color name!' }]}
            >
              <Input />
            </Form.Item>
           
            <Form.Item
              name="picture"
              label="Picture"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload an image!' }]}
            >
              <Upload
                listType="picture-card"
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button   type="primary" htmlType="submit" size="large">
                {editingItem !== null ? 'Update' : 'Add'} Color
              </Button>
            </Form.Item>
          </Form>
        );
      case 'metals':
        return (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Metal Name"
              rules={[{ required: true, message: 'Please input the metal name!' }]}
            >
              <Input />
            </Form.Item>
           
            <Form.Item
              name="picture"
              label="Picture"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload an image!' }]}
            >
              <Upload
                listType="picture-card"
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                {editingItem !== null ? 'Update' : 'Add'} Metal
              </Button>
            </Form.Item>
          </Form>
        );
      case 'widths':
        return (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Width Name"
              rules={[{ required: true, message: 'Please input the width name!' }]}
            >
              <Input />
            </Form.Item>
           
           
            <Form.Item>
              <button className='ant-btn ant-btn-primary'>
                {editingItem !== null ? 'Update' : 'Add'} Width
              </button>
            </Form.Item>
          </Form>
        );
      default:
        return null;
    }
  };

  const renderList = (field) => (
    <List
      itemLayout="horizontal"
      dataSource={items[field]}
      renderItem={(item, index) => (
        <List.Item
          actions={[
            // <Button icon={<EditOutlined />} onClick={() => onEdit(field, index)}>Edit</Button>,
            <Tooltip title="edit">
            <a onClick={() =>onEdit(field, index)}>
              <EditOutlined style={{ color: "green", fontSize: "20px" }} />
            </a>
          </Tooltip>,
          <Tooltip title="delete">
          <a onClick={() => onDelete(field, index)}>
            <DeleteOutlined
              style={{ marginLeft: "15px", color: "red", fontSize: "20px" }}
            />
          </a>
        </Tooltip>,
           
          ]}
        >
  <List.Item.Meta
  title={
    <div style={{ display: 'flex', alignItems: 'center', height: 60 }}>
      <span>{item.name}</span>
    </div>
  }
  avatar={
    item.picture && item.picture[0] && (
      <div style={{ height: 60, display: 'flex', alignItems: 'center' }}>
        <img 
          src={item.picture[0].thumbUrl} 
          alt={item.name} 
          style={{ 
            width: 60, 
            height: 60, 
            objectFit: 'cover' 
          }} 
        />
      </div>
    )
  }
/>


        </List.Item>
      )}
    />
  );

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className=" ">
      <Card className="ant-card criclebox tablespace mb-24 p-2 mx-auto" bodyStyle={{ padding:"16px"  }}>
        <Steps current={currentStep} className="mb-8">
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="mt-8 mb-4" style={{marginBottom: '20px',marginTop: '16px'}}>
          {/* <Title level={2} className="mb-6">{steps[currentStep].title}</Title> */}
          {steps[currentStep].fields.map((field, index) => (
           <Card key={field} className="mb-8 ant-card criclebox tablespace p-4" style={{ width: '100%', marginBottom: '16px' }}>
           <Row className="column" justify="space-between" align="middle">
             <Col>
               <Title level={3} className="mb-4">{field.charAt(0).toUpperCase() + field.slice(1)}</Title>

             </Col>

             <Col>
               <button className='btn btn-primary' onClick={() => showModal(field)} >
                 Add {field.slice(0, -1)}
               </button>
             </Col>
           </Row>
           
           {renderList(field)}
         </Card>
         
          ))}
          <div className="mt-8" style={{width: '100%',display: 'flex', justifyContent: 'space-between' }}>
            {currentStep > 0 && (
              <button className="btn btn-outline-primary px-3" size="large" onClick={prevStep}>
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button className="btn btn-primary px-3" size="large" onClick={nextStep}>
                Next
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button className="btn btn-primary px-3"onClick={() => console.log(items)}>
                Submit
              </button>
            )}
          </div>
        </div>
      </Card>

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
          { `${editingItem !== null ? 'Edit' : 'Add'} ${currentField ? currentField.slice(0, -1) : ''}` }
        </h5>
      }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        {renderForm()}
      </Modal>
    </div>
  );
};

export default MultiStepCRUDForm;