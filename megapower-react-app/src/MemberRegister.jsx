import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Select, DatePicker, message, Input, Form, Card, Steps, Row, Col, Progress } from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  ManOutlined, 
  WomanOutlined,
  MailOutlined, 
  PhoneOutlined, 
  ColumnHeightOutlined, 
  DashboardOutlined, 
  LockOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  TrophyOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import './MemberRegister.css';

const { Option } = Select;
const { Step } = Steps;

export const MemberRegister = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [selectedPackage, setSelectedPackage] = useState('');
  const navigate = useNavigate();

  const packageOptions = [
    { 
      value: 'Silver', 
      label: 'Silver Package', 
      price: '₹5,000/month',
      icon: <TrophyOutlined />,
      features: ['Basic gym access', 'All equipment', 'Locker facility']
    },
    { 
      value: 'Gold', 
      label: 'Gold Package', 
      price: '₹14,000/3 months',
      icon: <TrophyOutlined />,
      features: ['All Silver features', 'Personal trainer (2x/week)', 'Nutrition guidance']
    },
    { 
      value: 'Premium', 
      label: 'Premium Package', 
      price: '₹25,000/6 months',
      icon: <CrownOutlined />,
      features: ['All Gold features', 'Personal trainer (4x/week)', 'Group classes', 'Custom nutrition plan']
    },
    { 
      value: 'Platinum', 
      label: 'Platinum Package', 
      price: '₹45,000/year',
      icon: <CrownOutlined />,
      features: ['All Premium features', 'Priority booking', 'Guest passes (4/year)', 'Premium locker']
    }
  ];

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please enter password'));
    }
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (value.length < minLength) {
      return Promise.reject(new Error(`Password must be at least ${minLength} characters long`));
    }
    if (!hasUppercase || !hasLowercase) {
      return Promise.reject(new Error('Password must contain both uppercase and lowercase letters'));
    }
    if (!hasNumber) {
      return Promise.reject(new Error('Password must contain at least one number'));
    }
    if (!hasSpecialChar) {
      return Promise.reject(new Error('Password must contain at least one special character'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    const password = form.getFieldValue('password');
    if (!value) {
      return Promise.reject(new Error('Please confirm your password'));
    }
    if (value !== password) {
      return Promise.reject(new Error('Passwords do not match'));
    }
    return Promise.resolve();
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['name', 'email', 'contact', 'dob', 'gender']);
      } else if (currentStep === 1) {
        await form.validateFields(['address', 'height', 'weight', 'package']);
      } else if (currentStep === 2) {
        await form.validateFields(['password', 'confirmPassword']);
      }
      
      const values = form.getFieldsValue();
      setFormData({ ...formData, ...values, contact: mobile });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Get all form values (accumulated from all steps)
      const allValues = form.getFieldsValue(true);
      
      // Validate all required data is present
      if (!allValues.name || !allValues.email || !mobile || !allValues.dob || 
          !allValues.gender || !allValues.address || !allValues.height || 
          !allValues.weight || !allValues.package || !allValues.password) {
        message.error('Please complete all required fields');
        setLoading(false);
        return;
      }
      
      const memberData = {
        fName: allValues.name,
        email: allValues.email,
        contact: mobile,
        address: allValues.address,
        dob: allValues.dob ? allValues.dob.format('YYYY-MM-DD') : null,
        gender: allValues.gender,
        height: parseFloat(allValues.height),
        weight: parseFloat(allValues.weight),
        package: allValues.package,
        password: allValues.password
      };

      console.log('Submitting member data:', memberData);
      console.log('Field values check:', {
        name: allValues.name,
        email: allValues.email,
        mobile: mobile,
        dob: allValues.dob,
        gender: allValues.gender,
        address: allValues.address,
        height: allValues.height,
        weight: allValues.weight,
        package: allValues.package,
        hasPassword: !!allValues.password
      });
      
      const response = await axios.post('http://localhost:5000/api/v1/member/create', memberData);
      
      if (response?.data?.code === 200) {
        message.success({
          content: 'Registration successful! Redirecting to login...',
          duration: 3,
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
        form.resetFields();
        setMobile('');
        setCurrentStep(0);
        setSelectedPackage('');
        setFormData({});
        setTimeout(() => {
          navigate('/Login');
        }, 2000);
      } else if (response?.data?.code === 400) {
        message.error({
          content: response?.data?.message || 'Registration failed',
          duration: 5
        });
      } else {
        message.error(response?.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering member:', error);
      console.error('Error response:', error.response?.data);
      console.error('Full error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        error: error.response?.data?.error,
        details: error.response?.data?.details
      });
      
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Registration failed. Please try again.';
      message.error({
        content: `Registration Error: ${errorMsg}`,
        duration: 8
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Personal Info',
      icon: <UserOutlined />
    },
    {
      title: 'Physical Details',
      icon: <DashboardOutlined />
    },
    {
      title: 'Security',
      icon: <SafetyOutlined />
    },
    {
      title: 'Complete',
      icon: <CheckCircleOutlined />
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <h3 className="step-title">
              <UserOutlined /> Personal Information
            </h3>
            <p className="step-description">Let's start with your basic information</p>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter your full name' },
                    { min: 3, message: 'Name must be at least 3 characters' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Full Name" 
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Email Address" 
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="contact"
                  rules={[
                    { required: true, message: 'Please enter your mobile number' },
                    { 
                      validator: (_, value) => {
                        if (mobile && mobile.length >= 10) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Please enter a valid mobile number'));
                      }
                    }
                  ]}
                >
                  <div className="phone-input-wrapper">
                    <PhoneOutlined className="phone-prefix-icon" />
                    <PhoneInput
                      country={'lk'}
                      value={mobile}
                      onChange={(phone) => setMobile(phone)}
                      placeholder="Mobile Number"
                      containerClass="register-phone-container"
                      inputClass="register-phone-input"
                    />
                  </div>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="dob"
                  rules={[
                    { required: true, message: 'Please select your date of birth' }
                  ]}
                >
                  <DatePicker 
                    placeholder="Date of Birth"
                    size="large"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => current && current > moment()}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  rules={[{ required: true, message: 'Please select your gender' }]}
                >
                  <Select placeholder="Select Gender" size="large">
                    <Option value="Male">
                      <ManOutlined /> Male
                    </Option>
                    <Option value="Female">
                      <WomanOutlined /> Female
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">
              <DashboardOutlined /> Physical Details & Membership
            </h3>
            <p className="step-description">Help us personalize your fitness journey</p>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="address"
                  rules={[
                    { required: true, message: 'Please enter your address' },
                    { min: 5, message: 'Address must be at least 5 characters' }
                  ]}
                >
                  <Input.TextArea 
                    prefix={<HomeOutlined />}
                    placeholder="Home Address" 
                    rows={3}
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="height"
                  rules={[
                    { required: true, message: 'Please enter your height' },
                    {
                      validator: (_, value) => {
                        if (value && (value < 100 || value > 250)) {
                          return Promise.reject(new Error('Height must be between 100-250 cm'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    prefix={<ColumnHeightOutlined />}
                    suffix="cm"
                    placeholder="Height"
                    type="number"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="weight"
                  rules={[
                    { required: true, message: 'Please enter your weight' },
                    {
                      validator: (_, value) => {
                        if (value && (value < 30 || value > 300)) {
                          return Promise.reject(new Error('Weight must be between 30-300 kg'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    prefix={<DashboardOutlined />}
                    suffix="kg"
                    placeholder="Weight"
                    type="number"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <label className="package-label">Select Your Membership Package</label>
                <Form.Item
                  name="package"
                  rules={[{ required: true, message: 'Please select a membership package' }]}
                >
                  <div className="package-grid">
                    {packageOptions.map((pkg) => (
                      <Card
                        key={pkg.value}
                        className={`package-card ${selectedPackage === pkg.value ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedPackage(pkg.value);
                          form.setFieldsValue({ package: pkg.value });
                        }}
                        hoverable
                      >
                        <div className="package-icon">{pkg.icon}</div>
                        <h4 className="package-name">{pkg.label}</h4>
                        <p className="package-price">{pkg.price}</p>
                        <ul className="package-features">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx}>
                              <CheckCircleOutlined /> {feature}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">
              <SafetyOutlined /> Secure Your Account
            </h3>
            <p className="step-description">Create a strong password to protect your account</p>

            <div className="password-requirements">
              <p><strong>Password Requirements:</strong></p>
              <ul>
                <li>At least 6 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character (!@#$%^&*)</li>
              </ul>
            </div>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="password"
                  rules={[{ validator: validatePassword }]}
                  hasFeedback
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Create Password" 
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[{ validator: validateConfirmPassword }]}
                  hasFeedback
                >
                  <Input.Password 
                    prefix={<SafetyOutlined />} 
                    placeholder="Confirm Password" 
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 3:
        return (
          <div className="step-content success-content">
            <div className="success-icon">
              <CheckCircleOutlined />
            </div>
            <h3 className="success-title">Ready to Join Mega Power Gym!</h3>
            <p className="success-description">
              Review your information and complete your registration
            </p>

            <div className="summary-card">
              <h4>Registration Summary</h4>
              <div className="summary-item">
                <span className="summary-label">Name:</span>
                <span className="summary-value">{form.getFieldValue('name')}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Email:</span>
                <span className="summary-value">{form.getFieldValue('email')}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Mobile:</span>
                <span className="summary-value">+{mobile}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Package:</span>
                <span className="summary-value">
                  {packageOptions.find(p => p.value === form.getFieldValue('package'))?.label}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Gender:</span>
                <span className="summary-value">{form.getFieldValue('gender')}</span>
              </div>
            </div>

            <div className="terms-notice">
              <p>By clicking "Complete Registration", you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <div className="member-register-page">
      <div className="register-container">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/Login')}
          className="back-to-login-btn"
        >
          Back to Login
        </Button>

        <Card className="register-card">
          <div className="register-header">
            <div className="gym-logo">💪</div>
            <h1>Join Mega Power Gym</h1>
            <p>Transform Your Body, Transform Your Life</p>
            <Progress 
              percent={getProgress()} 
              showInfo={false} 
              strokeColor={{
                from: '#667eea',
                to: '#764ba2',
              }}
              className="register-progress"
            />
          </div>

          <Steps current={currentStep} className="register-steps">
            {steps.map((step, index) => (
              <Step key={index} title={step.title} icon={step.icon} />
            ))}
          </Steps>

          <Form
            form={form}
            layout="vertical"
            className="register-form"
          >
            {renderStepContent()}

            <div className="form-actions">
              {currentStep > 0 && currentStep < 3 && (
                <Button 
                  size="large" 
                  onClick={handlePrevious}
                  className="prev-btn"
                >
                  Previous
                </Button>
              )}

              {currentStep < 3 && (
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleNext}
                  className="next-btn"
                >
                  {currentStep === 2 ? 'Review' : 'Next'}
                </Button>
              )}

              {currentStep === 3 && (
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleSubmit}
                  loading={loading}
                  className="submit-btn"
                  icon={<CheckCircleOutlined />}
                >
                  Complete Registration
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default MemberRegister;
