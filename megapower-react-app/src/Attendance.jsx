import React, { useState, useEffect } from "react";
import { Button, Space, Form, DatePicker, TimePicker, message, Select } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined, CalendarOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
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
  
    // Format times without timezone conversion
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    const formattedInTime = inTime ? dayjs(inTime).format("HH:mm:ss") : null;
    const formattedOutTime = outTime ? dayjs(outTime).format("HH:mm:ss") : null;
  
    const body = {
      memberId: parseInt(id),
      currentDate: formattedDate,
      inTime: formattedInTime,
      outTime: formattedOutTime,
    };
  
    console.log("Submitting attendance data:", body);
  
    try {
      const res = await axios.post("http://localhost:5000/api/v1/attendance/create", body);
      console.log(res?.data?.data);
      message.success("Attendance Created successfully.");
      navigate("/Attendancetable");
    } catch (Err) {
      console.error("Error creating attendance:", Err.response?.data || Err.message);
      message.error("Failed to register Attendance: " + (Err.response?.data?.message || Err.message));
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
    <MainLayout showSidebar={true} showNavigation={false}>
      <div className="attendance-page">
        <div className="attendance-container">
          <div className="attendance-card">
            {/* Card Header */}
            <div className="card-header">
              <div className="header-icon-card">
                <ClockCircleOutlined className="header-icon" />
              </div>
              <div className="header-text">
                <h1>Mark Attendance</h1>
                <p>Record member check-in and check-out times</p>
              </div>
            </div>

            {/* Info Box */}
            {loggedInUser && userRole === 'Member' && (
              <div className="attendance-info-box">
                <UserOutlined style={{ fontSize: '20px' }} />
                <div>
                  <strong>Logged in as:</strong> {loggedInUser.FName} (Member ID: {loggedInUser.Member_Id})
                  <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.9 }}>
                    Your member ID has been automatically filled
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form className="attendance-form" onSubmit={handleSubmit}>
              {/* Member ID Field */}
              <Form.Item
                label={
                  <span className="form-label">
                    <UserOutlined className="label-icon" />
                    Member Selection
                    {selectedMember && (
                      <span style={{ color: '#10b981', marginLeft: '8px', fontSize: '14px' }}>
                        ({selectedMember.FName} {selectedMember.LName})
                      </span>
                    )}
                  </span>
                }
                validateStatus={formErrors.id ? 'error' : ''}
                help={formErrors.id}
                className="form-item"
              >
                {userRole === 'Member' ? (
                  <input
                    value={id}
                    name="Id"
                    id="Id"
                    placeholder="Auto-filled from your profile"
                    readOnly={true}
                    className="form-input readonly"
                    style={{ 
                      backgroundColor: '#f0f9ff', 
                      fontWeight: 'bold',
                      cursor: 'not-allowed'
                    }}
                  />
                ) : (
                  <Select
                    showSearch
                    value={id || undefined}
                    onChange={handleMemberChange}
                    placeholder="Search by Member ID or Name..."
                    className="form-select"
                    size="large"
                    filterOption={(input, option) => {
                      const searchText = input.toLowerCase();
                      const member = memberList.find(m => m.Member_Id.toString() === option.value);
                      if (!member) return false;
                      
                      const fullName = `${member.FName} ${member.LName}`.toLowerCase();
                      const memberId = member.Member_Id.toString();
                      
                      return fullName.includes(searchText) || memberId.includes(searchText);
                    }}
                  >
                    {memberList.map((member) => (
                      <Option key={member.Member_Id} value={member.Member_Id.toString()}>
                        {member.FName} {member.LName} - ID: {member.Member_Id} ({member.Gender})
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              {/* Date Field */}
              <Form.Item
                label={
                  <span className="form-label">
                    <CalendarOutlined className="label-icon" />
                    Date
                  </span>
                }
                validateStatus={formErrors.date ? 'error' : ''}
                help={formErrors.date}
                className="form-item"
              >
                <DatePicker
                  value={date}
                  onChange={(date) => setDate(date)}
                  placeholder="Select attendance date"
                  className="form-datepicker"
                  size="large"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              {/* In Time Field */}
              <Form.Item
                label={
                  <span className="form-label">
                    <LoginOutlined className="label-icon" />
                    Check-In Time
                  </span>
                }
                validateStatus={formErrors.inTime ? 'error' : ''}
                help={formErrors.inTime}
                className="form-item"
              >
                <TimePicker
                  value={inTime}
                  onChange={(time) => setInTime(time)}
                  format="HH:mm"
                  placeholder="Select check-in time"
                  className="form-timepicker"
                  size="large"
                  minuteStep={5}
                  showNow={true}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              {/* Out Time Field */}
              <Form.Item
                label={
                  <span className="form-label">
                    <LogoutOutlined className="label-icon" />
                    Check-Out Time
                  </span>
                }
                validateStatus={formErrors.outTime ? 'error' : ''}
                help={formErrors.outTime}
                className="form-item"
              >
                <TimePicker
                  value={outTime}
                  onChange={(time) => setOutTime(time)}
                  format="HH:mm"
                  placeholder="Select check-out time"
                  className="form-timepicker"
                  size="large"
                  minuteStep={5}
                  showNow={true}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              {/* Action Buttons */}
              <div className="form-actions">
                <Button 
                  type="primary" 
                  htmlType="submit"
                  className="submit-button"
                  size="large"
                  icon={<ClockCircleOutlined />}
                >
                  Mark Attendance
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
