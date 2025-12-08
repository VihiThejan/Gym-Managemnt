import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, InputNumber, Select, DatePicker, message, Input, Form } from 'antd';
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
  CheckCircleOutlined
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

  return (
    <div className="member-page">
      {/* Animated Background */}
      <div className="member-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Back Button */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')} 
        className="back-button"
      >
        Back to Login
      </Button>

      {/* Main Container */}
      <div className="member-container">
        {/* Left Side - Branding */}
        <div className="member-brand">
          <div className="brand-icon">🏋️</div>
          <h1 className="brand-title">Member Registration</h1>
          <p className="brand-tagline">Start Your Fitness Journey Today</p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleOutlined />
              </div>
              <div className="feature-text">
                <h3>Premium Packages</h3>
                <p>Gold, Platinum & Diamond membership plans</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleOutlined />
              </div>
              <div className="feature-text">
                <h3>Health Tracking</h3>
                <p>Monitor your fitness progress and goals</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleOutlined />
              </div>
              <div className="feature-text">
                <h3>Professional Trainers</h3>
                <p>Expert guidance for your fitness journey</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleOutlined />
              </div>
              <div className="feature-text">
                <h3>Modern Facilities</h3>
                <p>State-of-the-art equipment and amenities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="member-form-wrapper">
          <div className="form-header">
            <h2>Create Member Account</h2>
            <p>Enter your information to join our gym</p>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <div className="success-alert">
              <CheckCircleOutlined />
              <span>Member registered successfully! Redirecting to login...</span>
            </div>
          )}

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="member-form"
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

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="register-button"
                  icon={<UserAddOutlined />}
                  block
                >
                  {loading ? 'Creating Account...' : 'Create Member Account'}
                </Button>
              </Form.Item>
          </Form>

          {/* Password Requirements */}
          <div className="password-hint">
            <LockOutlined /> Password must contain uppercase, lowercase, number, and special character (min 6 chars)
          </div>

          {/* Package Info */}
          <div className="package-info">
            <GiftOutlined /> <strong>Packages:</strong> Gold (3 months), Platinum (6 months - 10% off), Diamond (12 months - 10% off + Free Membership)
          </div>

          {/* Login Section */}
          <div className="divider">
            <span>Already have an account?</span>
          </div>

          <Button 
            onClick={() => navigate('/')} 
            className="login-button"
            block
          >
            Login to Member Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Member;