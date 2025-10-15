import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space, DatePicker, Input, message, Form } from 'antd';
import axios from "axios";
import moment from "moment";

export const EditAnnouncement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [messageText, setMessage] = useState('');
  const [staff_id, setStaffId] = useState(null); 
  const [date, setDate] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/announcement/${id}`);
        const announcement = response.data.data;

        setStaffId(Number(announcement.Staff_ID)); 
        setMessage(announcement.Message);
        setDate(announcement.Date_Time ? moment(announcement.Date_Time) : null);
      } catch (error) {
        console.error(`Error fetching announcement data: ${error.message}`);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const validateForm = () => {
    if (!staff_id || isNaN(staff_id)) { 
      message.error("Staff ID is required and must be a valid number.");
      return false;
    }
    if (!messageText.trim()) { 
      message.error("Message cannot be empty.");
      return false;
    }
    if (!date) { 
      message.error("Please select a date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = date ? date.toISOString() : null;

    const body = {
      Staff_ID: staff_id,
      Message: messageText,
      Date_Time: formattedDate,
    };

    console.log("Sending update request with body:", body);

    try {
      const res = await axios.put(`http://localhost:5000/api/v1/announcement/update/${id}`, body);
      console.log("Response from server:", res.data);
      message.success("Announcement updated successfully.");
      navigate('/Announcementtable');
    } catch (Err) {
      console.error("Error updating announcement:", Err.response?.data || Err.message);
      message.error("Failed to update Announcement: " + (Err.response?.data?.message || Err.message));
    }
  };

  const handleReset = () => {
    setMessage('');
    setStaffId(null); 
    setDate(null);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  return (
    <div
      className="auth-form-container"
      style={{ padding: '20px', backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <h2>Edit Announcement</h2>
      <form
        className="Announcement-form"
        onSubmit={handleSubmit}
        style={{ textAlign: 'left' }}
      >
        <label htmlFor="StaffId">Staff ID </label>
        <Input
          value={staff_id || ''} 
          name="StaffId"
          onChange={(e) => setStaffId(Number(e.target.value))} 
          id="StaffIdId"
          placeholder="Staff ID"
          style={{ marginBottom: '15px' }}
        /><br /><br />

        <label htmlFor="Message">Message </label>
        <Input
          value={messageText}
          name="Message"
          onChange={(e) => setMessage(e.target.value)}
          id="Message"
          placeholder="Message"
          style={{ marginBottom: '10px' }}
        /><br /><br />

        <label htmlFor="Date">Date </label>
        <DatePicker
          onChange={handleDateChange}
          style={{ width: '100%' }}
        /><br /><br />

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