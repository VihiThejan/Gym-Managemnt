import React, { useState, useEffect } from 'react';
import { Layout, theme, Typography, Input, Badge, Avatar, Button, Card, Row, Col, Statistic, Menu } from 'antd';
import { 
  MenuUnfoldOutlined,
  MenuFoldOutlined,
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
  DashboardOutlined,
  UserSwitchOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from './components/Logo';
import './staffDashboard.css';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
};

const getMenuItems = () => [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '/staffDashboard' },
  { label: 'Staff Info', icon: <TeamOutlined />, key: '/staffInfo' },
  { label: 'Payment', icon: <DollarOutlined />, key: '/staffPayment' },
  { label: 'Announcement', icon: <NotificationOutlined />, key: '/staffAnnouncement' },
  { label: 'Attendance', icon: <CalendarOutlined />, key: '/staffAttendance' },
  { label: 'Appointment', icon: <PhoneOutlined />, key: '/staffAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '/chat' },
];

export const StaffDashboard = () => {
  const {
    token: { colorBgContainer },
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
  const location = useLocation();

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

  const handleSearch = (value) => {
    console.log('Search:', value);
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/');
  };

  return (
    <Layout hasSider className="staff-dashboard-layout">
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
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
          className="dashboard-menu"
          style={{ background: 'transparent', border: 'none' }}
        />
        <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <Menu
            theme="dark"
            mode="inline"
            items={[{ label: 'Logout', icon: <LogoutOutlined />, key: 'logout' }]}
            onClick={handleLogout}
            className="dashboard-menu"
            style={{ background: 'transparent', border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
          />
        </div>
      </Sider>
      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="dashboard-header" style={{ padding: '0 24px', background: colorBgContainer }}>
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-button"
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
              }}
            />
            <Typography.Title level={4} className="welcome-text" style={{ margin: 0 }}>
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
            <Avatar 
              className="user-avatar" 
              icon={<UserOutlined />}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>
        <Content className="dashboard-content">
          <div className="content-wrapper">
            {/* Welcome Section with Stats */}
            <div className="dashboard-hero">
              <div className="hero-content">
                <Typography.Title level={2} className="hero-title">
                  Welcome Back! 👋
                </Typography.Title>
                <Typography.Text className="hero-subtitle">
                  Here's what's happening with your gym today
                </Typography.Text>
              </div>
            </div>
            
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="stats-row">
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-purple" hoverable>
                  <div className="stat-card-content">
                    <div className="stat-icon-wrapper">
                      <CheckCircleOutlined className="stat-icon" />
                    </div>
                    <div className="stat-details">
                      <Statistic
                        title={<span className="stat-title">Attendance</span>}
                        value={stats.todayAttendance}
                        suffix={<span className="stat-suffix">members</span>}
                      />
                      <div className="stat-trend">
                        <span className="trend-positive">↑ 12% from yesterday</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-pink" hoverable>
                  <div className="stat-card-content">
                    <div className="stat-icon-wrapper">
                      <PhoneOutlined className="stat-icon" />
                    </div>
                    <div className="stat-details">
                      <Statistic
                        title={<span className="stat-title">Appointments</span>}
                        value={stats.totalAppointments}
                        suffix={<span className="stat-suffix">scheduled</span>}
                      />
                      <div className="stat-trend">
                        <span className="trend-positive">↑ 8% this week</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-blue" hoverable>
                  <div className="stat-card-content">
                    <div className="stat-icon-wrapper">
                      <ClockCircleOutlined className="stat-icon" />
                    </div>
                    <div className="stat-details">
                      <Statistic
                        title={<span className="stat-title">Pending Tasks</span>}
                        value={stats.pendingTasks}
                        suffix={<span className="stat-suffix">tasks</span>}
                      />
                      <div className="stat-trend">
                        <span className="trend-neutral">→ No change</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-green" hoverable>
                  <div className="stat-card-content">
                    <div className="stat-icon-wrapper">
                      <TeamOutlined className="stat-icon" />
                    </div>
                    <div className="stat-details">
                      <Statistic
                        title={<span className="stat-title">Completed Sessions</span>}
                        value={stats.completedSessions}
                        suffix={<span className="stat-suffix">sessions</span>}
                      />
                      <div className="stat-trend">
                        <span className="trend-positive">↑ 15% this month</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions & Summary */}
            <Row gutter={[16, 16]} className="action-row">
              <Col xs={24} md={16}>
                <Card 
                  title={
                    <div className="card-title-wrapper">
                      <span className="card-title"><CalendarOutlined /> Quick Actions</span>
                      <span className="card-subtitle">Perform common tasks quickly</span>
                    </div>
                  }
                  bordered={false}
                  className="action-card"
                >
                  <Row gutter={[16, 16]} className="action-grid">
                    <Col xs={24} sm={12}>
                      <div 
                        className="action-tile action-tile-purple" 
                        onClick={() => navigate('/staffAttendance')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && navigate('/staffAttendance')}
                      >
                        <div className="action-tile-icon">
                          <CalendarOutlined />
                        </div>
                        <div className="action-tile-content">
                          <h4>Mark Attendance</h4>
                          <p>Record member check-ins</p>
                        </div>
                        <div className="action-tile-arrow">→</div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div 
                        className="action-tile action-tile-pink" 
                        onClick={() => navigate('/staffAppointment')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && navigate('/staffAppointment')}
                      >
                        <div className="action-tile-icon">
                          <PhoneOutlined />
                        </div>
                        <div className="action-tile-content">
                          <h4>Appointments</h4>
                          <p>Schedule new sessions</p>
                        </div>
                        <div className="action-tile-arrow">→</div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div 
                        className="action-tile action-tile-blue" 
                        onClick={() => navigate('/staffAnnouncement')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && navigate('/staffAnnouncement')}
                      >
                        <div className="action-tile-icon">
                          <NotificationOutlined />
                        </div>
                        <div className="action-tile-content">
                          <h4>Announcements</h4>
                          <p>Create & view updates</p>
                        </div>
                        <div className="action-tile-arrow">→</div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div 
                        className="action-tile action-tile-green" 
                        onClick={() => navigate('/chat')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && navigate('/chat')}
                      >
                        <div className="action-tile-icon">
                          <MessageOutlined />
                        </div>
                        <div className="action-tile-content">
                          <h4>Messages</h4>
                          <p>Chat with members</p>
                        </div>
                        <div className="action-tile-arrow">→</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card 
                  title={
                    <div className="card-title-wrapper">
                      <span className="card-title"><ClockCircleOutlined /> Activity Timeline</span>
                      <span className="card-subtitle">Recent activities</span>
                    </div>
                  }
                  bordered={false}
                  className="timeline-card"
                >
                  <div className="timeline-container">
                    <div className="timeline-item">
                      <div className="timeline-marker timeline-marker-purple"></div>
                      <div className="timeline-content">
                        <div className="timeline-time">2 mins ago</div>
                        <div className="timeline-text">New member checked in</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-marker timeline-marker-pink"></div>
                      <div className="timeline-content">
                        <div className="timeline-time">15 mins ago</div>
                        <div className="timeline-text">Appointment scheduled</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-marker timeline-marker-blue"></div>
                      <div className="timeline-content">
                        <div className="timeline-time">1 hour ago</div>
                        <div className="timeline-text">New announcement posted</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-marker timeline-marker-green"></div>
                      <div className="timeline-content">
                        <div className="timeline-time">2 hours ago</div>
                        <div className="timeline-text">Training session completed</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-marker timeline-marker-purple"></div>
                      <div className="timeline-content">
                        <div className="timeline-time">3 hours ago</div>
                        <div className="timeline-text">Member payment received</div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    type="link" 
                    className="view-all-link"
                    block
                  >
                    View All Activities →
                  </Button>
                </Card>
              </Col>
            </Row>

            {/* Quick Info Cards */}
            <Row gutter={[24, 24]} className="info-row">
              <Col xs={24} md={8}>
                <Card bordered={false} className="info-card info-card-purple">
                  <div className="info-card-header">
                    <div className="info-icon">
                      <UserSwitchOutlined />
                    </div>
                    <div className="info-badge">Today</div>
                  </div>
                  <div className="info-card-content">
                    <h3>Attendance Tracking</h3>
                    <p>Keep member check-ins updated and monitor daily attendance patterns for better service.</p>
                    <Button 
                      type="text" 
                      icon={<CalendarOutlined />}
                      onClick={() => navigate('/staffAttendance')}
                      className="info-card-link"
                    >
                      View Records
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} className="info-card info-card-pink">
                  <div className="info-card-header">
                    <div className="info-icon">
                      <ClockCircleOutlined />
                    </div>
                    <div className="info-badge">Upcoming</div>
                  </div>
                  <div className="info-card-content">
                    <h3>Appointments</h3>
                    <p>Review and manage upcoming training sessions and member appointments effectively.</p>
                    <Button 
                      type="text" 
                      icon={<CalendarOutlined />}
                      onClick={() => navigate('/staffAppointment')}
                      className="info-card-link"
                    >
                      View Schedule
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} className="info-card info-card-blue">
                  <div className="info-card-header">
                    <div className="info-icon">
                      <MessageOutlined />
                    </div>
                    <div className="info-badge">Active</div>
                  </div>
                  <div className="info-card-content">
                    <h3>Member Communication</h3>
                    <p>Stay connected with members through chat and respond to their queries promptly.</p>
                    <Button 
                      type="text" 
                      icon={<MessageOutlined />}
                      onClick={() => navigate('/chat')}
                      className="info-card-link"
                    >
                      Open Chat
                    </Button>
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