import React, { useState, useEffect } from "react";
import { DatePicker, message } from 'antd'; 
import { SoundOutlined, UserOutlined, MessageOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import MainLayout from './components/Layout/MainLayout';
import './Announcement.css';

export const Announcement = () => {
  const [messageText, setMessage] = useState('');
  const [staff_id, setStaffId] = useState('');
  const [date, setDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  const navigate = useNavigate(); 

  const MAX_MESSAGE_LENGTH = 500;

  // Get logged-in user data from localStorage
  useEffect(() => {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const userData = JSON.parse(loginData);
        setLoggedInUser(userData);
        
        // Auto-fill staff_id with logged-in user's ID
        if (userData.User_ID) {
          setStaffId(userData.User_ID.toString());
        }
      } else {
        // If not logged in, redirect to login page
        message.warning("Please login first to create announcements");
        setTimeout(() => {
          navigate('/Login');
        }, 2000);
      }
    } catch (error) {
      console.error("Error reading login data:", error);
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!staff_id.trim()) {
      newErrors.staff_id = 'Admin ID is required';
    } else if (isNaN(staff_id) || parseInt(staff_id) <= 0) {
      newErrors.staff_id = 'Admin ID must be a valid positive number';
    }

    if (!messageText.trim()) {
      newErrors.message = 'Message is required';
    } else if (messageText.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`;
    }

    if (!date) {
      newErrors.date = 'Date is required';
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
    const formattedDate = date.toISOString().split('T')[0];
   
    const body = {
      staff_id: staff_id,
      message: messageText,
      date_time: formattedDate,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/announcement/create', body); 
      console.log(res?.data?.data);
      message.success("✅ Announcement created successfully!");
      
      // Reset form
      setMessage('');
      setStaffId('');
      setDate(null);
      setErrors({});
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/AnnouncementTable');
      }, 1500);
    } catch (err) {
      console.error(err.message);
      
      // Better error handling
      if (err.response?.data?.error) {
        const errorMsg = err.response.data.error;
        
        // Check for foreign key constraint error
        if (errorMsg.includes('foreign key constraint') || errorMsg.includes('fkey')) {
          message.error("❌ Invalid Admin ID. Please enter a valid Admin User ID that exists in the system.");
          setErrors({ staff_id: 'This Admin ID does not exist in the system' });
        } else {
          message.error(`❌ Failed to create announcement: ${errorMsg}`);
        }
      } else {
        message.error("❌ Failed to create announcement. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setMessage('');
    setStaffId('');
    setDate(null);
    setErrors({});
  };

  const handleDateChange = (date) => {
    setDate(date);
    if (errors.date) {
      setErrors({ ...errors, date: '' });
    }
  };

  const handleStaffIdChange = (e) => {
    setStaffId(e.target.value);
    if (errors.staff_id) {
      setErrors({ ...errors, staff_id: '' });
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (errors.message) {
      setErrors({ ...errors, message: '' });
    }
  };

  const handleGoBack = () => {
    navigate('/Announcementtable');
  };

  const getCharCountClass = () => {
    const remaining = MAX_MESSAGE_LENGTH - messageText.length;
    if (remaining < 50) return 'error';
    if (remaining < 100) return 'warning';
    return '';
  };

  return (
    <MainLayout showSidebar={true} showNavigation={false}>
      <div className="announcement-page">
        <div className="announcement-container">
          <div className="announcement-card">
            {/* Card Header */}
            <div className="card-header">
              <div className="header-icon-card">
                <SoundOutlined className="header-icon" />
              </div>
              <div className="header-text">
                <h1>Create Announcement</h1>
                <p>Broadcast important messages to your team</p>
              </div>
            </div>

            {/* Body */}
            <div className="announcement-card-body">
            {/* Info Box */}
            {loggedInUser && (
              <div className="announcement-info-box">
                <InfoCircleOutlined style={{ fontSize: '18px' }} />
                <div>
                  <strong>Logged in as:</strong> {loggedInUser?.Name || 'Admin'}
                  <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.9 }}>
                    Your Admin ID has been automatically filled
                  </div>
                </div>
              </div>
            )}

            <form className="announcement-form" onSubmit={handleSubmit}>
              {/* Admin ID */}
              <div className="form-group">
                <label className="form-label">
                  <UserOutlined className="label-icon" />
                  Admin User ID
                  {loggedInUser && <span style={{ color: '#10b981', marginLeft: '8px', fontSize: '14px', fontWeight: 'normal' }}>({loggedInUser.Name})</span>}
                </label>
                <input
                  type="number"
                  className="form-input readonly"
                  value={staff_id}
                  onChange={handleStaffIdChange}
                  placeholder="Auto-filled from login"
                  disabled={isSubmitting}
                  readOnly
                  min="1"
                  style={{ 
                    backgroundColor: '#f0f9ff', 
                    cursor: 'not-allowed',
                    fontWeight: '600',
                    borderColor: '#3b82f6'
                  }}
                />
                {errors.staff_id && (
                  <p className="error-text">{errors.staff_id}</p>
                )}
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label">
                  <MessageOutlined className="label-icon" />
                  Message
                </label>
                <div className="textarea-wrapper">
                  <textarea
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    value={messageText}
                    onChange={handleMessageChange}
                    placeholder="Type your announcement message here..."
                    disabled={isSubmitting}
                    maxLength={MAX_MESSAGE_LENGTH}
                    rows={5}
                  />
                  <div className={`char-counter ${getCharCountClass()}`}>
                    {messageText.length} / {MAX_MESSAGE_LENGTH} characters
                  </div>
                </div>
                {errors.message && (
                  <p className="error-text">{errors.message}</p>
                )}
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">
                  <CalendarOutlined className="label-icon" />
                  Announcement Date
                </label>
                <DatePicker
                  value={date}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  placeholder="Select announcement date"
                  disabled={isSubmitting}
                  size="large"
                  className={`form-datepicker ${errors.date ? 'error' : ''}`}
                  style={{ width: '100%' }}
                />
                {errors.date && (
                  <p className="error-text">{errors.date}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      Creating...
                    </>
                  ) : (
                    <>
                      <SoundOutlined />
                      Create Announcement
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </MainLayout>
  );
};
