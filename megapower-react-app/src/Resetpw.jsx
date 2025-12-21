import React, { useState } from "react";
import { Button, message, Card, Input, Form } from 'antd';
import { LockOutlined, SafetyOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Resetpw.css';


export const Reset = () => {

    const navigate = useNavigate();

    const [pass, setPass] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [resetting, setResetting] = useState(false);


    const validatePassword = (password) => {
        const minLength = 6;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
        if (password.length < minLength) {
          return `Password must be at least ${minLength} characters long.`;
        }
        if (!hasUppercase) {
          return 'Password must contain at least one uppercase letter.';
        }
        if (!hasLowercase) {
          return 'Password must contain at least one lowercase letter.';
        }
        if (!hasNumber) {
          return 'Password must contain at least one number.';
        }
        if (!hasSpecialChar) {
          return 'Password must contain at least one special character.';
        }
    
        return '';
      };

      const validateForm = () => {
        if (!pass || !confirmPassword) {
          message.error("Please fill in all required fields.");
          return false;
        }
    
        const passwordErrorMsg = validatePassword(pass);
        if (passwordErrorMsg) {
          setPasswordError(passwordErrorMsg);
          return false;
        } else {
          setPasswordError('');
        }
    
        if (pass !== confirmPassword) {
          setConfirmError('Passwords do not match.');
          return false;
        } else {
          setConfirmError('');
        }
    
        return true;
      };


    const handleSubmit = async() => {
        if (!validateForm()) return;
        
        setResetting(true);
        const contact = localStorage.getItem('contact');
        
        if (!contact) {
            message.error('Contact information not found. Please start the password reset process again.');
            setResetting(false);
            return;
        }
        
        const body = {
            password: pass,
            confirmPassword: confirmPassword,
            contact: contact
        }
        
        try {
            const response = await axios.post("http://localhost:5000/api/v1/auth/reset", body);
            
            if (response?.data?.code === 200) {
                message.success('Password reset successfully!');
                localStorage.removeItem('contact');
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else if (response?.data?.code === 300) {
                message.error(response?.data?.message || 'Passwords do not match.');
            } else if (response?.data?.code === 400) {
                message.error(response?.data?.message || 'Failed to reset password.');
            } else {
                message.error(response?.data?.message || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            message.error(error?.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setResetting(false);
        }
    }

    const handleReset = () => {
        setPass('');
        setConfirmPassword('');
        setPasswordError('');
        setConfirmError('');
    };

    return (
        <div className="reset-page">
            <div className="reset-container">
                <Card className="reset-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <SafetyOutlined />
                        </div>
                        <h2>Reset Password</h2>
                        <p>Create your new password</p>
                    </div>

                    <Form onFinish={handleSubmit} layout="vertical" className="reset-form">
                        <Form.Item>
                            <label className="form-label">
                                <LockOutlined className="label-icon" />
                                New Password
                            </label>
                            <Input.Password
                                value={pass}
                                onChange={(e) => {
                                    setPass(e.target.value);
                                    setPasswordError(validatePassword(e.target.value));
                                }}
                                placeholder="Enter new password"
                                size="large"
                                className={passwordError ? 'error-input' : ''}
                            />
                            {passwordError && (
                                <div className="error-message">
                                    {passwordError}
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item>
                            <label className="form-label">
                                <CheckCircleOutlined className="label-icon" />
                                Confirm Password
                            </label>
                            <Input.Password
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (pass && e.target.value && pass !== e.target.value) {
                                        setConfirmError('Passwords do not match.');
                                    } else {
                                        setConfirmError('');
                                    }
                                }}
                                placeholder="Confirm new password"
                                size="large"
                                className={confirmError ? 'error-input' : ''}
                            />
                            {confirmError && (
                                <div className="error-message">
                                    {confirmError}
                                </div>
                            )}
                        </Form.Item>

                        <div className="password-requirements">
                            <h4>Password Requirements:</h4>
                            <ul>
                                <li className={pass.length >= 6 ? 'valid' : ''}>At least 6 characters</li>
                                <li className={/[A-Z]/.test(pass) ? 'valid' : ''}>One uppercase letter</li>
                                <li className={/[a-z]/.test(pass) ? 'valid' : ''}>One lowercase letter</li>
                                <li className={/[0-9]/.test(pass) ? 'valid' : ''}>One number</li>
                                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(pass) ? 'valid' : ''}>One special character</li>
                            </ul>
                        </div>

                        <Form.Item className="form-actions">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={resetting}
                                disabled={resetting}
                                className="submit-button"
                            >
                                {resetting ? 'Resetting...' : 'Reset Password'}
                            </Button>
                            <Button
                                onClick={handleReset}
                                size="large"
                                className="cancel-button"
                            >
                                Clear
                            </Button>
                        </Form.Item>

                        <div className="back-to-login">
                            <Button
                                type="link"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/')}
                                className="back-link"
                            >
                                Back to Login
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    )
}
