import React, { useState } from "react";
import { Button, Space, DatePicker, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; 

export const Appoinment = () => {
   const [id, setId] = useState('');
   const [staffid, setStaffId] = useState('');
   const [mobile, setMobile] = useState('');
   const [date, setDate] = useState(null); 
   const [mobileError, setMobileError] = useState('');
   const navigate = useNavigate(); 

   const handleGoBack = () => {
     navigate('/Appoinmenttable');
   };

   const formattedDate = date ? date.toISOString() : '';

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
      
      const body = {
          memberid: id,
          staffid: staffid,
          date_time: formattedDate,
          contact: mobile,
      };
      
      try {
          const res = await axios.post('http://localhost:5000/api/v1/appointment/create', body);
          console.log(res?.data?.data);
          message.success("Appointment registered successfully.");
          navigate('/Appoinmenttable');
      } catch (Err) {
          console.log(Err.message);
          message.error("Failed to register Appointment.");
      }
   };

   const handleReset = () => {
      setId('');
      setStaffId('');
      setMobile('');
      setDate(null);
      setMobileError('');
   };

   const handleDateChange = (date, dateString) => {
      setDate(date); 
      console.log(date, dateString);
   };

   return (
      <div className="auth-form-container" style={{ textAlign: 'Center', width: '300px', backgroundColor: "rgba(0, 0, 0, 0.5)",  margin: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack} 
              style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}
            >
              Back
            </Button>
          </div>
          <h2>Appointment</h2>
          <form className="Appointment-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              
              <label htmlFor="memberId">Member Id</label>
              <input 
                  value={id} 
                  name="memberId" 
                  onChange={(e) => setId(e.target.value)} 
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
              {mobileError && <p style={{ color: 'red' }}>{mobileError}</p>} <br/>

              <Space>
                  <Button type="primary" htmlType="submit">
                      Submit
                  </Button>
                  <Button htmlType="button" onClick={handleReset}>Cancel</Button>
              </Space>
          </form>
      </div>
   );
};