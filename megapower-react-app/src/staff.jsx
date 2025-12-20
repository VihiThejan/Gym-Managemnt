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
    <div className="staff-signup-page">
      <div className="staff-signup-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="staff-signup-container">
        <div className="signup-card">
          <div className="signup-left">
            <div className="brand-section">
              <div className="staff-icon">👨‍💼</div>
              <h1 className="brand-title">Staff Registration</h1>
              <p className="brand-tagline">Join the Mega Power Gym Professional Team</p>
            </div>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Professional Development</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Secure Access System</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Team Collaboration</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Flexible Job Roles</span>
              </div>
            </div>
          </div>

          <div className="signup-right">
            <div className="form-wrapper">
              <div className="form-header">
                <h2>Create Staff Account</h2>
                <p>Fill in your details to join our team</p>
              </div>

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
                className="signup-form"
                requiredMark={false}
                initialValues={{ gender: 'Male', jobRole: 'Trainer' }}
              >
                <Form.Item
                  name="name"
                  label={<span className="input-label"><UserOutlined />Full Name</span>}
                  rules={[
                    { required: true, message: 'Please enter full name' },
                    { pattern: /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/, message: 'Full name must contain first and last name with uppercase starting letters' }
                  ]}
                >
                  <Input placeholder="Enter full name (e.g., John Doe)" className="form-input" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<span className="input-label"><MailOutlined />Email</span>}
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="example@gmail.com" className="form-input" />
                </Form.Item>

                <Form.Item
                  name="mobile"
                  label={<span className="input-label"><PhoneOutlined />Mobile Number</span>}
                  rules={[
                    { required: true, message: 'Please enter mobile number' },
                    { validator: (_, value) => {
                        const cleanedMobile = mobile.replace(/\D/g, '');
                        return cleanedMobile.length >= 11 ? Promise.resolve() : Promise.reject(new Error('Invalid mobile number'));
                      }
                    }
                  ]}
                >
                  <div className="phone-input-container">
                    <PhoneInput country={'lk'} value={mobile} onChange={(phone) => setMobile(phone)} containerClass="react-tel-input" />
                  </div>
                </Form.Item>

                <Form.Item
                  name="address"
                  label={<span className="input-label"><EnvironmentOutlined />Address</span>}
                  rules={[
                    { required: true, message: 'Please enter address' },
                    { min: 10, message: 'Address must be at least 10 characters' },
                    { validator: (_, value) => (value && /[a-zA-Z]/.test(value) && /\d/.test(value)) ? Promise.resolve() : Promise.reject(new Error('Address must contain both letters and numbers')) }
                  ]}
                >
                  <Input placeholder="Enter full address" className="form-input" />
                </Form.Item>

                <Form.Item
                  name="dob"
                  label={<span className="input-label"><CalendarOutlined />Date of Birth</span>}
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker placeholder="Select date of birth" className="form-input" style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label={<span className="input-label"><UserOutlined />Gender</span>}
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Radio.Group className="gender-radio">
                    <Radio.Button value="Male"><ManOutlined /> Male</Radio.Button>
                    <Radio.Button value="Female"><WomanOutlined /> Female</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="jobRole"
                  label={<span className="input-label"><IdcardOutlined />Job Role</span>}
                  rules={[{ required: true, message: 'Please select job role' }]}
                >
                  <Select placeholder="Select job role" className="form-input" options={[{ value: 'Trainer', label: 'Trainer' }, { value: 'Cashier', label: 'Cashier' }]} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<span className="input-label"><LockOutlined />Password</span>}
                  rules={[{ validator: validatePassword }]}
                >
                  <Input.Password placeholder="Enter password" className="password-input" />
                </Form.Item>

                <div className="password-requirements">
                  <LockOutlined />
                  <span>Must include uppercase, lowercase, number, and special character</span>
                </div>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} className="register-button" block>
                    {loading ? 'Creating Account...' : 'Create Staff Account'}
                  </Button>
                </Form.Item>

                <div className="login-section">
                  <div className="divider"><span>Already have an account?</span></div>
                  <Button onClick={() => navigate('/')} className="login-btn" block>Sign In to Staff Panel</Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
