import React, { useState, useEffect } from "react";
import { Button, Space, Form, DatePicker, TimePicker, message, Select } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined, CalendarOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import "./Attendance.css";

const { Option } = Select;

export const Attendance = () => {
  const [id, setId] = useState("");
  const [date, setDate] = useState(null);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch member list for dropdown
    fetchMemberList();

    // Check if user is logged in and get their details
    const loginData = localStorage.getItem('login');
    if (loginData) {
      try {
        const userData = JSON.parse(loginData);
        setLoggedInUser(userData);
        
        // Detect user role and auto-fill Member ID
        if (userData.Member_Id) {
          setUserRole('Member');
          setId(userData.Member_Id.toString());
          // Find and set the selected member
          fetchMemberList().then(members => {
            const member = members.find(m => m.Member_Id === userData.Member_Id);
            if (member) {
              setSelectedMember(member);
            }
          });
        } else if (userData.User_ID) {
          setUserRole('Admin');
        } else if (userData.Staff_ID) {
          setUserRole('Staff');
        }
      } catch (error) {
        console.error('Error parsing login data:', error);
      }
    }

    // Set today's date by default
    setDate(null); // User can select date manually
  }, []);

  const fetchMemberList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/member/list');
      const members = response.data.data || [];
      setMemberList(members);
      return members;
    } catch (error) {
      console.error('Error fetching member list:', error);
      message.error('Failed to load member list');
      return [];
    }
  };

  const handleMemberChange = (value) => {
    setId(value);
    const member = memberList.find(m => m.Member_Id.toString() === value);
    setSelectedMember(member);
    // Clear error when user selects
    if (formErrors.id) {
      setFormErrors({ ...formErrors, id: '' });
    }
  };

  const handleGoBack = () => {
    navigate('/Attendancetable');
  };

  const validateForm = () => {
    const errors = {};

    if (!id) errors.id = "User Id is required.";
    if (!date) errors.date = "Date is required.";
    if (!inTime) errors.inTime = "In Time is required.";
    if (!outTime) errors.outTime = "Out Time is required.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      message.error("Please fill in all fields.");
      return;
    }
  
    const body = {
      memberId: parseInt(id), // Ensure member ID is an integer
      currentDate: date ? date.format("YYYY-MM-DD") : null, // Convert DatePicker value to string
      inTime: inTime ? inTime.format("HH:mm:ss") : null, // Convert TimePicker value to string
      outTime: outTime ? outTime.format("HH:mm:ss") : null, // Convert TimePicker value to string
    };
  
    try {
      const res = await axios.post("http://localhost:5000/api/v1/attendance/create", body);
      console.log(res?.data?.data);
      message.success("Attendance Created successfully.");
      navigate("/Attendancetable");
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to register Attendance.");
    }
  };
  
  const handleReset = () => {
    setId('');
    setDate(null);
    setInTime(null);
    setOutTime(null);
    setFormErrors({});
    setSelectedMember(null);
    
    // Re-apply auto-fill if user is a member
    if (userRole === 'Member' && loggedInUser) {
      setId(loggedInUser.Member_Id.toString());
      const member = memberList.find(m => m.Member_Id === loggedInUser.Member_Id);
      if (member) {
        setSelectedMember(member);
      }
    }
  };

  return (
    <MainLayout>
      <div className="attendance-page">
        <div className="attendance-container">
          {/* Header Section */}
          <div className="attendance-header">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack}
              className="back-button"
            >
              Back to Attendance List
            </Button>
            <h1 className="attendance-title">
              <ClockCircleOutlined /> Mark Attendance
            </h1>
            <p className="attendance-subtitle">
              Record member check-in and check-out times
            </p>
          </div>

          {/* Info Box */}
          {loggedInUser && userRole === 'Member' && (
            <div className="attendance-info-box">
              <UserOutlined style={{ fontSize: '20px', color: '#10b981' }} />
              <div>
                <strong>Logged in as:</strong> {loggedInUser.FName} (Member ID: {loggedInUser.Member_Id})
                <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.9 }}>
                  Your member ID has been automatically filled
                </div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="attendance-form-card">
            <form className="attendance-form" onSubmit={handleSubmit}>
              {/* Member ID Field */}
              <div className="form-group">
                <label htmlFor="Id" className="form-label">
                  <UserOutlined /> Member Selection
                  {selectedMember && (
                    <span style={{ color: '#10b981', marginLeft: '8px' }}>
                      ({selectedMember.FName} {selectedMember.LName})
                    </span>
                  )}
                </label>
                {userRole === 'Member' ? (
                  // Read-only input for logged-in members
                  <>
                    <input
                      value={id}
                      name="Id"
                      id="Id"
                      placeholder="Auto-filled from your profile"
                      readOnly={true}
                      className={`form-input readonly ${formErrors.id ? 'error' : ''}`}
                      style={{ 
                        backgroundColor: '#f0f9ff', 
                        fontWeight: 'bold',
                        cursor: 'not-allowed'
                      }}
                    />
                    {formErrors.id && <p className="error-text">{formErrors.id}</p>}
                    <p className="helper-text success">
                      ✓ Using your logged-in member ID: {loggedInUser.FName}
                    </p>
                  </>
                ) : (
                  // Searchable dropdown for Admin/Staff
                  <>
                    <Select
                      showSearch
                      value={id || undefined}
                      onChange={handleMemberChange}
                      placeholder="Search by Member ID or Name..."
                      className={`attendance-member-select ${formErrors.id ? 'error' : ''}`}
                      style={{ width: '100%' }}
                      filterOption={(input, option) => {
                        const searchText = input.toLowerCase();
                        const member = memberList.find(m => m.Member_Id.toString() === option.value);
                        if (!member) return false;
                        
                        const fullName = `${member.FName} ${member.LName}`.toLowerCase();
                        const memberId = member.Member_Id.toString();
                        
                        return fullName.includes(searchText) || memberId.includes(searchText);
                      }}
                      size="large"
                    >
                      {memberList.map((member) => (
                        <Option key={member.Member_Id} value={member.Member_Id.toString()}>
                          {member.FName} {member.LName} - ID: {member.Member_Id} ({member.Gender})
                        </Option>
                      ))}
                    </Select>
                    {formErrors.id && <p className="error-text">{formErrors.id}</p>}
                    <p className="helper-text">
                      👥 {memberList.length} members available - Search by name or ID
                    </p>
                  </>
                )}
              </div>

              {/* Date Field */}
              <div className="form-group">
                <label htmlFor="Date" className="form-label">
                  <CalendarOutlined /> Date
                </label>
                <DatePicker
                  value={date}
                  onChange={(date) => setDate(date)}
                  placeholder="Select attendance date"
                  className={`attendance-date-picker ${formErrors.date ? 'error' : ''}`}
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                />
                {formErrors.date && <p className="error-text">{formErrors.date}</p>}
                <p className="helper-text">
                  📅 Select the date for this attendance record
                </p>
              </div>

              {/* In Time Field */}
              <div className="form-group">
                <label htmlFor="InTime" className="form-label">
                  <LoginOutlined /> Check-In Time
                </label>
                <TimePicker
                  value={inTime}
                  onChange={(time) => setInTime(time)}
                  minuteStep={15}
                  secondStep={10}
                  hourStep={1}
                  format="HH:mm:ss"
                  placeholder="Select check-in time"
                  className={`attendance-time-picker ${formErrors.inTime ? 'error' : ''}`}
                  style={{ width: "100%" }}
                />
                {formErrors.inTime && <p className="error-text">{formErrors.inTime}</p>}
                <p className="helper-text">
                  🕐 Record when the member entered the gym
                </p>
              </div>

              {/* Out Time Field */}
              <div className="form-group">
                <label htmlFor="OutTime" className="form-label">
                  <LogoutOutlined /> Check-Out Time
                </label>
                <TimePicker
                  value={outTime}
                  onChange={(time) => setOutTime(time)}
                  minuteStep={15}
                  secondStep={10}
                  hourStep={1}
                  format="HH:mm:ss"
                  placeholder="Select check-out time"
                  className={`attendance-time-picker ${formErrors.outTime ? 'error' : ''}`}
                  style={{ width: "100%" }}
                />
                {formErrors.outTime && <p className="error-text">{formErrors.outTime}</p>}
                <p className="helper-text">
                  🕐 Record when the member left the gym
                </p>
              </div>

              {/* Action Buttons */}
              <Form.Item className="form-actions">
                <Space size="large">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    className="submit-button"
                    size="large"
                  >
                    <ClockCircleOutlined /> Mark Attendance
                  </Button>
                  <Button
                    onClick={handleReset} 
                    type="default"
                    htmlType="button"
                    className="cancel-button"
                    size="large"
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
