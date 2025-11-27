import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, Form, Select, DatePicker, message, Card, Input } from 'antd';
import { SaveOutlined, CloseOutlined, EditOutlined, UserOutlined, HomeOutlined, 
         CalendarOutlined, ManOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import AdminSidebar from './components/AdminSidebar';
import './Editstaff.css';

const { Content } = Layout;

export const EditStaff = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/v1/staffmember/${id}`);
                const staffmember = response.data.data;

                setName(staffmember.FName);
                setDate(staffmember.DOB ? moment(staffmember.DOB) : null);
                setAddress(staffmember.Address);
                setGender(staffmember.Gender);
                setMobile(staffmember.Contact_No);
                setEmail(staffmember.Email);
                setJobrole(staffmember.Job_Role);
                setLoading(false);
            } catch (error) {
                console.error(`Error fetching staffmember data: ${error.message}`);
                message.error('Failed to load staff member data');
                setLoading(false);
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

    const handleSubmit = async () => {
        // Validation
        if (!name || !address || !email || !mobile || !date) {
            message.error("Please fill in all required fields.");
            return;
        }

        const nameErrorMsg = validateName(name);
        if (nameErrorMsg) {
            setNameError(nameErrorMsg);
            message.error(nameErrorMsg);
            return;
        } else {
            setNameError('');
        }

        const addressErrorMsg = validateAddress(address);
        if (addressErrorMsg) {
            setAddressError(addressErrorMsg);
            message.error(addressErrorMsg);
            return;
        } else {
            setAddressError('');
        }

        const mobileErrorMsg = validateMobile(mobile);
        if (mobileErrorMsg) {
            setMobileError(mobileErrorMsg);
            message.error(mobileErrorMsg);
            return;
        } else {
            setMobileError('');
        }

        const emailErrorMsg = validateEmail(email);
        if (emailErrorMsg) {
            setEmailError(emailErrorMsg);
            message.error(emailErrorMsg);
            return;
        } else {
            setEmailError('');
        }

        try {
            setSubmitting(true);
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

            const res = await axios.put(`http://localhost:5000/api/v1/staffmember/update/${id}`, body);
            console.log("Response from server:", res.data);
            message.success("Staff member updated successfully!");
            setTimeout(() => {
                navigate('/staffTable');
            }, 1500);
        } catch (Err) {
            console.error("Error updating staff member:", Err.response?.data || Err.message);
            message.error("Failed to update staff: " + (Err.response?.data?.message || Err.message));
            setSubmitting(false);
        }
    };

    const onGenderChange = (e) => {
        setGender(e.target.value);
    };

    return (
        <Layout className="dashboard-layout" hasSider>
            <AdminSidebar selectedKey="/staffTable" />
            <Layout style={{ marginLeft: 260 }}>
                <Content>
                    <div className="edit-staff-page">
                {/* Form Section */}
                <div className="edit-staff-content">
                    <Card className="edit-staff-card" loading={loading}>
                        {!loading && (
                            <div className="card-header">
                                <div className="header-icon-card">
                                    <EditOutlined className="header-icon" />
                                </div>
                                <div>
                                    <h1 className="card-title">Edit Staff Member</h1>
                                    <p className="card-subtitle">Update staff member information and details</p>
                                </div>
                            </div>
                        )}
                        <Form onFinish={handleSubmit} className="edit-staff-form">
                            {/* Full Name */}
                            <Form.Item validateStatus={nameError ? 'error' : ''} help={nameError}>
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
                                    className="form-input"
                                />
                            </Form.Item>

                            {/* Address */}
                            <Form.Item validateStatus={addressError ? 'error' : ''} help={addressError}>
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
                                    placeholder="Enter address"
                                    className="form-input"
                                />
                            </Form.Item>

                            {/* Birthday */}
                            <Form.Item>
                                <label className="form-label">
                                    <CalendarOutlined className="label-icon" />
                                    Birthday
                                </label>
                                <DatePicker
                                    value={date}
                                    onChange={(date) => setDate(date)}
                                    format="YYYY-MM-DD"
                                    placeholder="Select date of birth"
                                    className="form-datepicker"
                                />
                            </Form.Item>

                            {/* Gender */}
                            <Form.Item>
                                <label className="form-label">
                                    <ManOutlined className="label-icon" />
                                    Gender
                                </label>
                                <Radio.Group onChange={onGenderChange} value={gender} className="form-radio-group">
                                    <Radio value="Male">Male</Radio>
                                    <Radio value="Female">Female</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {/* Email */}
                            <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError}>
                                <label className="form-label">
                                    <MailOutlined className="label-icon" />
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError(validateEmail(e.target.value));
                                    }}
                                    placeholder="Enter email address"
                                    className="form-input"
                                />
                            </Form.Item>

                            {/* Mobile */}
                            <Form.Item validateStatus={mobileError ? 'error' : ''} help={mobileError}>
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
                                    inputClass="phone-input-field"
                                    containerClass="phone-input-container"
                                    buttonClass="phone-input-button"
                                />
                            </Form.Item>

                            {/* Job Role */}
                            <Form.Item>
                                <label className="form-label">
                                    <IdcardOutlined className="label-icon" />
                                    Job Role
                                </label>
                                <Select
                                    value={jobrole}
                                    onChange={(value) => setJobrole(value)}
                                    placeholder="Select job role"
                                    className="form-select"
                                >
                                    <Select.Option value="Trainer">Trainer</Select.Option>
                                    <Select.Option value="Cashier">Cashier</Select.Option>
                                </Select>
                            </Form.Item>

                            {/* Action Buttons */}
                            <Form.Item className="form-actions">
                                <div className="button-group">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={submitting}
                                        icon={<SaveOutlined />}
                                        className="submit-button"
                                    >
                                        {submitting ? 'Updating...' : 'Update Staff'}
                                    </Button>
                                    <Button
                                        type="default"
                                        icon={<CloseOutlined />}
                                        className="cancel-button"
                                        onClick={() => navigate('/staffTable')}
                                    >
                                        Cancel
                                    </Button>
                                </div>
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