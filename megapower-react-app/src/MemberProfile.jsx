import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { 
  Button, Radio, Select, DatePicker, message, Form, Input, 
  Card, Layout, Menu, Avatar, Typography, Row, Col, Divider, Space, Tooltip, Dropdown 
} from 'antd';
import { 
  SaveOutlined, CloseOutlined, UserOutlined, HomeOutlined, 
  CalendarOutlined, MailOutlined, PhoneOutlined, GiftOutlined, 
  ColumnHeightOutlined, LockOutlined, ManOutlined, DashboardOutlined,
  NotificationOutlined, MessageOutlined, StarOutlined, ScheduleOutlined,
  CommentOutlined, DollarOutlined, MenuUnfoldOutlined, MenuFoldOutlined,
  LogoutOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined 
} from '@ant-design/icons';
import Logo from './components/Logo';
import './MemberProfile.css';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const items = [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/MemberDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '2', path: '/MemberProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/MemberPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '4', path: '/MemberAnnouncements' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '5', path: '/MemberAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '6', path: '/MemberAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '7', path: '/chat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '8', path: '/Trainerrate' },
];

export const MemberProfile = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();

  // Get member ID from localStorage
  const getLoginData = () => {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsedData = JSON.parse(loginData);
        return parsedData.Member_Id || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  };
  
  const memberId = getLoginData();

  // State variables
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [packages, setPackages] = useState('Gold');
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!memberId) {
      message.error('No member ID found. Please login again.');
      navigate('/');
      return;
    }
    fetchMemberProfile();
  }, [memberId]);

  const fetchMemberProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/v1/member/${memberId}`);
      const member = response.data.data;

      const profileData = {
        name: member.FName,
        date: member.DOB ? moment(member.DOB) : null,
        gender: member.Gender,
        email: member.Email,
        address: member.Address,
        mobile: member.Contact,
        packages: member.Package,
        weight: Number(member.Weight),
        height: Number(member.Height),
      };

      setName(profileData.name);
      setDate(profileData.date);
      setGender(profileData.gender);
      setEmail(profileData.email);
      setAddress(profileData.address);
      setMobile(profileData.mobile);
      setPackages(profileData.packages);
      setWeight(profileData.weight);
      setHeight(profileData.height);
      
      form.setFieldsValue(profileData);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching member data: ${error.message}`);
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
    if (!name || !address || !email || !mobile || !date || !height || !weight) {
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

    if (height <= 0 || height > 10) {
      message.error("Height should be between 0.1 and 10 feet.");
      return;
    }

    if (weight <= 0 || weight > 300) {
      message.error("Weight should be between 1 and 300 kg.");
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
        Contact: mobile,
        Package: packages,
        Weight: Number(weight),
        Height: Number(height),
        UName: mobile,
      };

      if (showPasswordFields && newPassword) {
        body.Password = newPassword;
      }

      await axios.put(`http://localhost:5000/api/v1/member/update/${memberId}`, body);
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

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  if (loading) {
    return (
      <Layout hasSider>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          width={250}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
          }}
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
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
        }}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={['2']}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
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
                  <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/MemberProfile')}>
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
          <div className="content-container">
            <Card className="profile-card">
              {/* Page Header */}
              <div className="profile-card-header">
                <Title level={2} className="card-title">
                  <EditOutlined />
                  Edit Your Profile
                </Title>
                <Text className="card-subtitle">
                  Keep your information up to date
                </Text>
              </div>

              <Form layout="vertical" onFinish={handleSubmit} className="profile-form">
                {/* Personal Information Section */}
                <div className="form-section">
                  <Title level={5} className="section-title">
                    <UserOutlined />
                    Personal Information
                  </Title>
                  
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item 
                        label="Full Name" 
                        required
                        tooltip="Enter your full legal name"
                      >
                        <Input
                          size="large"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          prefix={<UserOutlined className="input-icon" />}
                          className="form-input"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item 
                        label="Date of Birth" 
                        required
                        tooltip="Select your birth date"
                      >
                        <DatePicker
                          size="large"
                          className="form-input"
                          value={date}
                          onChange={(date) => setDate(date)}
                          format="YYYY-MM-DD"
                          placeholder="Select date"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Gender" required>
                        <Radio.Group
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          size="large"
                          buttonStyle="solid"
                          className="gender-radio-group"
                        >
                          <Radio.Button value="Male" className="gender-radio-btn">
                            Male
                          </Radio.Button>
                          <Radio.Button value="Female" className="gender-radio-btn">
                            Female
                          </Radio.Button>
                          <Radio.Button value="Other" className="gender-radio-btn">
                            Other
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Package" required>
                        <Select
                          size="large"
                          value={packages}
                          onChange={(value) => setPackages(value)}
                          className="form-input"
                          suffixIcon={<GiftOutlined />}
                        >
                          <Option value="Gold">🥇 Gold Package</Option>
                          <Option value="Silver">🥈 Silver Package</Option>
                          <Option value="Bronze">🥉 Bronze Package</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                {/* Contact Information Section */}
                <div className="form-section">
                  <Title level={5} className="section-title">
                    <MailOutlined />
                    Contact Information
                  </Title>
                  
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Email Address" required>
                        <Input
                          size="large"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          prefix={<MailOutlined className="input-icon" />}
                          className="form-input"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Mobile Number" required>
                        <PhoneInput
                          country={'lk'}
                          value={mobile}
                          onChange={(phone) => setMobile(phone)}
                          inputClass="phone-input"
                          containerClass="phone-input-container"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item label="Address" required>
                        <Input.TextArea
                          rows={3}
                          placeholder="Enter your complete address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="form-input"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                {/* Physical Stats Section */}
                <div className="form-section">
                  <Title level={5} className="section-title">
                    <ColumnHeightOutlined />
                    Physical Statistics
                  </Title>
                  
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item 
                        label="Weight (kg)" 
                        required
                        tooltip="Enter your weight in kilograms"
                      >
                        <Input
                          size="large"
                          type="number"
                          placeholder="e.g., 70"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          prefix={<ColumnHeightOutlined className="input-icon" />}
                          suffix="kg"
                          className="form-input"
                          min={1}
                          max={300}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item 
                        label="Height (feet)" 
                        required
                        tooltip="Enter your height in feet"
                      >
                        <Input
                          size="large"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 5.8"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          prefix={<ColumnHeightOutlined className="input-icon" />}
                          suffix="ft"
                          className="form-input"
                          min={0.1}
                          max={10}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                {/* Password Change Section */}
                <div className="form-section">
                  <div className="password-toggle-container">
                    <Button
                      type={showPasswordFields ? "default" : "dashed"}
                      icon={<LockOutlined />}
                      onClick={() => {
                        setShowPasswordFields(!showPasswordFields);
                        if (showPasswordFields) {
                          setNewPassword('');
                          setConfirmPassword('');
                        }
                      }}
                      size="large"
                      className="password-toggle-btn"
                    >
                      {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                    </Button>
                  </div>

                  {showPasswordFields && (
                    <Card className="password-change-card">
                      <Title level={5} className="section-title">
                        <LockOutlined /> Set New Password
                      </Title>
                      
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Form.Item 
                            label="New Password" 
                            required
                            help="Min 6 characters with uppercase, lowercase, number & special character"
                          >
                            <Input.Password
                              size="large"
                              placeholder="Enter new password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              prefix={<LockOutlined className="input-icon" />}
                              className="form-input"
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                          <Form.Item label="Confirm Password" required>
                            <Input.Password
                              size="large"
                              placeholder="Confirm new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              prefix={<LockOutlined className="input-icon" />}
                              className="form-input"
                            />
                          </Form.Item>
                        </Col>

                        {newPassword && confirmPassword && (
                          <Col xs={24}>
                            {passwordsMatch ? (
                              <Text type="success" className="password-match-text">
                                <CheckCircleOutlined /> Passwords match
                              </Text>
                            ) : (
                              <Text type="danger" className="password-match-text">
                                <CloseCircleOutlined /> Passwords do not match
                              </Text>
                            )}
                          </Col>
                        )}
                      </Row>
                    </Card>
                  )}
                </div>

                <Divider />

                {/* Action Buttons */}
                <div className="action-buttons">
                  <Button
                    size="large"
                    icon={<CloseOutlined />}
                    onClick={() => navigate('/MemberDashboard')}
                    disabled={submitting}
                    className="cancel-btn"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    onClick={handleSubmit}
                    loading={submitting}
                    className="submit-btn"
                  >
                    Update Profile
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </Content>

        {/* Footer */}
        <Footer className="profile-footer">
          <Text type="secondary">
            Mega Power Gym & Fitness © 2025 - All Rights Reserved
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MemberProfile;