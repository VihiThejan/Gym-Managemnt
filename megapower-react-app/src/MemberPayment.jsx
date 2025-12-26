import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Button, Select, message, Form, Input,
  Card, Layout, Menu, Avatar, Typography, Row, Col, Divider, Space, Dropdown,
  Steps, Radio, Descriptions, Badge, Spin, Alert, Table, Upload
} from 'antd';
import {
  SaveOutlined, DollarOutlined, UserOutlined,
  CalendarOutlined, CreditCardOutlined, CheckCircleOutlined,
  CloseCircleOutlined, GiftOutlined, MenuUnfoldOutlined, MenuFoldOutlined,
  LogoutOutlined, DashboardOutlined, NotificationOutlined, MessageOutlined,
  StarOutlined, ScheduleOutlined, CommentOutlined, HistoryOutlined,
  BankOutlined, WalletOutlined, SafetyOutlined, InfoCircleOutlined,
  TrophyOutlined, UploadOutlined
} from '@ant-design/icons';
import Logo from './components/Logo';
import './MemberPayment.css';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51QtmecJf7sJP9Ed7zp9Yn6oCt25TDBKPKlHkkDxbMtXySgptOR9LA8GjP0eYxLXJ59essWPwkDo9VSKE9UNkOXV000FCFBZhkj');

const items = [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/MemberDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '2', path: '/MemberProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/MemberPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '4', path: '/MemberAnnouncements' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '5', path: '/MemberAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '6', path: '/MemberAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '7', path: '/chat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '8', path: '/Trainerrate' },
  { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '9', path: '/WorkoutTracker' },
];

const packageOptions = [
  {
    value: "Gold",
    label: "🥇 Gold Package",
    price: 12000,
    id: 1,
    features: ["All equipment access", "Personal trainer", "Nutrition plan", "Priority booking"]
  },
  {
    value: "Silver",
    label: "🥈 Silver Package",
    price: 8000,
    id: 2,
    features: ["All equipment access", "Group classes", "Locker facility"]
  },
  {
    value: "Bronze",
    label: "🥉 Bronze Package",
    price: 5000,
    id: 3,
    features: ["Basic equipment access", "Locker facility"]
  },
];

// Stripe Card Form Component
const StripeCardForm = ({ amount, memberId, selectedPackage, packageOptions, onSuccess, onError, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!stripe || !elements) {
      message.error("Stripe is not loaded yet. Please wait.");
      return;
    }

    if (processing) {
      return; // Prevent multiple submissions
    }

    setProcessing(true);

    try {
      // Create payment intent
      const packageData = packageOptions.find(p => p.value === selectedPackage);
      const packageId = packageData ? packageData.id : 1;

      console.log('🔄 Creating payment intent...', { amount, memberId, packageId });

      const response = await axios.post("http://localhost:5000/api/v1/payment/create-payment-intent", {
        amount: amount,
        memberId: parseInt(memberId),
        packageId: packageId,
        currency: 'lkr'
      });

      const { clientSecret } = response.data;
      console.log('✅ Payment intent created, confirming payment...');

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        console.error('❌ Payment error:', error);
        message.error(error.message);
        setProcessing(false);
        if (onError) onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('🎉 Payment succeeded!', paymentIntent);
        message.success("Payment Successful!", 2);

        // Keep processing state true while transitioning
        if (onSuccess) onSuccess();

      } else {
        console.warn('⚠️ Unexpected payment status:', paymentIntent?.status);
        message.warning('Payment status unclear. Please check your payment history.');
        setProcessing(false);
      }
    } catch (error) {
      console.error("❌ Stripe payment error:", error);
      message.error(error.response?.data?.message || "Payment failed. Please try again.");
      setProcessing(false);
      if (onError) onError(error);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        padding: '20px',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        marginBottom: '20px',
        background: '#fafafa'
      }}>
        <div style={{ marginBottom: '12px', fontWeight: 600, fontSize: '14px' }}>
          <CreditCardOutlined /> Card Information
        </div>
        <div style={{
          padding: '12px',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          background: 'white'
        }}>
          <CardElement options={cardElementOptions} />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          Your card details are secure and encrypted
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        loading={processing}
        disabled={!stripe || processing}
        className="pay-btn"
        icon={<CreditCardOutlined />}
        block
        onClick={(e) => {
          console.log('💳 Pay button clicked');
          handleStripeSubmit(e);
        }}
      >
        {processing ? 'Processing Payment...' : `Pay Rs. ${amount.toLocaleString()}`}
      </Button>

      {!stripe && (
        <div style={{ marginTop: '12px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
          <Spin size="small" /> Loading payment system...
        </div>
      )}
    </div>
  );
};

export const MemberPayment = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  // Get member ID and data from localStorage
  const getLoginData = () => {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsedData = JSON.parse(loginData);
        return {
          memberId: parsedData.Member_Id || null,
          memberName: parsedData.FName || ''
        };
      }
      return { memberId: null, memberName: '' };
    } catch (error) {
      return { memberId: null, memberName: '' };
    }
  };

  const { memberId, memberName } = getLoginData();

  // State variables
  const [selectedPackage, setSelectedPackage] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!memberId) {
      message.error('No member ID found. Please login again.');
      navigate('/');
      return;
    }
    fetchMemberData();
    fetchPaymentHistory();
  }, [memberId]);



  const fetchMemberData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/v1/member/${memberId}`);
      const member = response.data.data;
      setMemberData(member);
      setSelectedPackage(member.Package || '');

      // Set amount based on current package
      const pkg = packageOptions.find(p => p.value === member.Package);
      if (pkg) {
        setAmount(pkg.price);
      }

      setLoading(false);
    } catch (error) {
      console.error(`Error fetching member data: ${error.message}`);
      message.error('Failed to load your information');
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await axios.get('http://localhost:5000/api/v1/payment/list');
      const allPayments = response.data?.data || [];

      // Filter payments for current member
      const memberPayments = allPayments.filter(
        payment => payment.memberid === parseInt(memberId)
      );

      setPaymentHistory(memberPayments);
      setLoadingHistory(false);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setLoadingHistory(false);
    }
  };

  const handlePackageChange = (value) => {
    setSelectedPackage(value);
    const pkg = packageOptions.find(p => p.value === value);
    if (pkg) {
      setAmount(pkg.price);
    }
  };

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success('Logged out successfully');
    navigate('/');
  };

  const nextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(() => {
      message.error('Please complete all required fields');
    });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };



  const savePaymentToDatabase = async (orderId, status) => {
    // Get package ID from package name
    const packageData = packageOptions.find(p => p.value === selectedPackage);
    const packageId = packageData ? packageData.id : 1; // Default to 1 if not found

    const body = {
      memberId: parseInt(memberId),
      packageId: packageId,
      amount: amount,
      date: new Date().toISOString(),
      orderId: orderId,
      status: status
    };

    try {
      const res = await axios.post("http://localhost:5000/api/v1/payment/create", body);
      return res.data;
    } catch (error) {
      console.error("Error saving payment:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedPackage || !amount) {
      message.error("Please select a package and amount.");
      return;
    }

    // Validate bank transfer requires slip upload
    if (paymentMethod === 'bank' && fileList.length === 0) {
      message.error("Please upload payment slip for bank transfer.");
      return;
    }

    setSubmitting(true);

    try {
      if (paymentMethod === 'stripe') {
        // Stripe payment will be handled by StripeCardForm component
        // This just prevents the form from submitting here
        setSubmitting(false);
        return;
      } else {
        // For bank transfer or cash, save to database
        const packageId = packageOptions.find(p => p.value === selectedPackage)?.id;

        const formData = new FormData();
        formData.append('memberId', memberId);
        formData.append('packageId', packageId);
        formData.append('amount', amount);
        formData.append('date', new Date().toISOString());
        formData.append('paymentMethod', paymentMethod);

        // Add payment slip if bank transfer
        if (paymentMethod === 'bank' && fileList.length > 0) {
          formData.append('paymentSlip', fileList[0].originFileObj);
        }

        await axios.post("http://localhost:5000/api/v1/payment/create", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        message.success("Payment request submitted successfully!");

        setFileList([]); // Clear uploaded file
        fetchPaymentHistory();
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      message.error(error.response?.data?.message || "Failed to process payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedPackage(memberData?.Package || '');
    const pkg = packageOptions.find(p => p.value === memberData?.Package);
    if (pkg) {
      setAmount(pkg.price);
    }
    setPaymentMethod('stripe');
  };

  const paymentHistoryColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Package',
      dataIndex: 'packageid',
      key: 'packageid',
      render: (pkg) => (
        <Badge
          color={pkg === 'Gold' ? 'gold' : pkg === 'Silver' ? 'silver' : 'bronze'}
          text={pkg}
        />
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `Rs. ${parseFloat(amount).toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'error'}
          text={status || 'Completed'}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <Layout hasSider>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          width={250}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
          }}
          className="dashboard-sider"
        >
          <div className="logo-container">
            <Logo size="small" showText={!collapsed} variant="white" />
          </div>
        </Sider>
        <Layout className="main-layout" style={{ marginInlineStart: collapsed ? 80 : 250 }}>
          <Content className="loading-content">
            <Card className="loading-card">
              <Space direction="vertical" size="large" align="center">
                <Spin size="large" />
                <Title level={4}>Loading payment information...</Title>
              </Space>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout hasSider className="member-payment-layout">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
        }}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={['3']}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'rgba(102, 126, 234, 0.1)'
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <MenuFoldOutlined style={{ fontSize: '20px', color: 'white' }} />
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout className="main-layout" style={{ marginInlineStart: collapsed ? 80 : 250 }}>
        {/* Header */}
        <Header className="payment-header">
          <Space size="large">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="menu-toggle-btn"
            />
            <Title level={4} className="page-title">
              <DollarOutlined className="page-title-icon" />
              Payment
            </Title>
          </Space>

          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/MemberProfile')}>
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
                className="user-avatar"
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content className="payment-content">
          <div className="content-container">
            {/* Payment Steps */}
            <Card className="steps-card">
              <Steps current={currentStep} className="payment-steps">
                <Step title="Select Package" icon={<GiftOutlined />} />
                <Step title="Payment Method" icon={<CreditCardOutlined />} />
                <Step title="Complete" icon={<CheckCircleOutlined />} />
              </Steps>
            </Card>

            <Row gutter={24}>
              <Col xs={24} lg={16}>
                {/* Step 0: Package Selection */}
                {currentStep === 0 && (
                  <Card className="payment-card">
                    <div className="card-header">
                      <Title level={3} className="card-title">
                        <GiftOutlined /> Select Membership Package
                      </Title>
                      <Text className="card-subtitle">
                        Choose the package that best fits your fitness goals
                      </Text>
                    </div>

                    <Form layout="vertical" form={form}>
                      <Alert
                        message="Current Package"
                        description={
                          <span>
                            You are currently enrolled in <strong>{memberData?.Package || 'No Package'}</strong> package
                          </span>
                        }
                        type="info"
                        showIcon
                        style={{ marginBottom: 24 }}
                      />

                      <Form.Item
                        label={<span className="form-label"><GiftOutlined /> Membership Package</span>}
                        name="package"
                        rules={[{ required: true, message: 'Please select a package' }]}
                        initialValue={selectedPackage}
                      >
                        <Radio.Group
                          onChange={(e) => handlePackageChange(e.target.value)}
                          value={selectedPackage}
                          className="package-radio-group"
                        >
                          <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {packageOptions.map((pkg) => (
                              <Card
                                key={pkg.value}
                                className={`package-card ${selectedPackage === pkg.value ? 'selected' : ''}`}
                                hoverable
                              >
                                <div className="package-card-wrapper">
                                  <Radio value={pkg.value} className="package-radio" />
                                  <div className="package-content">
                                    <div className="package-header">
                                      <div className="package-info">
                                        <Title level={4} className="package-title">
                                          {pkg.label}
                                        </Title>
                                        <Title level={3} className="package-price">
                                          Rs. {pkg.price.toLocaleString()}
                                          <Text className="package-period">/month</Text>
                                        </Title>
                                      </div>
                                      {selectedPackage === pkg.value && (
                                        <CheckCircleOutlined className="selected-icon" />
                                      )}
                                    </div>
                                    <Divider />
                                    <div className="package-features">
                                      {pkg.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                          <CheckCircleOutlined className="feature-icon" />
                                          <Text>{feature}</Text>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </Space>
                        </Radio.Group>
                      </Form.Item>

                      <div className="form-actions">
                        <Button
                          type="primary"
                          size="large"
                          onClick={nextStep}
                          className="next-btn"
                          icon={<SaveOutlined />}
                          block
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </Form>
                  </Card>
                )}

                {/* Step 1: Payment Method */}
                {currentStep === 1 && (
                  <Card className="payment-card">
                    <div className="card-header">
                      <Title level={3} className="card-title">
                        <CreditCardOutlined /> Choose Payment Method
                      </Title>
                      <Text className="card-subtitle">
                        Select your preferred payment method
                      </Text>
                    </div>

                    <Form layout="vertical">
                      <Alert
                        message="Payment Summary"
                        description={
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Package">
                              <strong>{selectedPackage} Package</strong>
                            </Descriptions.Item>
                            <Descriptions.Item label="Amount">
                              <strong style={{ fontSize: 18, color: '#52c41a' }}>
                                Rs. {amount.toLocaleString()}
                              </strong>
                            </Descriptions.Item>
                          </Descriptions>
                        }
                        type="success"
                        showIcon
                        style={{ marginBottom: 24 }}
                      />

                      <Form.Item
                        label={<span className="form-label"><WalletOutlined /> Payment Method</span>}
                      >
                        <Radio.Group
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          value={paymentMethod}
                          style={{ width: '100%', display: 'block' }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                            <div
                              onClick={() => setPaymentMethod('stripe')}
                              style={{
                                border: paymentMethod === 'stripe' ? '2px solid #667eea' : '2px solid #e8e8e8',
                                borderRadius: '12px',
                                padding: '16px',
                                cursor: 'pointer',
                                background: paymentMethod === 'stripe' ? 'rgba(102, 126, 234, 0.05)' : '#fff',
                                width: '100%'
                              }}
                            >
                              <table style={{ width: '100%' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ width: '40px', verticalAlign: 'middle' }}>
                                      <Radio value="stripe" />
                                    </td>
                                    <td style={{ width: '50px', verticalAlign: 'middle' }}>
                                      <CreditCardOutlined style={{ fontSize: '32px', color: '#667eea' }} />
                                    </td>
                                    <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Stripe Payment Gateway</div>
                                      <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
                                        Credit/Debit Card, Online Banking
                                      </div>
                                    </td>
                                    <td style={{ width: '120px', verticalAlign: 'middle', textAlign: 'right' }}>
                                      <Badge status="success" text="Recommended" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div
                              onClick={() => setPaymentMethod('bank')}
                              style={{
                                border: paymentMethod === 'bank' ? '2px solid #667eea' : '2px solid #e8e8e8',
                                borderRadius: '12px',
                                padding: '16px',
                                cursor: 'pointer',
                                background: paymentMethod === 'bank' ? 'rgba(102, 126, 234, 0.05)' : '#fff',
                                width: '100%'
                              }}
                            >
                              <table style={{ width: '100%' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ width: '40px', verticalAlign: 'middle' }}>
                                      <Radio value="bank" />
                                    </td>
                                    <td style={{ width: '50px', verticalAlign: 'middle' }}>
                                      <BankOutlined style={{ fontSize: '32px', color: '#667eea' }} />
                                    </td>
                                    <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Bank Transfer</div>
                                      <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
                                        Direct bank deposit
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div
                              onClick={() => setPaymentMethod('cash')}
                              style={{
                                border: paymentMethod === 'cash' ? '2px solid #667eea' : '2px solid #e8e8e8',
                                borderRadius: '12px',
                                padding: '16px',
                                cursor: 'pointer',
                                background: paymentMethod === 'cash' ? 'rgba(102, 126, 234, 0.05)' : '#fff',
                                width: '100%'
                              }}
                            >
                              <table style={{ width: '100%' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ width: '40px', verticalAlign: 'middle' }}>
                                      <Radio value="cash" />
                                    </td>
                                    <td style={{ width: '50px', verticalAlign: 'middle' }}>
                                      <WalletOutlined style={{ fontSize: '32px', color: '#667eea' }} />
                                    </td>
                                    <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Pay at Counter</div>
                                      <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
                                        Cash payment at gym counter
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </Radio.Group>
                      </Form.Item>

                      {paymentMethod === 'bank' && (
                        <Form.Item
                          label={
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>
                              <UploadOutlined /> Upload Payment Slip
                            </span>
                          }
                          required
                          style={{ marginTop: 24 }}
                        >
                          <Upload
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                            maxCount={1}
                            accept="image/*,.pdf"
                            listType="picture-card"
                          >
                            {fileList.length === 0 && (
                              <div>
                                <UploadOutlined style={{ fontSize: '32px', color: '#667eea' }} />
                                <div style={{ marginTop: 8 }}>Upload Slip</div>
                              </div>
                            )}
                          </Upload>
                          <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                            Upload your bank transfer receipt (JPG, PNG, or PDF - Max 5MB)
                          </div>
                        </Form.Item>
                      )}

                      {paymentMethod === 'stripe' && (
                        <div style={{ marginTop: 24 }}>
                          <Elements stripe={stripePromise}>
                            <StripeCardForm
                              amount={amount}
                              memberId={memberId}
                              selectedPackage={selectedPackage}
                              packageOptions={packageOptions}
                              navigate={navigate}
                              onSuccess={() => {
                                fetchPaymentHistory();
                                setCurrentStep(2);
                              }}
                              onError={(error) => {
                                console.error('Payment error:', error);
                              }}
                            />
                          </Elements>
                        </div>
                      )}

                      <Divider />

                      <Alert
                        message="Secure Payment"
                        description="Your payment information is encrypted and secure. We never store your card details."
                        type="info"
                        showIcon
                        icon={<SafetyOutlined />}
                        style={{ marginBottom: 24 }}
                      />

                      {paymentMethod !== 'stripe' && (
                        <Form.Item className="form-actions">
                          <Space size="middle">
                            <Button
                              size="large"
                              onClick={prevStep}
                              icon={<CloseCircleOutlined />}
                            >
                              Back
                            </Button>
                            <Button
                              type="primary"
                              size="large"
                              onClick={handleSubmit}
                              loading={submitting}
                              className="pay-btn"
                              icon={<CreditCardOutlined />}
                            >
                              Submit Request
                            </Button>
                          </Space>
                        </Form.Item>
                      )}

                      {paymentMethod === 'stripe' && (
                        <Form.Item className="form-actions">
                          <Button
                            size="large"
                            onClick={prevStep}
                            icon={<CloseCircleOutlined />}
                          >
                            Back
                          </Button>
                        </Form.Item>
                      )}
                    </Form>
                  </Card>
                )}

                {/* Step 2: Success */}
                {currentStep === 2 && (
                  <Card className="payment-card success-card" style={{
                    animation: 'fadeIn 0.6s ease-in',
                    border: '2px solid #52c41a'
                  }}>
                    <div className="success-content" style={{
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                      borderRadius: '12px',
                      padding: '60px 40px'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        animation: 'scaleIn 0.5s ease-out',
                        boxShadow: '0 10px 40px rgba(82, 196, 26, 0.3)'
                      }}>
                        <CheckCircleOutlined style={{
                          fontSize: '72px',
                          color: '#fff'
                        }} />
                      </div>

                      <Title level={2} style={{
                        color: '#1a1f3a',
                        marginBottom: '16px',
                        fontSize: '36px',
                        fontWeight: 700
                      }}>
                        🎉 Payment Successful!
                      </Title>

                      <Paragraph style={{
                        fontSize: '18px',
                        color: 'rgba(0, 0, 0, 0.65)',
                        marginBottom: '40px',
                        lineHeight: 1.8
                      }}>
                        Thank you! Your payment has been processed successfully.<br />
                        Your <strong>{selectedPackage}</strong> membership has been activated.
                      </Paragraph>

                      <Descriptions
                        bordered
                        column={1}
                        style={{
                          margin: '32px auto',
                          maxWidth: '600px',
                          textAlign: 'left',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: '#fff'
                        }}
                      >
                        <Descriptions.Item
                          label={<span style={{ fontWeight: 600, fontSize: '15px' }}>📦 Package</span>}
                        >
                          <strong style={{ fontSize: '15px' }}>{selectedPackage} Package</strong>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={<span style={{ fontWeight: 600, fontSize: '15px' }}>💰 Amount Paid</span>}
                        >
                          <strong style={{ color: '#52c41a', fontSize: '20px', fontWeight: 700 }}>
                            Rs. {amount.toLocaleString()}
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={<span style={{ fontWeight: 600, fontSize: '15px' }}>📅 Date</span>}
                        >
                          <span style={{ fontSize: '15px' }}>{moment().format('MMMM DD, YYYY [at] hh:mm A')}</span>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={<span style={{ fontWeight: 600, fontSize: '15px' }}>✅ Status</span>}
                        >
                          <Badge
                            status="success"
                            text={<span style={{ fontSize: '15px', fontWeight: 600 }}>Completed</span>}
                          />
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={<span style={{ fontWeight: 600, fontSize: '15px' }}>💳 Payment Method</span>}
                        >
                          <span style={{ fontSize: '15px' }}>{paymentMethod === 'stripe' ? 'Stripe (Card Payment)' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash Payment'}</span>
                        </Descriptions.Item>
                      </Descriptions>

                      <Alert
                        message="🎯 What's Next?"
                        description={
                          <div style={{ fontSize: '14px', lineHeight: 1.8 }}>
                            • Your membership is now active<br />
                            • Check your email for payment receipt<br />
                            • Start enjoying all the benefits of your {selectedPackage} package<br />
                            • Visit the gym and show your membership ID
                          </div>
                        }
                        type="info"
                        showIcon
                        style={{
                          marginTop: '32px',
                          borderRadius: '8px',
                          border: '1px solid #91d5ff'
                        }}
                      />

                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                        marginTop: '40px'
                      }}>
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => navigate('/MemberDashboard')}
                          icon={<DashboardOutlined />}
                          style={{
                            height: '52px',
                            padding: '0 40px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '16px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                          }}
                        >
                          Go to Dashboard
                        </Button>
                        <Button
                          size="large"
                          onClick={resetForm}
                          icon={<SaveOutlined />}
                          style={{
                            height: '52px',
                            padding: '0 40px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '16px',
                            borderColor: '#667eea',
                            color: '#667eea'
                          }}
                        >
                          Make Another Payment
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </Col>

              {/* Sidebar Info */}
              <Col xs={24} xl={8}>
                {/* Member Info Card */}
                <Card className="info-card" title={<><UserOutlined /> Your Information</>}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">{memberData?.FName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{memberData?.Email}</Descriptions.Item>
                    <Descriptions.Item label="Current Package">
                      <Badge
                        color={memberData?.Package === 'Gold' ? 'gold' : memberData?.Package === 'Silver' ? 'silver' : 'bronze'}
                        text={memberData?.Package || 'None'}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Payment Info Card */}
                <Card className="info-card" title={<><InfoCircleOutlined /> Important Information</>}>
                  <Space direction="vertical" size="small">
                    <Text>💳 Secure payment gateway</Text>
                    <Text>✅ Instant membership activation</Text>
                    <Text>📧 Email receipt</Text>
                    <Text>🔄 Easy refund process</Text>
                    <Text>📞 24/7 support available</Text>
                  </Space>
                </Card>

                {/* Payment History */}
                <Card
                  className="info-card"
                  title={<><HistoryOutlined /> Payment History</>}
                  extra={
                    <Button
                      type="link"
                      size="small"
                      onClick={fetchPaymentHistory}
                    >
                      Refresh
                    </Button>
                  }
                >
                  {loadingHistory ? (
                    <Spin />
                  ) : paymentHistory.length > 0 ? (
                    <Table
                      dataSource={paymentHistory}
                      columns={paymentHistoryColumns}
                      pagination={{ pageSize: 5 }}
                      size="small"
                      rowKey="paymentid"
                    />
                  ) : (
                    <Text type="secondary">No payment history found</Text>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </Content>

        {/* Footer */}
        <Footer className="payment-footer">
          <Text type="secondary">
            Mega Power Gym & Fitness © 2025 - All Rights Reserved
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MemberPayment;
