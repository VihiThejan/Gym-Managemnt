import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, InputNumber, Select, DatePicker, message, Card, Input, Form } from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  ManOutlined, 
  WomanOutlined,
  MailOutlined, 
  PhoneOutlined, 
  GiftOutlined, 
  ColumnHeightOutlined, 
  DashboardOutlined, 
  LockOutlined, 
  UserAddOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  HeartOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Member.css';

export const Member = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

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
    if (!hasUppercase) {
      return Promise.reject(new Error('Password must contain at least one uppercase letter'));
    }
    if (!hasLowercase) {
      return Promise.reject(new Error('Password must contain at least one lowercase letter'));
    }
    if (!hasNumber) {
      return Promise.reject(new Error('Password must contain at least one number'));
    }
    if (!hasSpecialChar) {
      return Promise.reject(new Error('Password must contain at least one special character'));
    }

    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const formattedDate = values.dob ? values.dob.toISOString() : '';
    const body = {
      fName: values.name,
      dob: formattedDate,
      gender: values.gender,
      email: values.email,
      address: values.address,
      contact: mobile,
      package: values.package,
      weight: values.weight,
      height: values.height,
      password: values.password,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/member/create', body);
      console.log(res?.data?.data);
      
      setShowSuccess(true);
      message.success("Member registered successfully! Redirecting to login...");
      
      form.resetFields();
      setMobile('');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register member. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setMobile('');
    setShowSuccess(false);
  };

  return (
    <div className="member-signup-page">
      <div className="member-signup-background">
        <div className="gradient-overlay"></div>
      </div>
      
      <div className="member-signup-container">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')} 
          className="back-button"
          type="text"
        >
          Back to Login
        </Button>

        <div className="signup-content">
          <Card className="signup-card">
            <div className="card-header">
              <div className="header-icon-wrapper">
                <UserAddOutlined className="header-icon" />
              </div>
              <h2 className="card-title">Member Registration</h2>
              <p className="card-subtitle">Create a new member account</p>
            </div>

            {showSuccess && (
              <div className="success-message">
                <SafetyOutlined />
                Member registered successfully! Redirecting...
              </div>
            )}

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="signup-form"
              requiredMark={false}
              initialValues={{ gender: 'Male', package: 'Gold' }}
            >
              <div className="form-row">
                <Form.Item
                  name="name"
                  label={
                    <span className="form-label">
                      <UserOutlined className="label-icon" />
                      Full Name
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter full name' },
                    { 
                      pattern: /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/,
                      message: 'Full name must contain first and last name with uppercase starting letters'
                    }
                  ]}
                >
                  <Input
                    placeholder="Enter full name (e.g., John Doe)"
                    prefix={<UserOutlined />}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={
                    <span className="form-label">
                      <MailOutlined className="label-icon" />
                      Email Address
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input
                    placeholder="example@gmail.com"
                    prefix={<MailOutlined />}
                    size="large"
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  name="address"
                  label={
                    <span className="form-label">
                      <HomeOutlined className="label-icon" />
                      Address
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter address' },
                    { min: 10, message: 'Address must be at least 10 characters' },
                    {
                      validator: (_, value) => {
                        if (value && /[a-zA-Z]/.test(value) && /\d/.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Address must contain both letters and numbers'));
                      }
                    }
                  ]}
                >
                  <Input
                    placeholder="Enter full address"
                    prefix={<HomeOutlined />}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="dob"
                  label={
                    <span className="form-label">
                      <CalendarOutlined className="label-icon" />
                      Date of Birth
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker
                    placeholder="Select date of birth"
                    size="large"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  name="gender"
                  label={
                    <span className="form-label">
                      <UserOutlined className="label-icon" />
                      Gender
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Radio.Group size="large" className="gender-radio">
                    <Radio.Button value="Male">
                      <ManOutlined /> Male
                    </Radio.Button>
                    <Radio.Button value="Female">
                      <WomanOutlined /> Female
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="package"
                  label={
                    <span className="form-label">
                      <GiftOutlined className="label-icon" />
                      Package
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select package' }]}
                >
                  <Select
                    placeholder="Select package"
                    size="large"
                    options={[
                      { value: 'Gold', label: 'Gold (3 months)' },
                      { value: 'Platinum', label: 'Platinum (6 months - 10% off)' },
                      { value: 'Diamond', label: 'Diamond (12 months - 10% off + Free Membership)' },
                    ]}
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  name="mobile"
                  label={
                    <span className="form-label">
                      <PhoneOutlined className="label-icon" />
                      Mobile Number
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter mobile number' },
                    {
                      validator: (_, value) => {
                        const cleanedMobile = mobile.replace(/\D/g, '');
                        if (cleanedMobile.length >= 11) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Invalid mobile number'));
                      }
                    }
                  ]}
                >
                  <PhoneInput
                    country={'lk'}
                    value={mobile}
                    onChange={(phone) => setMobile(phone)}
                    inputStyle={{
                      width: '100%',
                      height: '48px',
                      fontSize: '1rem',
                      borderRadius: '12px',
                      border: '2px solid #e8e8e8'
                    }}
                    containerClass="phone-input-container"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span className="form-label">
                      <LockOutlined className="label-icon" />
                      Password
                    </span>
                  }
                  rules={[{ validator: validatePassword }]}
                >
                  <Input.Password
                    placeholder="Enter password"
                    prefix={<LockOutlined />}
                    size="large"
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  name="height"
                  label={
                    <span className="form-label">
                      <ColumnHeightOutlined className="label-icon" />
                      Height (feet)
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter height' },
                    {
                      validator: (_, value) => {
                        if (value > 0 && value <= 10) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Height must be between 0 and 10 feet'));
                      }
                    }
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={10}
                    step={0.01}
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="0.00"
                  />
                </Form.Item>

                <Form.Item
                  name="weight"
                  label={
                    <span className="form-label">
                      <DashboardOutlined className="label-icon" />
                      Weight (kg)
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Please enter weight' },
                    {
                      validator: (_, value) => {
                        if (value > 0 && value <= 200) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Weight must be between 1 and 200 kg'));
                      }
                    }
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={200}
                    step={0.1}
                    precision={2}
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="0"
                  />
                </Form.Item>
              </div>

              <Form.Item className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="submit-button"
                  icon={<UserAddOutlined />}
                  block
                >
                  {loading ? 'Creating Account...' : 'Register Member'}
                </Button>
                <Button
                  onClick={handleClear}
                  className="clear-button"
                  block
                >
                  Clear Form
                </Button>
              </Form.Item>

              <div className="login-link-wrapper">
                <p className="login-text">
                  Already have an account? 
                  <Button type="link" onClick={() => navigate('/')} className="login-link">
                    Login here
                  </Button>
                </p>
              </div>
            </Form>
          </Card>

          <Card className="info-card">
            <h3>
              <HeartOutlined /> Member Benefits
            </h3>
            <div className="info-content">
              <div className="info-item">
                <TrophyOutlined className="info-icon" />
                <div>
                  <h4>Premium Packages</h4>
                  <p>Choose from Gold, Platinum, or Diamond packages with exclusive benefits</p>
                </div>
              </div>
              <div className="info-item">
                <HeartOutlined className="info-icon" />
                <div>
                  <h4>Health Tracking</h4>
                  <p>Monitor your fitness progress with height and weight tracking</p>
                </div>
              </div>
              <div className="info-item">
                <UserOutlined className="info-icon" />
                <div>
                  <h4>Personal Profile</h4>
                  <p>Secure member account with personalized fitness journey</p>
                </div>
              </div>
              <div className="info-item">
                <SafetyOutlined className="info-icon" />
                <div>
                  <h4>Secure Access</h4>
                  <p>Your information is protected with secure password authentication</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Member;