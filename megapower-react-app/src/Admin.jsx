import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Form, Input, Card, message } from 'antd';
import { 
  UserAddOutlined, 
  CheckCircleOutlined, 
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  SafetyOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Admin.css';

export const Admin = () => {
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

        const body = {
            name: values.name,
            password: values.password,
            contact: mobile,
        };

        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/register', body);
            console.log(res?.data?.data);
            
            setShowSuccess(true);
            
            message.success({
                content: 'Admin registered successfully! Redirecting to login...',
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                duration: 3
            });
            
            form.resetFields();
            setMobile('');
            
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
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
        <div className="admin-signup-page">
            <div className="admin-signup-background">
                <div className="gradient-overlay"></div>
            </div>
            
            <div className="admin-signup-container">
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
                            <h2 className="card-title">Admin Registration</h2>
                            <p className="card-subtitle">Create your admin account to manage the gym</p>
                        </div>

                        {showSuccess && (
                            <div className="success-message">
                                <CheckCircleOutlined />
                                Registration successful! Redirecting to login...
                            </div>
                        )}

                        <Form
                            form={form}
                            onFinish={handleSubmit}
                            layout="vertical"
                            className="signup-form"
                            requiredMark={false}
                        >
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

                            <Form.Item className="form-actions">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    className="submit-button"
                                    icon={<UserAddOutlined />}
                                    block
                                >
                                    {loading ? 'Creating Account...' : 'Create Admin Account'}
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
                            <SafetyOutlined /> Admin Account Information
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
                                <SafetyOutlined className="info-icon" />
                                <div>
                                    <h4>Admin Privileges</h4>
                                    <p>Full access to gym management system and staff oversight</p>
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
                                <SecurityScanOutlined className="info-icon" />
                                <div>
                                    <h4>Account Security</h4>
                                    <p>Your account will have administrative control over the entire system</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Admin;