import React, { useState } from "react";
import { Button, Space, DatePicker, Input, message } from 'antd'; 
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const Announcement = () => {
  const [messageText, setMessage] = useState('');
  const [staff_id, setStaffId] = useState('');
  const [date, setDate] = useState(null);
  
  
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => { 
    e.preventDefault();
    
    if (!date) {
      message.error("Please select a date.");
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];
   
    const body = {
      staff_id: staff_id,
      message: messageText,
      date_time: formattedDate,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/announcement/create', body); 
      console.log(res?.data?.data);
      message.success("Announcement submitted successfully.");
      navigate('/AnnouncementTable');
    } catch (err) {
      console.error(err.message);
      message.error("Failed to submit announcement.");
    }
  };

  const handleReset = () => {
    setMessage('');
    setStaffId('');
    setDate(null);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleGoBack = () => {
    navigate('/Announcementtable');
  };

  return (
    <div
      className="auth-form-container"
      style={{ padding: '20px', backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div style={{ marginBottom: '20px' }}> 
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack} 
          style={{ 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '16px', 
          }}
        >
          Back
        </Button>
      </div>
      <h2>Announcement</h2>
      <form 
        className="Announcement-form" 
        onSubmit={handleSubmit} 
        style={{ textAlign: 'left' }}
      >
        <label htmlFor="StaffId">Staff ID </label>
        <Input
          value={staff_id}
          name="StaffId"
          onChange={(e) => setStaffId(e.target.value)}
          id="StaffIdId"
          placeholder="StaffId"
          style={{ marginBottom: '15px' }}
        /><br/><br/>

        <label htmlFor="Message">Message </label>
        <Input
          value={messageText}
          name="Message"
          onChange={(e) => setMessage(e.target.value)}
          id="Message"
          placeholder="Message"
          style={{ marginBottom: '10px' }}
        /><br/><br/>

        <label htmlFor="Date">Date </label>
        <DatePicker 
          onChange={handleDateChange} 
          style={{ width: '100%' }} 
        /><br/><br/>

        <Space>
          <Button type="primary" htmlType="submit">Submit</Button>
          <Button htmlType="button" onClick={handleReset}>Cancel</Button>
        </Space>
      </form>
    </div>
  );
};
