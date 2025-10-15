import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Space, Form, message } from 'antd';  
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ArrowLeftOutlined } from '@ant-design/icons';

export const Admin = () => {
    const navigate = useNavigate();

    const [mobile, setMobile] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');
    const [mobileError, setMobileError] = useState('');
    
   
  
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

        const body = {
            name: name,
            password: pass,
            contact: mobile,
        };

        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/register', body);  
            console.log(res?.data?.data);
            message.success("Admin registered successfully.");
            navigate('/');
        } catch (Err) {
            console.log(Err.message);
            message.error("Failed to register Admin.");
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

    const handleGoBack = () => {
      navigate('/'); 
  };

    return (
        <div className="auth-form-container" style={{ maxWidth: '400px', margin: 'auto', textAlign: 'left', backgroundColor: "rgba(0, 0, 0, 0.5)", padding: '20px' }}>
            
            <div style={{ marginBottom: '40px' }}> 
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={handleGoBack} 
                    style={{ 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: '18px', 
                    }}
                >
                    Back
                </Button>
            </div>

            <h2 style={{ textAlign: 'center' }}>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                
                <label htmlFor="name">Full Name</label>
                <input
                    value={name}
                    name="name"
                    onChange={(e) => {
                        setName(e.target.value);
                        setNameError(validateName(e.target.value));
                    }}
                    id="name"
                    placeholder="Full Name"
                />
                {nameError && <p style={{ color: 'red' }}>{nameError}</p>}

              
                <label htmlFor="mobile">Mobile</label>
                <PhoneInput
                    country={'lk'}
                    value={mobile}
                    onChange={(phone) => {
                        setMobile(phone);
                        setMobileError(validateMobile(phone));
                    }}
                />
                {mobileError && <p style={{ color: 'red' }}>{mobileError}</p>} <br/>

                
                <label htmlFor="password">Password</label>
                <input
                    value={pass}
                    onChange={(e) => {
                        setPass(e.target.value);
                        setPasswordError(validatePassword(e.target.value));
                    }}
                    type="password"
                    placeholder=""
                    id="password"
                    name="password"
                />
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>} <br/>

                
                <Form.Item style={{ textAlign: 'left' }}> 
                    <Space>
                        <Button type="primary" htmlType="submit" onClick={handleSubmit}>Submit</Button>
                        <Button htmlType="button" onClick={handleReset}>Cancel</Button> 
                    </Space>
                </Form.Item>
            </form>
        </div>
    );
};



