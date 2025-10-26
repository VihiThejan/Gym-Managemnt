import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { message } from 'antd';  
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { CheckCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import MainLayout from './components/Layout/MainLayout';
import './Admin.css';

export const Admin = () => {
    const navigate = useNavigate();

    const [mobile, setMobile] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const getPasswordStrength = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 6;
        
        return {
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            isLongEnough
        };
    };
    
    const validateName = (name) => {
        const nameRegex = /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/;
        if (!nameRegex.test(name)) {
          return 'Full Name must contain first and last name, and each name should start with an uppercase letter.';
        }
        return '';
      };
    
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
    
      const validateMobile = (mobile) => {
        const cleanedMobile = mobile.replace(/\D/g, '');
      
        if (cleanedMobile.length < 11) {
          return 'Invalid mobile number. It should be at least 10 digits long, including the country code.';
        }
      
        return ''; 
      };

      const validateForm = () => {
        if (!name ||  !mobile || !pass ) {
          message.error("Please fill in all required fields.");
          return false;
        }
    
        const nameErrorMsg = validateName(name);
        if (nameErrorMsg) {
          setNameError(nameErrorMsg);
          return false;
        } else {
          setNameError('');
        }
    
        const mobileErrorMsg = validateMobile(mobile);
        if (mobileErrorMsg) {
          setMobileError(mobileErrorMsg);
          return false;
        } else {
          setMobileError('');
        }
    
        const passwordErrorMsg = validatePassword(pass);
        if (passwordErrorMsg) {
          setPasswordError(passwordErrorMsg);
          return false;
        } else {
          setPasswordError('');
        }
    
        return true;
      };

    const handleSubmit = async (e) => {  
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);

        const body = {
            name: name,
            password: pass,
            contact: mobile,
        };

        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/register', body);  
            console.log(res?.data?.data);
            message.success({
                content: 'Admin registered successfully! Redirecting to login...',
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                duration: 3
            });
            
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (Err) {
            console.log(Err.message);
            message.error("Failed to register Admin. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setMobile('');
        setPass('');
        setName('');
        setPasswordError('');
        setNameError('');
        setMobileError('');
    };

    const passwordStrength = getPasswordStrength(pass);

    return (
        <MainLayout>
            <div className="admin-register-container">
                <div className="register-card">
                    <div className="register-card-header">
                        <div className="register-icon">
                            <UserAddOutlined />
                        </div>
                        <h1 className="register-title">Create Admin Account</h1>
                        <p className="register-subtitle">Join Mega Power Gym Management System</p>
                    </div>

                    <div className="register-card-body">
                        <form onSubmit={handleSubmit}>
                            {/* Full Name Field */}
                            <div className="modern-form-group">
                                <label htmlFor="name" className="modern-form-label">
                                    Full Name
                                </label>
                                <input
                                    value={name}
                                    name="name"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (e.target.value) {
                                            setNameError(validateName(e.target.value));
                                        } else {
                                            setNameError('');
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            setNameError(validateName(e.target.value));
                                        }
                                    }}
                                    id="name"
                                    placeholder="John Doe"
                                    className={`modern-form-input ${nameError ? 'error' : ''}`}
                                />
                                {nameError && <p className="error-message">{nameError}</p>}
                            </div>

                            {/* Mobile Field */}
                            <div className="modern-form-group">
                                <label htmlFor="mobile" className="modern-form-label">
                                    Mobile Number
                                </label>
                                <PhoneInput
                                    country={'lk'}
                                    value={mobile}
                                    onChange={(phone) => {
                                        setMobile(phone);
                                        if (phone) {
                                            setMobileError(validateMobile(phone));
                                        } else {
                                            setMobileError('');
                                        }
                                    }}
                                    containerClass={`modern-phone-input ${mobileError ? 'error' : ''}`}
                                    inputProps={{
                                        name: 'mobile',
                                        required: true,
                                        autoFocus: false
                                    }}
                                />
                                {mobileError && <p className="error-message">{mobileError}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="modern-form-group">
                                <label htmlFor="password" className="modern-form-label">
                                    Password
                                </label>
                                <input
                                    value={pass}
                                    onChange={(e) => {
                                        setPass(e.target.value);
                                        if (e.target.value) {
                                            setPasswordError(validatePassword(e.target.value));
                                        } else {
                                            setPasswordError('');
                                        }
                                    }}
                                    type="password"
                                    placeholder="Enter a strong password"
                                    id="password"
                                    name="password"
                                    className={`modern-form-input ${passwordError ? 'error' : ''}`}
                                />
                                {passwordError && <p className="error-message">{passwordError}</p>}
                                
                                {/* Password Strength Indicator */}
                                {pass && (
                                    <div className="password-requirements">
                                        <div className="password-requirements-title">Password Requirements:</div>
                                        <div className={`requirement-item ${passwordStrength.isLongEnough ? 'met' : ''}`}>
                                            At least 6 characters
                                        </div>
                                        <div className={`requirement-item ${passwordStrength.hasUppercase ? 'met' : ''}`}>
                                            One uppercase letter
                                        </div>
                                        <div className={`requirement-item ${passwordStrength.hasLowercase ? 'met' : ''}`}>
                                            One lowercase letter
                                        </div>
                                        <div className={`requirement-item ${passwordStrength.hasNumber ? 'met' : ''}`}>
                                            One number
                                        </div>
                                        <div className={`requirement-item ${passwordStrength.hasSpecialChar ? 'met' : ''}`}>
                                            One special character
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="button-group">
                                <button 
                                    type="submit" 
                                    className="modern-button modern-button-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>⏳ Registering...</>
                                    ) : (
                                        <>
                                            <CheckCircleOutlined /> Create Account
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleReset} 
                                    className="modern-button modern-button-secondary"
                                    disabled={isSubmitting}
                                >
                                    Clear Form
                                </button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <div className="login-link-container">
                            <span className="login-link-text">Already have an account?</span>
                            <button 
                                onClick={() => navigate('/')} 
                                className="login-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Login here
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};



