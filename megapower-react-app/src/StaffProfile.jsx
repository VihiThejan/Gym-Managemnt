import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  Button, Radio, Select, DatePicker, message, Form, Input,
  Card, Layout, Menu, Avatar, Typography, Row, Col, Divider, Space, Dropdown
} from 'antd';
import {
  SaveOutlined, CloseOutlined, UserOutlined, HomeOutlined,
  CalendarOutlined, MailOutlined, PhoneOutlined, IdcardOutlined,
  LockOutlined, ManOutlined, DashboardOutlined,
  NotificationOutlined, MessageOutlined, StarOutlined, ScheduleOutlined,
  DollarOutlined, MenuUnfoldOutlined, MenuFoldOutlined,
  LogoutOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined,
  TrophyOutlined, TeamOutlined
} from '@ant-design/icons';
import Logo from './components/Logo';
import './MemberProfile.css';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const getMenuItems = () => [
  { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '/staffDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '/staffProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '/staffPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '/staffAnnouncement' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '/staffAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '/staffAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '/staffChat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '/Trainerrate' },
  { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '/WorkoutTracker' },
];

export const StaffProfile = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();

  // Get staff ID from localStorage
  const getLoginData = () => {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsedData = JSON.parse(loginData);
        return parsedData.Staff_ID || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const staffId = getLoginData();

  // State variables
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [jobRole, setJobRole] = useState('Trainer');
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!staffId) {
      message.error('No staff ID found. Please login again.');
      navigate('/');
      return;
    }
    fetchStaffProfile();
  }, [staffId]);

  const fetchStaffProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/v1/staffmember/${staffId}`);
      const staff = response.data.data;

      const profileData = {
        name: staff.FName,
        date: staff.DOB ? moment(staff.DOB) : null,
        gender: staff.Gender,
        email: staff.Email,
        address: staff.Address,
        mobile: staff.Contact_No,
        jobRole: staff.Job_Role,
      };

      setName(profileData.name);
      setDate(profileData.date);
      setGender(profileData.gender);
      setEmail(profileData.email);
      setAddress(profileData.address);
      setMobile(profileData.mobile);
      setJobRole(profileData.jobRole);

      form.setFieldsValue(profileData);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching staff data: ${error.message}`);
      message.error('Failed to load your profile');
      setLoading(false);
    }
  };

  const validateMobile = (mobile) => {
    const cleanedMobile = mobile.replace(/\D/g, '');
    return cleanedMobile.length >= 10;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async () => {
    // Validation
    if (!name || !address || !email || !mobile || !date || !jobRole) {
      message.error("Please fill in all required fields.");
      return;
    }

    if (!validateMobile(mobile)) {
      message.error("Invalid mobile number. Should be at least 10 digits.");
      return;
    }

    if (!validateEmail(email)) {
      message.error("Invalid email format.");
      return;
    }

    // Password validation if changing
    if (showPasswordFields) {
      if (!newPassword || !confirmPassword) {
        message.error("Please fill in all password fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        message.error("New passwords do not match.");
        return;
      }

      if (!validatePassword(newPassword)) {
        message.error("Password must be at least 6 characters with uppercase, lowercase, number, and special character.");
        return;
      }
    }

    try {
      setSubmitting(true);

      const body = {
        FName: name,
        DOB: date ? date.toISOString() : null,
        Gender: gender,
        Email: email,
        Address: address,
        Contact_No: mobile,
        Job_Role: jobRole,
      };

      if (showPasswordFields && newPassword) {
        body.Password = newPassword;
      }

      await axios.put(`http://localhost:5000/api/v1/staffmember/update/${staffId}`, body);
      message.success("Profile updated successfully!");

      // Reset password fields
      setShowPasswordFields(false);
      setNewPassword('');
      setConfirmPassword('');

      setSubmitting(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      message.error("Failed to update profile: " + (error.response?.data?.message || error.message));
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success('Logged out successfully');
    navigate('/');
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
  };

  if (loading) {
    return (
      <Layout hasSider>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          style={siderStyle}
          className="dashboard-sider"
        >
          <div className="logo-container">
            <Logo size="small" showText={!collapsed} variant="white" />
          </div>
        </Sider>
        <Layout className="main-layout" style={{ marginInlineStart: collapsed ? 80 : 250 }}>
          <Content className="loading-content">
            <Card className="loading-card">
              <Space direction="vertical" size="large" align="center">
                <div className="loading-spinner">⟳</div>
                <Title level={4}>Loading your profile...</Title>
              </Space>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout hasSider className="member-profile-layout">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={siderStyle}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={['/staffProfile']}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
          className="dashboard-menu"
          style={{ background: 'transparent', border: 'none' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'rgba(102, 126, 234, 0.1)'
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <MenuFoldOutlined style={{ fontSize: '20px', color: 'white' }} />
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout className="main-layout" style={{ marginInlineStart: collapsed ? 80 : 250 }}>
        {/* Header */}
        <Header className="profile-header">
          <Space size="large">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="menu-toggle-btn"
            />
            <Title level={4} className="page-title">
              <UserOutlined className="page-title-icon" />
              My Profile
            </Title>
          </Space>

          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/staffProfile')}>
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Avatar
                size="large"
                icon={<UserOutlined />}
                className="user-avatar"
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content className="profile-content">
          <Card className="profile-card" bordered={false}>
            <Row gutter={[24, 24]}>
              {/* Profile Header Section */}
              <Col span={24}>
                <div className="profile-header-section">
                  <Avatar size={100} icon={<UserOutlined />} className="profile-avatar" />
                  <div className="profile-info">
                    <Title level={2} className="profile-name">{name}</Title>
                    <Text className="profile-role" type="secondary">
                      <IdcardOutlined /> {jobRole}
                    </Text>
                  </div>
                </div>
                <Divider />
              </Col>

              {/* Form Section */}
              <Col span={24}>
                <Form form={form} layout="vertical" className="profile-form">
                  <Row gutter={16}>
                    {/* Full Name */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <UserOutlined /> Full Name
                          </span>
                        }
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                      >
                        <Input
                          placeholder="Enter full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>

                    {/* Email */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <MailOutlined /> Email Address
                          </span>
                        }
                        name="email"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input
                          placeholder="example@mail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>

                    {/* Contact Number */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <PhoneOutlined /> Contact Number
                          </span>
                        }
                        name="mobile"
                        rules={[{ required: true, message: 'Please enter your contact number' }]}
                      >
                        <PhoneInput
                          country={'lk'}
                          value={mobile}
                          onChange={(phone) => setMobile(phone)}
                          inputStyle={{
                            width: '100%',
                            height: '40px',
                            fontSize: '14px',
                          }}
                        />
                      </Form.Item>
                    </Col>

                    {/* Date of Birth */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <CalendarOutlined /> Date of Birth
                          </span>
                        }
                        name="date"
                        rules={[{ required: true, message: 'Please select your date of birth' }]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          value={date}
                          onChange={(date) => setDate(date)}
                          format="YYYY-MM-DD"
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>

                    {/* Gender */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <ManOutlined /> Gender
                          </span>
                        }
                        name="gender"
                        rules={[{ required: true, message: 'Please select your gender' }]}
                      >
                        <Radio.Group
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="gender-radio-group"
                        >
                          <Radio value="Male">Male</Radio>
                          <Radio value="Female">Female</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    {/* Job Role */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <IdcardOutlined /> Job Role
                          </span>
                        }
                        name="jobRole"
                        rules={[{ required: true, message: 'Please select your job role' }]}
                      >
                        <Select
                          value={jobRole}
                          onChange={(value) => setJobRole(value)}
                          className="profile-select"
                        >
                          <Option value="Trainer">Trainer</Option>
                          <Option value="Manager">Manager</Option>
                          <Option value="Receptionist">Receptionist</Option>
                          <Option value="Maintenance">Maintenance</Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    {/* Address */}
                    <Col xs={24}>
                      <Form.Item
                        label={
                          <span className="form-label">
                            <HomeOutlined /> Address
                          </span>
                        }
                        name="address"
                        rules={[{ required: true, message: 'Please enter your address' }]}
                      >
                        <Input.TextArea
                          placeholder="Enter your address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={3}
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Password Section */}
                  <Divider orientation="left">
                    <LockOutlined /> Change Password (Optional)
                  </Divider>

                  {!showPasswordFields ? (
                    <Button
                      type="dashed"
                      icon={<EditOutlined />}
                      onClick={() => setShowPasswordFields(true)}
                      block
                    >
                      Change Password
                    </Button>
                  ) : (
                    <>
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            label={
                              <span className="form-label">
                                <LockOutlined /> New Password
                              </span>
                            }
                          >
                            <Input.Password
                              placeholder="Enter new password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="profile-input"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                            label={
                              <span className="form-label">
                                <LockOutlined /> Confirm Password
                              </span>
                            }
                          >
                            <Input.Password
                              placeholder="Confirm new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="profile-input"
                              suffix={
                                confirmPassword && (
                                  passwordsMatch ?
                                    <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                )
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Button
                        type="dashed"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => {
                          setShowPasswordFields(false);
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        block
                        style={{ marginBottom: '16px' }}
                      >
                        Cancel Password Change
                      </Button>
                    </>
                  )}

                  {/* Action Buttons */}
                  <Divider />
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSubmit}
                        loading={submitting}
                        block
                        size="large"
                        className="save-button"
                      >
                        Save Changes
                      </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={() => navigate('/staffDashboard')}
                        block
                        size="large"
                        className="cancel-button"
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffProfile;
