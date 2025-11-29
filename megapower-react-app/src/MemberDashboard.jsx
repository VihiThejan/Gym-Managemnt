import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Typography, Input, Badge, Avatar, Dropdown, Button, Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  MenuUnfoldOutlined, 
  UserOutlined, 
  DollarOutlined, 
  NotificationOutlined, 
  CalendarOutlined, 
  BarChartOutlined, 
  BellOutlined, 
  CommentOutlined, 
  MessageOutlined, 
  StarOutlined, 
  ScheduleOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  FireOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './components/Logo';
import './MemberDashboard.css';

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
  background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
};

const items = [
  { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '1', path: '/MemberDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '2', path: '/MemberProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/MemberPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '4', path: '/Announcementtable' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '5', path: '/Attendancetable' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '7', path: '/Appoinmenttable' },
  { label: 'Feedback', icon: <CommentOutlined />, key: '8', path: '/Feedback' },
  { label: 'Chat', icon: <MessageOutlined />, key: '9', path: '/chat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '10', path: '/Trainerrate' },
];

export const MemberDashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalAttendance: 0,
    upcomingAppointments: 0,
    completedWorkouts: 0,
    goalProgress: 75
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemberDashboardStats();
  }, []);

  const fetchMemberDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Get current member ID from localStorage or context
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
      
      // Fetch attendance for current member
      const attendanceRes = await axios.get('http://localhost:5000/api/v1/attendance/list');
      const memberAttendance = attendanceRes.data?.data?.filter(
        att => att.memberId === parseInt(memberId)
      ) || [];
      
      // Fetch appointments for current member
      const appointmentsRes = await axios.get('http://localhost:5000/api/v1/appointment/list');
      const memberAppointments = appointmentsRes.data?.data?.filter(
        app => app.memberid === parseInt(memberId)
      ) || [];
      
      // Fetch schedules for completed workouts
      const schedulesRes = await axios.get('http://localhost:5000/api/v1/schedule/list');
      const memberWorkouts = schedulesRes.data?.data?.filter(
        schedule => schedule.memberId === parseInt(memberId)
      ) || [];

      setStats({
        totalAttendance: memberAttendance.length,
        upcomingAppointments: memberAppointments.length,
        completedWorkouts: memberWorkouts.length,
        goalProgress: memberAttendance.length > 0 ? Math.min((memberAttendance.length / 30) * 100, 100) : 0
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching member dashboard stats:', error);
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
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2">Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout hasSider className="member-dashboard-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
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
      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="dashboard-content-layout">
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="dashboard-header">
          
          <div className="welcome-text">
            Welcome to Mega Power
          </div>

          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="header-actions">
            <Search 
              placeholder="Search here..." 
              onSearch={handleSearch} 
              style={{ width: 200 }} 
              className="header-search"
            />
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} className="notification-bell" />
            </Badge>
            <Dropdown overlay={profileMenu} trigger={['click']}>
              <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} className="profile-avatar" />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} className="dashboard-main-content">
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 360,
            }}
            className="dashboard-content-wrapper"
          >
            <h2 className="dashboard-title">Member Dashboard</h2>
            
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="stats-row">
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-purple">
                  <Statistic
                    title={<span style={{ color: 'white' }}>Total Attendance</span>}
                    value={stats.totalAttendance}
                    prefix={<CalendarOutlined style={{ color: 'white' }} />}
                    suffix={<span style={{ color: 'white', fontSize: 14 }}>days</span>}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-pink">
                  <Statistic
                    title={<span style={{ color: 'white' }}>Appointments</span>}
                    value={stats.upcomingAppointments}
                    prefix={<ScheduleOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-blue">
                  <Statistic
                    title={<span style={{ color: 'white' }}>Completed Workouts</span>}
                    value={stats.completedWorkouts}
                    prefix={<TrophyOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} className="stat-card stat-card-green">
                  <div style={{ color: 'white' }}>
                    <div style={{ fontSize: 14, marginBottom: 8 }}>Monthly Goal</div>
                    <Progress 
                      type="circle" 
                      percent={Math.round(stats.goalProgress)} 
                      width={80}
                      strokeColor="white"
                      format={percent => <span style={{ color: 'white', fontWeight: 'bold' }}>{percent}%</span>}
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} md={12}>
                <Card 
                  title="Quick Actions" 
                  bordered={false}
                  className="action-card"
                >
                  <div className="action-buttons-container">
                    <Button type="primary" icon={<ScheduleOutlined />} onClick={() => navigate('/Appoinmenttable')} block className="action-button">
                      View My Appointments
                    </Button>
                    <Button type="primary" icon={<CalendarOutlined />} onClick={() => navigate('/Scheduletable')} block className="action-button">
                      View Training Schedule
                    </Button>
                    <Button type="primary" icon={<CommentOutlined />} onClick={() => navigate('/Feedback')} block className="action-button">
                      Give Feedback
                    </Button>
                    <Button type="primary" icon={<StarOutlined />} onClick={() => navigate('/Trainerrate')} block className="action-button">
                      Rate Trainer
                    </Button>
                    <Button type="primary" icon={<MessageOutlined />} onClick={() => navigate('/chat')} block className="action-button">
                      Chat with Trainer
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card 
                  title="Your Progress" 
                  bordered={false}
                  className="progress-card"
                >
                  <div className="progress-items-container">
                    <div className="progress-item">
                      <Typography.Text>🔥 {stats.totalAttendance} days attended this month</Typography.Text>
                    </div>
                    <div className="progress-item">
                      <Typography.Text>💪 {stats.completedWorkouts} workouts completed</Typography.Text>
                    </div>
                    <div className="progress-item">
                      <Typography.Text>📅 {stats.upcomingAppointments} upcoming appointments</Typography.Text>
                    </div>
                    <div className="progress-item">
                      <Typography.Text>🎯 {Math.round(stats.goalProgress)}% monthly goal achieved</Typography.Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Motivation Section */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card 
                  title={<span><FireOutlined /> Keep Going!</span>}
                  bordered={false}
                  className="motivation-card"
                >
                  <Typography.Paragraph style={{ fontSize: 16, marginBottom: 8 }}>
                    <strong>Great job on your fitness journey! 💪</strong>
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    You've attended {stats.totalAttendance} training sessions. Keep up the excellent work!
                  </Typography.Paragraph>
                  {stats.goalProgress < 100 && (
                    <Typography.Paragraph style={{ color: '#d4380d' }}>
                      <ClockCircleOutlined /> You're {Math.round(100 - stats.goalProgress)}% away from your monthly goal. You can do it!
                    </Typography.Paragraph>
                  )}
                  {stats.goalProgress >= 100 && (
                    <Typography.Paragraph style={{ color: '#52c41a' }}>
                      <TrophyOutlined /> Congratulations! You've achieved your monthly goal! 🎉
                    </Typography.Paragraph>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }} className="dashboard-footer">
          Gym Mega Power ©{new Date().getFullYear()} Created by K. Janith Chanuka
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MemberDashboard;