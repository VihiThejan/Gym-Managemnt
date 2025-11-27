import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, Form, Select, DatePicker, message, Card, Input } from 'antd';
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
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './StaffSignup.css';

export const StaffSignup = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
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
      message.success("Registration successful! Please login with your credentials.");
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.log(error.message);
      message.error("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setMobile('');
  };

  return (
    <div className="staff-signup-page">
      <div className="staff-signup-background">
        <div className="gradient-overlay"></div>
      </div>
      
      <div className="staff-signup-container">
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
                <IdcardOutlined className="header-icon" />
              </div>
              <h2 className="card-title">Staff Registration</h2>
              <p className="card-subtitle">Create your staff account to get started</p>
            </div>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="signup-form"
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
                      <ManOutlined /> Male
                    </Radio.Button>
                    <Radio.Button value="Female">
                      <WomanOutlined /> Female
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

              <Form.Item className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="submit-button"
                  icon={<IdcardOutlined />}
                  block
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
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
              <IdcardOutlined /> Registration Information
            </h3>
            <div className="info-content">
              <div className="info-item">
                <UserOutlined className="info-icon" />
                <div>
                  <h4>Personal Details</h4>
                  <p>Provide accurate information for account verification</p>
                </div>
              </div>
              <div className="info-item">
                <IdcardOutlined className="info-icon" />
                <div>
                  <h4>Job Role</h4>
                  <p>Select your position: Trainer or Cashier</p>
                </div>
              </div>
              <div className="info-item">
                <LockOutlined className="info-icon" />
                <div>
                  <h4>Secure Password</h4>
                  <p>Must include uppercase, lowercase, numbers, and special characters</p>
                </div>
              </div>
              <div className="info-item">
                <PhoneOutlined className="info-icon" />
                <div>
                  <h4>Contact Information</h4>
                  <p>Valid email and mobile number required for account access</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffSignup;
