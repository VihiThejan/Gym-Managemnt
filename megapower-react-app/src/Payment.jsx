import React, { useState, useEffect } from "react";
import { Button, DatePicker, Select, message, Input, Form, Layout, Card, InputNumber, Upload, Radio } from "antd";
import { 
  DollarOutlined, 
  UserOutlined, 
  GiftOutlined, 
  CalendarOutlined,
  CreditCardOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  BankOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import AdminSidebar from './components/AdminSidebar';
import './Payment.css';
import './Dashboard.css';

const { Content } = Layout;

export const Payment = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/member/list");
      const memberData = response?.data?.data || [];
      
      const formattedMembers = memberData.map(member => ({
        value: member.Member_Id,
        label: `${member.FName} - ID: ${member.Member_Id}`,
        package: member.Package
      }));
      
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error("Failed to load members list");
    }
  };

  const packageOptions = [
    { value: 1, label: "Basic - Rs. 5,000/month", amount: 5000 },
    { value: 2, label: "Standard - Rs. 8,000/month", amount: 8000 },
    { value: 3, label: "Premium - Rs. 25,000/month", amount: 25000 }
  ];

  const handlePackageChange = (value) => {
    const selectedPackage = packageOptions.find(pkg => pkg.value === value);
    if (selectedPackage) {
      form.setFieldsValue({ amount: selectedPackage.amount });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const formattedDate = values.date ? values.date.toISOString() : new Date().toISOString();

    try {
      const formData = new FormData();
      formData.append('memberId', values.memberId);
      formData.append('packageId', values.packageId);
      formData.append('amount', values.amount);
      formData.append('date', formattedDate);
      formData.append('paymentMethod', values.paymentMethod || 'cash');

      // Add payment slip if bank transfer is selected and file is uploaded
      if (values.paymentMethod === 'bank' && fileList.length > 0) {
        formData.append('paymentSlip', fileList[0].originFileObj);
      }

      await axios.post("http://localhost:5000/api/v1/payment/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setShowSuccess(true);
      message.success("Payment added successfully!");
      
      setTimeout(() => {
        navigate("/Paymenttable");
      }, 1500);
      
    } catch (error) {
      console.error('Error creating payment:', error);
      message.error(error.response?.data?.message || "Failed to add payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/Paymenttable");
  };

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/Paymenttable" />
      <Layout style={{ marginLeft: 260 }}>
        <Content className="dashboard-content">
          <div className="payment-form-container">
            {showSuccess && (
              <div className="success-alert">
                <CheckCircleOutlined /> Payment added successfully!
              </div>
            )}
            
            <div className="form-header-section">
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleCancel}
                className="back-button"
              >
                Back
              </Button>
              <div className="header-title-section">
                <CreditCardOutlined className="header-icon" />
                <h1>Add New Payment</h1>
              </div>
            </div>

            <Card className="payment-form-card">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="payment-form"
                initialValues={{
                  date: moment()
                }}
              >
                <Form.Item
                  label={
                    <span className="input-label">
                      <UserOutlined /> Member
                    </span>
                  }
                  name="memberId"
                  rules={[{ required: true, message: 'Please select a member' }]}
                >
                  <Select
                    placeholder="Select member"
                    showSearch
                    optionFilterProp="label"
                    options={members}
                    size="large"
                    className="form-input"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="input-label">
                      <GiftOutlined /> Package
                    </span>
                  }
                  name="packageId"
                  rules={[{ required: true, message: 'Please select a package' }]}
                >
                  <Select
                    placeholder="Select package"
                    options={packageOptions}
                    onChange={handlePackageChange}
                    size="large"
                    className="form-input"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="input-label">
                      <DollarOutlined /> Amount (Rs.)
                    </span>
                  }
                  name="amount"
                  rules={[
                    { required: true, message: 'Please enter amount' },
                    { 
                      type: 'number', 
                      min: 1000, 
                      message: 'Amount must be at least Rs. 1,000' 
                    }
                  ]}
                >
                  <InputNumber
                    placeholder="Enter amount"
                    style={{ width: '100%' }}
                    size="large"
                    className="form-input"
                    min={1000}
                    max={100000}
                    formatter={value => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/Rs\.\s?|(,*)/g, '')}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="input-label">
                      <CalendarOutlined /> Payment Date
                    </span>
                  }
                  name="date"
                  rules={[{ required: true, message: 'Please select payment date' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    format="YYYY-MM-DD"
                    className="form-input"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="input-label">
                      <BankOutlined /> Payment Method
                    </span>
                  }
                  name="paymentMethod"
                  rules={[{ required: true, message: 'Please select payment method' }]}
                  initialValue="cash"
                >
                  <Radio.Group 
                    size="large"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Radio.Button value="cash">Cash</Radio.Button>
                    <Radio.Button value="bank">Bank Transfer</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                {paymentMethod === 'bank' && (
                  <Form.Item
                    label={
                      <span className="input-label">
                        <UploadOutlined /> Upload Payment Slip
                      </span>
                    }
                    name="paymentSlip"
                    rules={[
                      { required: true, message: 'Please upload payment slip for bank transfer' }
                    ]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                      if (Array.isArray(e)) {
                        return e;
                      }
                      return e?.fileList;
                    }}
                  >
                    <Upload
                      beforeUpload={() => false}
                      fileList={fileList}
                      onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                      maxCount={1}
                      accept="image/*,.pdf"
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />} size="large">
                        Click to Upload
                      </Button>
                    </Upload>
                    <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                      Accepted formats: JPG, PNG, PDF (Max size: 5MB)
                    </div>
                  </Form.Item>
                )}

                <Form.Item className="form-actions">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                    size="large"
                    className="submit-button"
                  >
                    Save Payment
                  </Button>
                  <Button
                    onClick={handleCancel}
                    size="large"
                    className="cancel-button"
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Payment;
