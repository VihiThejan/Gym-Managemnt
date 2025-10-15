import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space, DatePicker, message, Form } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import moment from "moment";

export const EditAppoinment = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [memberid, setMemberId] = useState('');
    const [staffid, setStaffId] = useState('');
    const [mobile, setMobile] = useState('');
    const [date, setDate] = useState(null);
    const [mobileError, setMobileError] = useState('');

    useEffect(() => {
        const fetchAppoinment = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/appointment/${id}`);
                const appointment = response.data.data;

                setMemberId(Number(appointment.Member_Id));
                setStaffId(Number(appointment.Staff_ID));
                setMobile(appointment.Contact);
                setDate(appointment.Date_and_Time ? moment(appointment.Date_and_Time) : null);
            } catch (error) {
                console.error(`Error fetching appointment data: ${error.message}`);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            const res = await axios.put(`http://localhost:5000/api/v1/appointment/update/${id}`, body);
            console.log("Response from server:", res.data);
            message.success("Appointment updated successfully.");
            navigate('/Appoinmenttable');
        } catch (Err) {
            console.error("Error updating appointment:", Err.response?.data || Err.message);
            message.error("Failed to update Appointment: " + (Err.response?.data?.message || Err.message));
        }
    };

    const handleReset = () => {
        setMemberId('');
        setStaffId('');
        setMobile('');
        setDate(null);
        setMobileError('');
    };

    const handleDateChange = (date) => {
        setDate(date);
    };

    return (
        <div className="auth-form-container" style={{ textAlign: 'Center', width: '300px', backgroundColor: "rgba(0, 0, 0, 0.5)", margin: 'auto' }}>
            <h2>Edit Appointment</h2>
            <form className="Appointment-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="memberId">Member Id</label>
                <input
                    value={memberid}
                    name="memberId"
                    onChange={(e) => setMemberId(e.target.value)}
                    id="memberId"
                    placeholder="Member Id"
                    style={{ marginBottom: '10px' }}
                />

                <label htmlFor="staffId">Staff Id</label>
                <input
                    value={staffid}
                    name="staffId"
                    onChange={(e) => setStaffId(e.target.value)}
                    id="staffId"
                    placeholder="Staff Id"
                    style={{ marginBottom: '10px' }}
                />

                <label htmlFor="Date">Date and Time</label>
                <DatePicker
                    showTime 
                    format="YYYY-MM-DD HH:mm:ss" 
                    value={date}
                    onChange={handleDateChange}
                    style={{ marginBottom: '10px' }}
                />

                <label htmlFor="mobile">Mobile</label>
                <PhoneInput
                    country={'lk'}
                    value={mobile}
                    onChange={(phone) => {
                        setMobile(phone);
                        setMobileError(validateMobile(phone));
                    }}
                />
                {mobileError && <p style={{ color: 'red' }}>{mobileError}</p>} <br />

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