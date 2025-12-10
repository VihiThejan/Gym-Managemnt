import React, { useState, useEffect } from "react";
import { Button, DatePicker, Select, message, Input, Form, Layout, Card, InputNumber } from "antd";
import { 
  DollarOutlined, 
  UserOutlined, 
  GiftOutlined, 
  CalendarOutlined,
  CreditCardOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  CheckCircleOutlined
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

    const body = {
      memberId: values.memberId,
      packageId: values.packageId,
      amount: values.amount,
      date: formattedDate,
    };

    try {
      await axios.post("http://localhost:5000/api/v1/payment/create", body);
      
      setShowSuccess(true);
      message.success("Payment added successfully!");
      
      setTimeout(() => {
        navigate("/Paymenttable");
      }, 1500);
      
    } catch (error) {
      console.error('Error creating payment:', error);
      message.error("Failed to add payment. Please try again.");
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
