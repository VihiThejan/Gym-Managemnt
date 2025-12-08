import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Form, Select, DatePicker, message, Input, Radio } from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined, 
  IdcardOutlined,
  ManOutlined,
  WomanOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './staff.css';

export const Staff = () => {
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
      FName: values.name,
      dob: formattedDate,
      address: values.address,
      gender: values.gender,
      contactNo: mobile,
      email: values.email,
      jobRole: values.jobRole,
      password: values.password
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/staffmember/create', body);
      console.log(res?.data?.data);
      
      setShowSuccess(true);
      message.success("Staff member registered successfully!");
      
      form.resetFields();
      setMobile('');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.log(error.message);
      message.error("Failed to register staff member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-page">
      {/* Animated Background */}
      <div className="staff-background">
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
      <div className="staff-container">
        {/* Left Side - Branding */}
        <div className="staff-brand">
          <div className="brand-icon">👨‍💼</div>
          <h1 className="brand-title">Staff Registration</h1>
          <p className="brand-tagline">Join Our Professional Team</p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleOutlined />
              </div>
              <div className="feature-text">
                <h3>Professional Development</h3>
                <p>Grow your career with training opportunities</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleOutlined />
              </div>
              <div className="feature-text">
                <h3>Secure Access System</h3>
                <p>Protected staff portal with role-based access</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleOutlined />
              </div>
              <div className="feature-text">
                <h3>Team Collaboration</h3>
                <p>Work together to achieve gym success</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircleOutlined />
              </div>
              <div className="feature-text">
                <h3>Flexible Job Roles</h3>
                <p>Trainer or Cashier positions available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="staff-form-wrapper">
          <div className="form-header">
            <h2>Create Staff Account</h2>
            <p>Enter your information to join our team</p>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <div className="success-alert">
              <CheckCircleOutlined />
              <span>Staff member registered successfully! Redirecting to login...</span>
            </div>
          )}

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="staff-form"
            requiredMark={false}
            initialValues={{ gender: 'Male', jobRole: 'Trainer' }}
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
                      Email
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
                      <EnvironmentOutlined className="label-icon" />
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
                    prefix={<EnvironmentOutlined />}
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
                      <ManOutlined /> <span>Male</span>
                    </Radio.Button>
                    <Radio.Button value="Female">
                      <WomanOutlined /> <span>Female</span>
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="jobRole"
                  label={
                    <span className="form-label">
                      <IdcardOutlined className="label-icon" />
                      Job Role
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select job role' }]}
                >
                  <Select
                    placeholder="Select job role"
                    size="large"
                    options={[
                      { value: 'Trainer', label: 'Trainer' },
                      { value: 'Cashier', label: 'Cashier' },
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

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="register-button"
                  icon={<IdcardOutlined />}
                  block
                >
                  {loading ? 'Creating Account...' : 'Create Staff Account'}
                </Button>
              </Form.Item>
          </Form>

          {/* Password Requirements */}
          <div className="password-hint">
            <LockOutlined /> Password must contain uppercase, lowercase, number, and special character (min 6 chars)
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
            Login to Staff Account
          </Button>
        </div>
      </div>
    </div>
  );
};