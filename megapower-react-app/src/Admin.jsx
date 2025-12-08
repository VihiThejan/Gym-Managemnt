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
            {/* Background decoration */}
            <div className="admin-signup-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="admin-signup-container">
                {/* Back Button */}
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/')} 
                    className="back-button"
                >
                    Back to Login
                </Button>

                <div className="signup-card">
                    {/* Left Side - Branding */}
                    <div className="signup-left">
                        <div className="brand-section">
                            <div className="admin-icon">👤</div>
                            <h1 className="brand-title">Admin Registration</h1>
                            <p className="brand-tagline">Join the Mega Power Gym Management Team</p>
                        </div>
                        <div className="features-list">
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>Full System Access</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>Manage Staff & Members</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>Financial Control</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>Analytics & Reports</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="signup-right">
                        <div className="form-wrapper">
                            <div className="form-header">
                                <h2>Create Admin Account</h2>
                                <p>Fill in your details to get started</p>
                            </div>

                            {showSuccess && (
                                <div className="success-alert">
                                    <CheckCircleOutlined />
                                    <span>Registration successful! Redirecting to login...</span>
                                </div>
                            )}

                            <Form
                                form={form}
                                onFinish={handleSubmit}
                                layout="vertical"
                                className="signup-form"
                                requiredMark={false}
                            >
                                {/* Full Name */}
                                <Form.Item
                                    name="name"
                                    label={
                                        <span className="input-label">
                                            <UserOutlined /> Full Name
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
                                        placeholder="John Doe"
                                        prefix={<UserOutlined className="input-icon" />}
                                        size="large"
                                        className="form-input"
                                    />
                                </Form.Item>

                                {/* Mobile Number */}
                                <Form.Item
                                    name="mobile"
                                    label={
                                        <span className="input-label">
                                            <PhoneOutlined /> Mobile Number
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
                                        containerClass="phone-input-container"
                                        enableSearch={true}
                                        placeholder="77 123 4567"
                                    />
                                </Form.Item>

                                {/* Password */}
                                <Form.Item
                                    name="password"
                                    label={
                                        <span className="input-label">
                                            <LockOutlined /> Password
                                        </span>
                                    }
                                    rules={[{ validator: validatePassword }]}
                                    extra={
                                        <div className="password-requirements">
                                            <SecurityScanOutlined /> Must include uppercase, lowercase, number, and special character
                                        </div>
                                    }
                                >
                                    <Input.Password
                                        placeholder="Enter secure password"
                                        prefix={<LockOutlined className="input-icon" />}
                                        size="large"
                                        className="password-input"
                                    />
                                </Form.Item>

                                {/* Submit Buttons */}
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className="register-button"
                                        icon={<UserAddOutlined />}
                                        block
                                    >
                                        {loading ? 'Creating Account...' : 'Create Admin Account'}
                                    </Button>
                                </Form.Item>
                            </Form>

                            {/* Login Link */}
                            <div className="login-section">
                                <div className="divider">
                                    <span>Already have an account?</span>
                                </div>
                                <Button
                                    className="login-btn"
                                    onClick={() => navigate('/')}
                                    block
                                >
                                    Sign In to Admin Panel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;