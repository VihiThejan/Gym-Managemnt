import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, Space, Form, Select, DatePicker, message } from 'antd';

export const EditStaff = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('Male');
    const [email, setEmail] = useState('');
    const [jobrole, setJobrole] = useState('Trainer');
    const [date, setDate] = useState('');

    const [nameError, setNameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        const fetchstaff = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/staffmember/${id}`);
                const staffmember = response.data.data;

                setName(staffmember.FName);
                setDate(staffmember.DOB ? moment(staffmember.DOB) : null);
                setAddress(staffmember.Address);
                setGender(staffmember.Gender);
                setMobile(staffmember.Contact_No);
                setEmail(staffmember.Email);
                setJobrole(staffmember.Job_Role);
            } catch (error) {
                console.error(`Error fetching staffmember data: ${error.message}`);
            }
        };
        fetchstaff();
    }, [id]);

    const validateName = (name) => {
        const nameRegex = /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/;
        if (!nameRegex.test(name)) {
            return 'Full Name must contain first and last name, and each name should start with an uppercase letter.';
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
        if (!name || !address || !email || !mobile || !date) {
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

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formattedDate = date ? moment(date).format('YYYY-MM-DD') : null;

        const body = {
            FName: name,
            DOB: formattedDate,
            Address: address,
            Gender: gender,
            Contact_No: mobile,
            Email: email,
            Job_Role: jobrole,
        };

        console.log("Sending update request with body:", body);

        try {
            const res = await axios.put(`http://localhost:5000/api/v1/staffmember/update/${id}`, body);
            console.log("Response from server:", res.data);
            message.success("Staff member updated successfully.");
            navigate('/staffTable');
        } catch (Err) {
            console.error("Error updating staff member:", Err.response?.data || Err.message);
            message.error("Failed to update staff: " + (Err.response?.data?.message || Err.message));
        }
    };

    const handleReset = () => {
        setName('');
        setAddress('');
        setGender('Male');
        setEmail('');
        setMobile('');
        setJobrole('Trainer');
        setDate('');
        setNameError('');
        setAddressError('');
        setMobileError('');
        setEmailError('');
    };

    const onGenderChange = (e) => {
        setGender(e.target.value);
    };

    return (
        <div className="auth-form-container1" style={{ padding: '50px', backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <h2>Edit Staff Member</h2>
            <form className="Staff-form" onSubmit={handleSubmit} style={{ textAlign: 'left', margin: '0 auto', width: '300px' }}>
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
                <DatePicker
                    value={date}
                    onChange={(date) => setDate(date)}
                    format="YYYY-MM-DD"
                /><br />

                <label htmlFor="gender">Gender</label>
                <Radio.Group onChange={onGenderChange} value={gender}>
                    <Radio value={"Male"}>Male</Radio>
                    <Radio value={"Female"}>Female</Radio>
                </Radio.Group><br />

                <label htmlFor="email">Email</label>
                <input
                    value={email}
                    name="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(validateEmail(e.target.value));
                    }}
                    id="email"
                    placeholder="*@gmail.com"
                />
                {emailError && <p style={{ color: 'red' }}>{emailError}</p>}<br />

                <label htmlFor="mobile">Mobile</label>
                <PhoneInput
                    country={'lk'}
                    value={mobile}
                    onChange={(phone) => {
                        setMobile(phone);
                        setMobileError(validateMobile(phone));
                    }}
                />
                {mobileError && <p style={{ color: 'red' }}>{mobileError}</p>}<br />

                <label htmlFor="jobrole">Job Role</label>
                <Select
                    value={jobrole}
                    onChange={(value) => setJobrole(value)}
                    style={{ width: '100%' }}
                    options={[
                        { value: 'Trainer', label: 'Trainer' },
                        { value: 'Cashier', label: 'Cashier' },
                    ]}
                /><br />

                <Form.Item style={{ textAlign: "left", marginTop: "0px" }}>
                    <Space size="large">
                        <Button type="primary" htmlType="submit">Update</Button>
                        <Button onClick={handleReset} type="default" htmlType="button" style={{ backgroundColor: "white", color: "black", border: "1px solid #d9d9d9" }}>Cancel</Button>
                    </Space>
                </Form.Item>
            </form>
        </div>
    );
};