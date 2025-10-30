import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DatePicker, message, Form, Input, Card } from 'antd';
import { SaveOutlined, CloseOutlined, EditOutlined, CalendarOutlined, UserOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import moment from "moment";
import MainLayout from './components/Layout/MainLayout';
import './EditAppoinment.css';

export const EditAppoinment = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [memberid, setMemberId] = useState('');
    const [staffid, setStaffId] = useState('');
    const [mobile, setMobile] = useState('');
    const [date, setDate] = useState(null);
    const [mobileError, setMobileError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchAppoinment = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/v1/appointment/${id}`);
                const appointment = response.data.data;

                setMemberId(Number(appointment.Member_Id));
                setStaffId(Number(appointment.Staff_ID));
                setMobile(appointment.Contact);
                setDate(appointment.Date_and_Time ? moment(appointment.Date_and_Time) : null);
                setLoading(false);
            } catch (error) {
                console.error(`Error fetching appointment data: ${error.message}`);
                message.error('Failed to load appointment data');
                setLoading(false);
            }
        };
        fetchAppoinment();
    }, [id]);

    const validateMobile = (mobile) => {
        const cleanedMobile = mobile.replace(/\D/g, '');
        if (cleanedMobile.length < 11) {
            return 'Invalid mobile number. It should be at least 10 digits long, including the country code.';
        }
        return '';
    };

    const validateForm = () => {
        if (!id || !staffid || !mobile || !date) {
            message.error("Please fill in all required fields.");
            return false;
        }

        const mobileErrorMsg = validateMobile(mobile);
        if (mobileErrorMsg) {
            setMobileError(mobileErrorMsg);
            return false;
        } else {
            setMobileError('');
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formattedDate = date ? date.toISOString() : null;

        const body = {
            Member_Id: memberid,
            Staff_ID: staffid,
            Date_and_Time: formattedDate,
            Contact: mobile,
        };

        console.log("Sending update request with body:", body);

        try {
            setSubmitting(true);
            const res = await axios.put(`http://localhost:5000/api/v1/appointment/update/${id}`, body);
            console.log("Response from server:", res.data);
            message.success("Appointment updated successfully!");
            setTimeout(() => navigate('/Appoinmenttable'), 1000);
        } catch (Err) {
            console.error("Error updating appointment:", Err.response?.data || Err.message);
            message.error("Failed to update Appointment: " + (Err.response?.data?.message || Err.message));
            setSubmitting(false);
        }
    };

    const handleDateChange = (date) => {
        setDate(date);
    };

    return (
        <MainLayout>
            <div className="edit-appointment-page">
                <div className="page-header">
                    <div className="header-content">
                        <EditOutlined className="header-icon" />
                        <div className="header-text">
                            <h1>Edit Appointment</h1>
                            <p>Update appointment details and save changes</p>
                        </div>
                    </div>
                </div>

                <Card className="edit-form-card" bordered={false} loading={loading}>
                    <Form onFinish={handleSubmit} layout="vertical" className="edit-appointment-form">
                        {/* Member ID Field */}
                        <Form.Item
                            label={
                                <span className="form-label">
                                    <TeamOutlined className="label-icon" />
                                    Member ID
                                </span>
                            }
                            required
                        >
                            <Input
                                value={memberid}
                                onChange={(e) => setMemberId(e.target.value)}
                                placeholder="Enter Member ID"
                                className="custom-input"
                                size="large"
                                type="number"
                                prefix={<TeamOutlined className="input-icon" />}
                            />
                        </Form.Item>

                        {/* Staff ID Field */}
                        <Form.Item
                            label={
                                <span className="form-label">
                                    <UserOutlined className="label-icon" />
                                    Staff ID
                                </span>
                            }
                            required
                        >
                            <Input
                                value={staffid}
                                onChange={(e) => setStaffId(e.target.value)}
                                placeholder="Enter Staff ID"
                                className="custom-input"
                                size="large"
                                type="number"
                                prefix={<UserOutlined className="input-icon" />}
                            />
                        </Form.Item>

                        {/* Date and Time Field */}
                        <Form.Item
                            label={
                                <span className="form-label">
                                    <CalendarOutlined className="label-icon" />
                                    Date & Time
                                </span>
                            }
                            required
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                value={date}
                                onChange={handleDateChange}
                                className="custom-datepicker"
                                size="large"
                                placeholder="Select date and time"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        {/* Mobile Number Field */}
                        <Form.Item
                            label={
                                <span className="form-label">
                                    <PhoneOutlined className="label-icon" />
                                    Mobile Number
                                </span>
                            }
                            required
                            validateStatus={mobileError ? 'error' : ''}
                            help={mobileError}
                        >
                            <div className="phone-input-wrapper">
                                <PhoneInput
                                    country={'lk'}
                                    value={mobile}
                                    onChange={(phone) => {
                                        setMobile(phone);
                                        setMobileError(validateMobile(phone));
                                    }}
                                    inputClass="custom-phone-input"
                                    containerClass="phone-input-container"
                                    buttonClass="phone-input-button"
                                />
                            </div>
                        </Form.Item>

                        {/* Action Buttons */}
                        <Form.Item className="form-actions">
                            <div className="button-group">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    className="submit-button"
                                    size="large"
                                    loading={submitting}
                                >
                                    Update Appointment
                                </Button>
                                <Button
                                    onClick={() => navigate('/Appoinmenttable')}
                                    icon={<CloseOutlined />}
                                    className="cancel-button"
                                    size="large"
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </MainLayout>
    );
};