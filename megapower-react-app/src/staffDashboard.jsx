import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Typography, Input, Badge, Avatar, Dropdown, Button, Card, Row, Col, Statistic } from 'antd';
import { 
  MenuUnfoldOutlined, 
  UserOutlined, 
  DollarOutlined, 
  NotificationOutlined, 
  CalendarOutlined, 
  BellOutlined, 
  PhoneOutlined, 
  MessageOutlined, 
  TeamOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './staffDashboard.css';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;
const { Search } = Input;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
};

const logoStyle = {
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
  backgroundColor: '#001529',
  marginBottom: '16px',
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
};

const items = [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/staffDashboard' },
  { label: 'Staff', icon: <TeamOutlined />, key: '2', path: '/staffTable' },
  { label: 'Payment', icon: <DollarOutlined />, key: '5', path: '/Paymenttable' },
  { label: 'Announcement', icon: <NotificationOutlined />, key: '6', path: '/Announcementtable' },
  { label: 'Attendance', icon: <CalendarOutlined />, key: '7', path: '/Attendancetable' },
  { label: 'Appointment', icon: <PhoneOutlined />, key: '8', path: '/Appoinmenttable' },
  { label: 'Chat', icon: <MessageOutlined />, key: '9', path: '/chat' },
];

export const StaffDashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    todayAttendance: 0,
    totalAppointments: 0,
    pendingTasks: 0,
    completedSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffDashboardStats();
  }, []);

  const fetchStaffDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch attendance
      const attendanceRes = await axios.get('http://localhost:5000/api/v1/attendance/list');
      const todayAttendance = attendanceRes.data?.data?.length || 0;
      
      // Fetch appointments
      const appointmentsRes = await axios.get('http://localhost:5000/api/v1/appointment/list');
      const totalAppointments = appointmentsRes.data?.data?.length || 0;
      
      // Fetch schedules for completed sessions
      const schedulesRes = await axios.get('http://localhost:5000/api/v1/schedule/list');
      const completedSessions = schedulesRes.data?.data?.length || 0;

      setStats({
        todayAttendance,
        totalAppointments,
        pendingTasks: Math.floor(totalAppointments * 0.3), // Mock calculation
        completedSessions
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff dashboard stats:', error);
      setLoading(false);
    }
  };

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);  
    }
  };

  const handleSearch = (value) => {
    console.log('Search:', value);
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>Profile</Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout hasSider className="staff-dashboard-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={250}
        style={siderStyle}
        className="dashboard-sider"
      >
        <div style={logoStyle} className="logo-container">
          {!collapsed && <Text className="logo-text">Mega Power Gym</Text>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} style={menuItemStyle} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="dashboard-header" style={{ padding: '0 24px', background: colorBgContainer }}>
          <div className="header-left">
            <Typography.Title level={4} className="welcome-text">
              Staff Dashboard
            </Typography.Title>
          </div>

          <div className="header-right">
            <Search 
              placeholder="Search..." 
              onSearch={handleSearch} 
              className="header-search"
            />
            <Badge count={5} className="notification-badge">
              <BellOutlined className="notification-icon" />
            </Badge>
            <Dropdown overlay={profileMenu} trigger={['click']}>
              <Avatar className="user-avatar" icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Content className="dashboard-content">
          <div className="content-wrapper">
            <div className="page-title-section">
              <Typography.Title level={2} className="page-title">
                Welcome Back! 👋
              </Typography.Title>
              <Typography.Text className="page-subtitle">
                Here's what's happening with your gym today
              </Typography.Text>
            </div>
            
            {/* Statistics Cards */}
            <Row gutter={[24, 24]} className="stats-row">
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-purple">
                  <Statistic
                    title={<span className="stat-title">Today's Attendance</span>}
                    value={stats.todayAttendance}
                    prefix={<CheckCircleOutlined className="stat-icon" />}
                    valueStyle={{ color: 'white', fontWeight: 'bold', fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-pink">
                  <Statistic
                    title={<span className="stat-title">Appointments</span>}
                    value={stats.totalAppointments}
                    prefix={<PhoneOutlined className="stat-icon" />}
                    valueStyle={{ color: 'white', fontWeight: 'bold', fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-blue">
                  <Statistic
                    title={<span className="stat-title">Pending Tasks</span>}
                    value={stats.pendingTasks}
                    prefix={<ClockCircleOutlined className="stat-icon" />}
                    valueStyle={{ color: 'white', fontWeight: 'bold', fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-green">
                  <Statistic
                    title={<span className="stat-title">Completed Sessions</span>}
                    value={stats.completedSessions}
                    prefix={<TeamOutlined className="stat-icon" />}
                    valueStyle={{ color: 'white', fontWeight: 'bold', fontSize: '2rem' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Quick Actions & Summary */}
            <Row gutter={[24, 24]} className="action-row">
              <Col xs={24} md={12}>
                <Card 
                  title={<span className="card-title"><CalendarOutlined /> Quick Actions</span>}
                  bordered={false}
                  className="action-card"
                >
                  <div className="action-buttons">
                    <Button 
                      type="primary" 
                      icon={<CalendarOutlined />} 
                      onClick={() => navigate('/Attendance')} 
                      className="action-button action-button-purple"
                      size="large"
                    >
                      Mark Attendance
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<PhoneOutlined />} 
                      onClick={() => navigate('/Appoinment')} 
                      className="action-button action-button-pink"
                      size="large"
                    >
                      Schedule Appointment
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<NotificationOutlined />} 
                      onClick={() => navigate('/Announcement')} 
                      className="action-button action-button-blue"
                      size="large"
                    >
                      View Announcements
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<MessageOutlined />} 
                      onClick={() => navigate('/chat')} 
                      className="action-button action-button-green"
                      size="large"
                    >
                      Open Chat
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card 
                  title={<span className="card-title"><CheckCircleOutlined /> Today's Summary</span>}
                  bordered={false}
                  className="summary-card"
                >
                  <div className="summary-items">
                    <div className="summary-item summary-item-purple">
                      <CheckCircleOutlined className="summary-icon" />
                      <Typography.Text className="summary-text">
                        <strong>{stats.todayAttendance}</strong> members attended today
                      </Typography.Text>
                    </div>
                    <div className="summary-item summary-item-pink">
                      <PhoneOutlined className="summary-icon" />
                      <Typography.Text className="summary-text">
                        <strong>{stats.totalAppointments}</strong> total appointments
                      </Typography.Text>
                    </div>
                    <div className="summary-item summary-item-blue">
                      <ClockCircleOutlined className="summary-icon" />
                      <Typography.Text className="summary-text">
                        <strong>{stats.pendingTasks}</strong> pending tasks
                      </Typography.Text>
                    </div>
                    <div className="summary-item summary-item-green">
                      <TeamOutlined className="summary-icon" />
                      <Typography.Text className="summary-text">
                        <strong>{stats.completedSessions}</strong> training sessions
                      </Typography.Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Important Notes */}
            <Row gutter={[24, 24]} className="notes-row">
              <Col span={24}>
                <Card 
                  title={<span className="card-title"><NotificationOutlined /> Important Notes</span>}
                  bordered={false}
                  className="notes-card"
                >
                  <div className="notes-content">
                    <div className="note-item">
                      <span className="note-emoji">🎯</span>
                      <Typography.Text className="note-text">
                        Remember to check and update member attendance regularly
                      </Typography.Text>
                    </div>
                    <div className="note-item">
                      <span className="note-emoji">📋</span>
                      <Typography.Text className="note-text">
                        Review upcoming appointments and prepare training schedules
                      </Typography.Text>
                    </div>
                    <div className="note-item">
                      <span className="note-emoji">💬</span>
                      <Typography.Text className="note-text">
                        Respond to member messages and queries in the chat section
                      </Typography.Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer className="dashboard-footer">
          Gym Mega Power ©{new Date().getFullYear()} Created by K. Janith Chanuka
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffDashboard;