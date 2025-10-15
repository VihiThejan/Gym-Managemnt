import React, { useState } from "react";

import 'react-phone-input-2/lib/style.css';
import { Button, Flex,message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


export const Reset = () => {

    const navigate = useNavigate();

    const [pass, setPass] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('');


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
        if ( !pass   ) {
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
    
       
    
        return true;
      };


    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const contact = await localStorage.getItem('contact');
        const body = {
            password: pass,
            confirmPassword: confirmPassword,
            contact: contact
        }
        axios.post("http://localhost:5000/api/v1/auth/reset", body).then(res => {
            //TODO Navigate to Login Page
            navigate("/"); 
        })
    }

    const handleReset = () => {
        
        setPass('');
        setConfirmPassword('');
       
      };

    return (
        <div className="auth-form-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '50px',backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <h2 style={{ textAlign: 'left' }}>Reset  Password</h2>
            <form className="reset-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <label htmlFor="password"> New Password</label>
                     <input
                       value={pass}
                       onChange={(e) => {
                         setPass(e.target.value);
                         setPasswordError(validatePassword(e.target.value));
                       }}
                           type="password"
                           placeholder="***********"
                           id="password"
                           name="password"
                    />
                       {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>} <br/>
                
                       <label htmlFor="password"> Confirm Password</label>
                     <input
                       value={confirmPassword}
                       onChange={(e) => {
                         setConfirmPassword(e.target.value);
                         setPasswordError(validatePassword(e.target.value));
                       }}
                           type="password"
                           placeholder="***********"
                           id="password"
                           name="password"
                    />
                       {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>} <br/>
                
                <Flex gap="small" wrap style={{ justifyContent: 'flex-start', alignItems: 'center', padding: '20px 0' }}>
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>Submit</Button>
                    <Button htmlType="button" onClick={handleReset}>Cancel</Button> 
                </Flex>
            </form>
        </div>
    )
}
