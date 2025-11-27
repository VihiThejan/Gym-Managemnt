import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, InputNumber, Select, DatePicker, message, Card, Input, Form } from 'antd';
import { UserOutlined, HomeOutlined, CalendarOutlined, ManOutlined, MailOutlined, PhoneOutlined, GiftOutlined, ColumnHeightOutlined, DashboardOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Layout } from 'antd';
import AdminSidebar from './components/AdminSidebar';
import './Member.css';

const { Content } = Layout;

export const Member = () => {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [packages, setPackages] = useState('Gold');
  const [date, setDate] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);



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
    if (!name || !address || !email || !mobile || !pass || !date || !height || !weight) {
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

    if (height <= 0 || height > 10) {
      message.error("Height should be between 0 and 10 feet.");
      return false;
    }

    if (weight <= 0 || weight > 200) {
      message.error("Weight should be between 1 and 200 kg.");
      return false;
    }

    return true;
  };

  
  const handleSubmit = async (values) => {
    if (!validateForm()) return;

    setSubmitting(true);

    const body = {
      fName: name,
      dob: date,
      gender: gender,
      email: email,
      address: address,
      contact: mobile,
      package: packages,
      weight: weight,
      height: height,
      password: pass,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/member/create', body);
      console.log(res?.data?.data);
      message.success("Member registered successfully.");
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to register member.");
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleReset = () => {
    setMobile('');
    setPass('');
    setName('');
    setAddress('');
    setGender('Male');
    setEmail('');
    setHeight('');
    setWeight('');
    setPackages('Gold');
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

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/MemberTable" />
      <Layout style={{ marginLeft: 260 }}>
        <Content>
          <div className="member-page">
        <div className="member-container">
          <Card className="member-card">
            <div className="card-header">
              <div className="header-icon-card">
                <UserAddOutlined className="header-icon" />
              </div>
              <div>
                <h1 className="card-title">Member Registration</h1>
                <p className="card-subtitle">Create your new member account</p>
              </div>
            </div>

          <Form layout="vertical" onFinish={handleSubmit} className="member-form">
            <Form.Item>
              <label className="form-label">
                <UserOutlined className="label-icon" />
                Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(validateName(e.target.value));
                }}
                placeholder="Enter full name (First Last)"
                size="large"
              />
              {nameError && <span className="error-message">{nameError}</span>}
            </Form.Item>

            <Form.Item>
              <label className="form-label">
                <HomeOutlined className="label-icon" />
                Address
              </label>
              <Input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setAddressError(validateAddress(e.target.value));
                }}
                placeholder="Enter your address"
                size="large"
              />
              {addressError && <span className="error-message">{addressError}</span>}
            </Form.Item>

            <Form.Item>
              <label className="form-label">
                <CalendarOutlined className="label-icon" />
                Birthday
              </label>
              <DatePicker
                value={date}
                onChange={date => setDate(date)}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <label className="form-label">
                <ManOutlined className="label-icon" />
                Gender
              </label>
              <Radio.Group onChange={onGenderChange} value={gender} className="gender-radio-group">
                <Radio value={"Male"}>Male</Radio>
                <Radio value={"Female"}>Female</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <label className="form-label">
                <MailOutlined className="label-icon" />
                Email
              </label>
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(validateEmail(e.target.value));
                }}
                placeholder="example@gmail.com"
                size="large"
                type="email"
              />
              {emailError && <span className="error-message">{emailError}</span>}
            </Form.Item>

            <Form.Item>
              <label className="form-label">
                <PhoneOutlined className="label-icon" />
                Mobile Number
              </label>
              <PhoneInput
                country={'lk'}
                value={mobile}
                onChange={(phone) => {
                  setMobile(phone);
                  setMobileError(validateMobile(phone));
                }}
                containerClass="phone-input-container"
                inputClass="phone-input-field"
                buttonClass="phone-input-button"
              />
              {mobileError && <span className="error-message">{mobileError}</span>}
            </Form.Item>

            <Form.Item>
              <label className="form-label">
                <GiftOutlined className="label-icon" />
                Package
              </label>
              <Select
                value={packages}
                onChange={(value) => setPackages(value)}
                size="large"
                options={[
                  { value: 'Gold ', label: 'Gold (Charge 3 months fee)' },
                  { value: 'Platinum', label: 'Platinum (Charge 6 months fee get 10% discount)' },
                  { value: 'Diamond', label: 'Diamond (Charge 12 months fee get 10% discount + Membership free)' },
                ]}
              />
            </Form.Item>

            <div className="two-column-grid">
              <Form.Item>
                <label className="form-label">
                  <ColumnHeightOutlined className="label-icon" />
                  Height (feet)
                </label>
                <InputNumber
                  value={height}
                  onChange={value => setHeight(value)}
                  min={0}
                  max={10}
                  step={0.01}
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>

              <Form.Item>
                <label className="form-label">
                  <DashboardOutlined className="label-icon" />
                  Weight (kg)
                </label>
                <InputNumber
                  value={weight}
                  onChange={value => setWeight(value)}
                  min={1}
                  max={200}
                  step={0.1}
                  precision={2}
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </div>

            <Form.Item>
              <label className="form-label">
                <LockOutlined className="label-icon" />
                Password
              </label>
              <Input.Password
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                  setPasswordError(validatePassword(e.target.value));
                }}
                placeholder="Enter password"
                size="large"
              />
              {passwordError && <span className="error-message">{passwordError}</span>}
            </Form.Item>

            <Form.Item className="form-actions">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
                disabled={submitting}
                className="submit-button"
              >
                {submitting ? 'Registering...' : 'Register'}
              </Button>
              <Button
                onClick={handleReset}
                size="large"
                className="cancel-button"
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
