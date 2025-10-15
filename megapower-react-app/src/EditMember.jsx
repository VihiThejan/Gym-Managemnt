import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, InputNumber, Select, Space, DatePicker, message, Form } from 'antd';

export const EditMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  
  useEffect(() => {
    const fetchMember = async () => {
       try {
          const response = await axios.get(`http://localhost:5000/api/v1/member/${id}`);
          const member = response.data.data;

          setName(member.FName);
          setDate(member.DOB ? moment(member.DOB) : null);
          setGender(member.Gender);
          setEmail(member.Email);
          setAddress(member.Address);
          setMobile(member.Contact);
          setPackages(member.Package);
          setWeight(Number(member.Weight));
          setHeight(Number(member.Height));
          setMobile(member.UName);
          setPass(member.Password);
          
       } catch (error) {
          console.error(`Error fetching member data: ${error.message}`);
       }
    };
    fetchMember();
 }, [id]);


  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = date ? date.toISOString() : null;

    const body = {
      FName: name,
      DOB: formattedDate,
      Gender: gender,
      Email: email,
      Address: address,
      Contact: mobile,
      Package: packages,
      Weight: weight,
      Height: height,
      UName: mobile,
      Password: pass,
     
    };

    console.log("Sending update request with body:", body); 

    try {
        const res = await axios.put(`http://localhost:5000/api/v1/member/update/${id}`, body);
        console.log("Response from server:", res.data);
        message.success("Member updated successfully.");
        navigate('/MemberTable');
    } catch (Err) {
        console.error("Error updating member:", Err.response?.data || Err.message);
        message.error("Failed to update Member: " + (Err.response?.data?.message || Err.message));
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
    setNameError('');
    setPasswordError('');
    setAddressError('');
    setMobileError('');
    setEmailError('');
  };

  const onGenderChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <div className="auth-form-container" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <h2>Edit Member</h2>
      <form className="Member-form" onSubmit={handleSubmit}>
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

        <label htmlFor="address">Address</label>
        <input
          value={address}
          name="address"
          onChange={(e) => {
            setAddress(e.target.value);
            setAddressError(validateAddress(e.target.value));
          }}
          id="address"
          placeholder="Address"
        />
        {addressError && <p style={{ color: 'red' }}>{addressError}</p>}

        <label htmlFor="birthday">Birthday</label>
        <Space direction="vertical">
          <DatePicker value={date} onChange={(date) => setDate(date)} />
        </Space>

        <label htmlFor="gender">Gender</label>
        <Radio.Group onChange={onGenderChange} value={gender}>
          <Radio value={"Male"}>Male</Radio>
          <Radio value={"Female"}>Female</Radio>
        </Radio.Group>

        <label htmlFor="email">Email</label>
        <input
          value={email}
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(validateEmail(e.target.value));
          }}
          id="email"
          placeholder="*****@gmail.com"
        />
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

        <label htmlFor="mobile">Mobile</label>
        <PhoneInput
          country={'lk'}
          value={mobile}
          onChange={(phone) => {
            setMobile(phone);
            setMobileError(validateMobile(phone));
          }}
        />
        {mobileError && <p style={{ color: 'red' }}>{mobileError}</p>}

        <label htmlFor="package">Package</label>
        <Select
          value={packages}
          style={{ width: '100%' }}
          onChange={(value) => setPackages(value)}
          options={[
            { value: 'Gold', label: 'Gold (Charge 3 months fee)' },
            { value: 'Platinum', label: 'Platinum (Charge 6 months fee, get 10% discount)' },
            { value: 'Diamond', label: 'Diamond (Charge 12 months fee, get 10% discount + Membership free)' },
          ]}
        />

        <label htmlFor="height">Height (feet)</label>
        <InputNumber value={height} onChange={(value) => setHeight(value)} min={0} max={10} step="0.01" />

        <label htmlFor="weight">Weight (Kg)</label>
        <InputNumber value={weight} onChange={(value) => setWeight(value)} min={1} max={200} />


        <label htmlFor="password">Password</label>
        <input
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setPasswordError(validatePassword(e.target.value));
          }}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>} 



             <Form.Item style={{ textAlign: "left", marginTop: "0px" }}>
                  <Space size="large">
                      <Button type="primary" htmlType="submit"> Update </Button>
                      <Button onClick={handleReset} type="default" htmlType="button" style={{ backgroundColor: "white", color: "black", border: "1px solid #d9d9d9" }}> Cancel </Button>
                  </Space>
              </Form.Item>
      </form>
    </div>
  );
};