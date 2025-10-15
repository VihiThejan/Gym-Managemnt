import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, Space, Form, Select, DatePicker, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const Staff = () => {
  const navigate = useNavigate(); 

  const [mobile, setMobile] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [jobrole, setJobrole] = useState('Trainer');
  const [date, setDate] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');

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

  const validateAddress = (address) => {
    if (address.length < 10) {
      return 'Address must be at least 10 characters long.';
    }

    const addressRegex = /[a-zA-Z]/.test(address) && /\d/.test(address);
    if (!addressRegex) {
      return 'Address must contain both letters and numbers.';
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

  const validateEmail = (email) => {
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/; 
    if (!emailRegex.test(email)) {
      return 'Invalid email format.';
    }
    return ''; 
  };

  const validateForm = () => {
    if (!name || !address || !email || !mobile || !pass || !date ) {
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

    const addressErrorMsg = validateAddress(address);
    if (addressErrorMsg) {
      setAddressError(addressErrorMsg);
      return false;
    } else {
      setAddressError('');
    }

    const mobileErrorMsg = validateMobile(mobile);
    if (mobileErrorMsg) {
      setMobileError(mobileErrorMsg);
      return false;
    } else {
      setMobileError('');
    }

    const emailErrorMsg = validateEmail(email);
    if (emailErrorMsg) {
      setEmailError(emailErrorMsg);
      return false;
    } else {
      setEmailError('');
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

    const formattedDate = date ? new Date(date).toISOString() : '';
    const body = {
      FName: name,
      dob: formattedDate,
      address: address,
      gender: gender,
      contactNo: mobile,
      email: email,
      jobRole: jobrole,
      password: pass
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/staffmember/create', body);
      console.log(res?.data?.data);
      message.success("Staff Member registered successfully.");
      navigate('/');
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to register Staff Member.");
    }
  };

  const handleReset = () => {
    setMobile('');
    setPass('');
    setName('');
    setAddress('');
    setGender('Male');
    setEmail('');
    setJobrole('Trainer');
    setDate('');
    setPasswordError('');
    setNameError('');
    setAddressError('');
    setMobileError('');
    setEmailError('');
  };

  const onGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleGoBack = () => {
    navigate('/'); 
  };

  return (
    <div className="auth-form-container" style={{ maxWidth: '500px', margin: 'auto', textAlign: 'left', backgroundColor: "rgba(0, 0, 0, 0.5)", padding: '40px' }}>
      
      <div style={{ marginBottom: '60px' }}> 
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

      
      <h2 style={{ textAlign: 'center', marginBottom: '60px' }}>Staff Registration</h2>

      
      <form className="Staff-form" onSubmit={handleSubmit} style={{ textAlign: 'left', margin: '0 auto', width: '300px' }}>
        
        <label htmlFor="name" style={{ marginBottom: '10px', display: 'block' }}>Full Name</label>
        <input
          value={name}
          name="name"
          onChange={(e) => {
            setName(e.target.value);
            setNameError(validateName(e.target.value));
          }}
          id="name"
          placeholder="Full Name"
          style={{ marginBottom: '10px', width: '100%' }}
        />
        {nameError && <p style={{ color: 'red', marginBottom: '10px' }}>{nameError}</p>}

 
        <label htmlFor="address" style={{ marginBottom: '10px', display: 'block' }}>Address</label>
        <input
          value={address}
          name="address"
          onChange={(e) => {
            setAddress(e.target.value);
            setAddressError(validateAddress(e.target.value));
          }}
          id="address"
          placeholder="Address"
          style={{ marginBottom: '10px', width: '100%' }}
        />
        {addressError && <p style={{ color: 'red', marginBottom: '10px' }}>{addressError}</p>} 

        
        <label htmlFor="birthday" style={{ marginBottom: '10px', display: 'block' }}>Birthday</label>
        <DatePicker value={date} onChange={(date, dateString) => setDate(date)} style={{ marginBottom: '10px', width: '100%' }} /><br />

        
        <label htmlFor="gender" style={{ marginBottom: '10px', display: 'block' }}>Gender</label>
        <Radio.Group onChange={onGenderChange} defaultValue={"Male"} value={gender} style={{ marginBottom: '10px' }}>
          <Radio value={"Male"}>Male</Radio>
          <Radio value={"Female"}>Female</Radio>
        </Radio.Group><br />

        
        <label htmlFor="email" style={{ marginBottom: '10px', display: 'block' }}>Email</label>
        <input 
          value={email}
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(validateEmail(e.target.value));
          }}
          id="email"
          placeholder="example1@gmail.com"
          style={{ marginBottom: '10px', width: '100%' }}
        />
        {emailError && <p style={{ color: 'red', marginBottom: '10px' }}>{emailError}</p>} <br/>

        
        <label htmlFor="mobile" style={{ marginBottom: '10px', display: 'block' }}>Mobile</label>
        <PhoneInput
          country={'lk'}
          value={mobile}
          onChange={(phone) => {
            setMobile(phone);
            setMobileError(validateMobile(phone));
          }}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        {mobileError && <p style={{ color: 'red', marginBottom: '10px' }}>{mobileError}</p>} <br/>

        
        <label htmlFor="jobrole" style={{ marginBottom: '10px', display: 'block' }}>Job Role</label>
        <Select
          defaultValue="Trainer"
          style={{ width: '100%', marginBottom: '10px' }}
          value={jobrole}
          onChange={(value) => setJobrole(value)}
          options={[
            { value: 'Trainer', label: 'Trainer' },
            { value: 'Cashier', label: 'Cashier' },
          ]}
        /><br />

      
        <label htmlFor="password" style={{ marginBottom: '10px', display: 'block' }}>Password</label>
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
          style={{ marginBottom: '10px', width: '100%' }}
        />
        {passwordError && <p style={{ color: 'red', marginBottom: '24px' }}>{passwordError}</p>} <br/>

        
        <Form.Item style={{ textAlign: 'left', marginBottom: 0 }}> 
          <Space>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>Submit</Button>
            <Button htmlType="button" onClick={handleReset}>Cancel</Button> 
          </Space>
        </Form.Item>
      </form>
    </div>
  );
};