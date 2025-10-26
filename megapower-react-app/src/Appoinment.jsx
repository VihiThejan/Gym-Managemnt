import React, { useState, useEffect } from "react";
import { DatePicker, message, Select } from 'antd';
import { CalendarOutlined, UserOutlined, TeamOutlined, PhoneOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import './Appoinment.css';

const { Option } = Select; 

export const Appoinment = () => {
   const [id, setId] = useState('');
   const [staffid, setStaffId] = useState('');
   const [mobile, setMobile] = useState('');
   const [date, setDate] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errors, setErrors] = useState({});
   const [staffList, setStaffList] = useState([]);
   const [loggedInUser, setLoggedInUser] = useState(null);
   const [userRole, setUserRole] = useState(null);
   const navigate = useNavigate();

   // Fetch staff list and auto-fill member ID if logged in
   useEffect(() => {
     // Get logged-in user data
     try {
       const loginData = localStorage.getItem('login');
       if (loginData) {
         const userData = JSON.parse(loginData);
         setLoggedInUser(userData);
         
         // Check if logged in as member and auto-fill member ID
         if (userData.Member_Id) {
           setUserRole('Member');
           setId(userData.Member_Id.toString());
         } else if (userData.User_ID) {
           setUserRole('Admin');
         } else if (userData.Staff_ID) {
           setUserRole('Staff');
         }
       }
     } catch (error) {
       console.error("Error reading login data:", error);
     }

     // Fetch staff list
     fetchStaffList();
   }, []);

   const fetchStaffList = async () => {
     try {
       const response = await axios.get('http://localhost:5000/api/v1/staffmember/list');
       if (response?.data?.data) {
         setStaffList(response.data.data);
       }
     } catch (error) {
       console.error("Error fetching staff list:", error);
       message.error("Failed to load staff members");
     }
   }; 

   const handleGoBack = () => {
     navigate('/Appoinmenttable');
   };

   const validateMobile = (mobile) => {
      const cleanedMobile = mobile.replace(/\D/g, '');
    
      if (cleanedMobile.length < 11) {
        return 'Invalid mobile number. It should be at least 10 digits long, including the country code.';
      }
    
      return ''; 
   };

   const validateForm = () => {
      const newErrors = {};

      if (!id.trim()) {
        newErrors.id = 'Member ID is required';
      } else if (isNaN(id) || parseInt(id) <= 0) {
        newErrors.id = 'Member ID must be a valid positive number';
      }

      if (!staffid.trim()) {
        newErrors.staffid = 'Staff ID is required';
      } else if (isNaN(staffid) || parseInt(staffid) <= 0) {
        newErrors.staffid = 'Staff ID must be a valid positive number';
      }

      if (!mobile) {
        newErrors.mobile = 'Mobile number is required';
      } else {
        const mobileErrorMsg = validateMobile(mobile);
        if (mobileErrorMsg) {
          newErrors.mobile = mobileErrorMsg;
        }
      }

      if (!date) {
        newErrors.date = 'Date and time is required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };
  
   const handleSubmit = async (e) => { 
      e.preventDefault();
     
      if (!validateForm()) {
        message.error("Please fill in all required fields correctly.");
        return;
      }

      setIsSubmitting(true);
      const formattedDate = date.toISOString();
      
      const body = {
          memberid: id,
          staffid: staffid,
          date_time: formattedDate,
          contact: mobile,
      };
      
      try {
          const res = await axios.post('http://localhost:5000/api/v1/appointment/create', body);
          console.log(res?.data?.data);
          message.success("✅ Appointment scheduled successfully!");
          
          // Reset form
          setId('');
          setStaffId('');
          setMobile('');
          setDate(null);
          setErrors({});
          
          // Redirect after short delay
          setTimeout(() => {
            navigate('/Appoinmenttable');
          }, 1500);
      } catch (err) {
          console.log(err.message);
          if (err.response?.data?.error) {
            const errorMsg = err.response.data.error;
            
            if (errorMsg.includes('foreign key constraint') || errorMsg.includes('fkey')) {
              message.error("❌ Invalid Member ID or Staff ID. Please check the IDs exist in the system.");
            } else {
              message.error(`❌ Failed to schedule appointment: ${errorMsg}`);
            }
          } else {
            message.error("❌ Failed to schedule appointment. Please try again.");
          }
      } finally {
        setIsSubmitting(false);
      }
   };

   const handleReset = () => {
      setId('');
      setStaffId('');
      setMobile('');
      setDate(null);
      setErrors({});
   };

   const handleDateChange = (date) => {
      setDate(date);
      if (errors.date) {
        setErrors({ ...errors, date: '' });
      }
   };

   const handleIdChange = (e) => {
      setId(e.target.value);
      if (errors.id) {
        setErrors({ ...errors, id: '' });
      }
   };

   const handleStaffIdChange = (value) => {
      setStaffId(value);
      if (errors.staffid) {
        setErrors({ ...errors, staffid: '' });
      }
   };

   const handleMobileChange = (phone) => {
      setMobile(phone);
      if (errors.mobile) {
        setErrors({ ...errors, mobile: '' });
      }
   };

   return (
      <MainLayout>
        <div className="appointment-container">
          <div className="appointment-card">
            {/* Header */}
            <div className="appointment-card-header">
              <div className="appointment-icon">📅</div>
              <h2 className="appointment-title">Schedule Appointment</h2>
              <p className="appointment-subtitle">Book a session with our staff members</p>
            </div>

            {/* Body */}
            <div className="appointment-card-body">
              {/* Info Box */}
              <div className="appointment-info-box">
                <div className="appointment-info-title">
                  <InfoCircleOutlined />
                  Appointment Information
                </div>
                {loggedInUser && userRole === 'Member' && (
                  <p className="appointment-info-text">
                    • Logged in as: <strong>{loggedInUser.FName}</strong> (Member ID: {loggedInUser.Member_Id})
                  </p>
                )}
                <p className="appointment-info-text">
                  • {userRole === 'Member' ? 'Your Member ID is auto-filled' : 'Enter valid Member ID from the system'}
                </p>
                <p className="appointment-info-text">
                  • Select a staff member for your appointment
                </p>
                <p className="appointment-info-text">
                  • Provide contact number for confirmation
                </p>
              </div>

              <form className="appointment-form" onSubmit={handleSubmit}>
                {/* Member & Staff IDs in a row */}
                <div className="appointment-row">
                  {/* Member ID */}
                  <div className="appointment-form-group">
                    <label className="appointment-form-label">
                      <UserOutlined className="label-icon" />
                      Member ID {loggedInUser?.FName && userRole === 'Member' && <span style={{ color: '#52c41a', fontWeight: 'normal' }}>({loggedInUser.FName})</span>}
                    </label>
                    <input
                      type="number"
                      className={`appointment-form-input ${errors.id ? 'error' : ''}`}
                      value={id}
                      onChange={handleIdChange}
                      placeholder={userRole === 'Member' ? "Auto-filled from login" : "e.g., 1, 2, 3..."}
                      disabled={isSubmitting}
                      readOnly={userRole === 'Member'}
                      min="1"
                      style={userRole === 'Member' ? { 
                        backgroundColor: '#f0f9ff', 
                        cursor: 'not-allowed',
                        color: '#0066cc',
                        fontWeight: '600'
                      } : {}}
                    />
                    {errors.id && (
                      <p className="error-message">{errors.id}</p>
                    )}
                    {userRole === 'Member' && (
                      <p className="appointment-helper-text">
                        ✅ Auto-filled with your Member ID
                      </p>
                    )}
                  </div>

                  {/* Staff Selection */}
                  <div className="appointment-form-group">
                    <label className="appointment-form-label">
                      <TeamOutlined className="label-icon" />
                      Select Staff Member
                    </label>
                    <Select
                      className={`appointment-staff-select ${errors.staffid ? 'error' : ''}`}
                      value={staffid || undefined}
                      onChange={handleStaffIdChange}
                      placeholder="Choose a staff member..."
                      disabled={isSubmitting}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                      }
                      style={{ width: '100%' }}
                    >
                      {staffList.map((staff) => (
                        <Option key={staff.Staff_ID} value={staff.Staff_ID.toString()}>
                          {staff.FName} - {staff.Job_Role} (ID: {staff.Staff_ID})
                        </Option>
                      ))}
                    </Select>
                    {errors.staffid && (
                      <p className="error-message">{errors.staffid}</p>
                    )}
                    <p className="appointment-helper-text info">
                      👥 {staffList.length} staff members available
                    </p>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="appointment-form-group">
                  <label className="appointment-form-label">
                    <CalendarOutlined className="label-icon" />
                    Date and Time
                  </label>
                  <div className={`appointment-datepicker ${errors.date ? 'error' : ''}`}>
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      value={date}
                      onChange={handleDateChange}
                      placeholder="Select appointment date and time"
                      disabled={isSubmitting}
                      style={{ width: '100%' }}
                    />
                  </div>
                  {errors.date && (
                    <p className="error-message">{errors.date}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="appointment-form-group">
                  <label className="appointment-form-label">
                    <PhoneOutlined className="label-icon" />
                    Mobile Number
                  </label>
                  <div className={`appointment-phone-wrapper ${errors.mobile ? 'error' : ''}`}>
                    <PhoneInput
                      country={'lk'}
                      value={mobile}
                      onChange={handleMobileChange}
                      disabled={isSubmitting}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="error-message">{errors.mobile}</p>
                  )}
                  <p className="appointment-helper-text info">
                    📱 Include country code for international numbers
                  </p>
                </div>

                {/* Buttons */}
                <div className="appointment-button-group">
                  <button
                    type="submit"
                    className="appointment-button appointment-button-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span>⏳</span>
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <CheckCircleOutlined />
                        Schedule Appointment
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="appointment-button appointment-button-secondary"
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </button>
                </div>
              </form>

              {/* Back Link */}
              <div className="appointment-back-link">
                <span className="appointment-back-text">
                  View all appointments?
                </span>
                <button
                  className="appointment-back-button"
                  onClick={handleGoBack}
                  disabled={isSubmitting}
                >
                  Go to Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
   );
};