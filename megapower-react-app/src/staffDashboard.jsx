import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Typography, Input, Badge, Avatar, Dropdown, Button, Card, Row, Col, Statistic } from 'antd';
import { MenuUnfoldOutlined, UserOutlined, DollarOutlined, NotificationOutlined, CalendarOutlined, BellOutlined, PhoneOutlined, MessageOutlined, ArrowLeftOutlined, TeamOutlined, CheckCircleOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '1', path: '/dashboard' },
  { label: 'Staff', icon: <UserOutlined />, key: '2', path: '/staffTable' },
  { label: 'Payment', icon: <DollarOutlined />, key: '5', path: '/payment' },
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
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2">Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={250}
        style={{ ...siderStyle, backgroundColor: '#001529' }}
      >
        <div style={logoStyle}>
          <img 
            src="" 
            alt="" 
            style={{ marginRight: '8px', borderRadius: '50%' }} 
          />
          {!collapsed && <Text style={{ color: '#FFF9B0', fontSize: '20px' }}>Mega Power</Text>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={handleMenuClick}
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} style={menuItemStyle} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }}>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack} 
              style={{ 
                marginRight: '8px', 
                color: 'black', 
                fontWeight: 'bold', 
                fontSize: '15px', 
              }}
            >
              Back
            </Button>
          </div>

          
          <div style={{ 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            fontSize: '16px', 
            color: '#a9a9a9' 
          }}>
            Welcome to Mega Power
          </div>

          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Search 
              placeholder="Search here..." 
              onSearch={handleSearch} 
              style={{ width: 200 }} 
            />
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
            </Badge>
            <Dropdown overlay={profileMenu} trigger={['click']}>
              <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 360,
            }}
          >
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>Staff Dashboard</h2>
            
            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Today's Attendance</span>}
                    value={stats.todayAttendance}
                    prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Appointments</span>}
                    value={stats.totalAppointments}
                    prefix={<PhoneOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Pending Tasks</span>}
                    value={stats.pendingTasks}
                    prefix={<ClockCircleOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Completed Sessions</span>}
                    value={stats.completedSessions}
                    prefix={<TeamOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} md={12}>
                <Card 
                  title="Quick Actions" 
                  bordered={false}
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Button type="primary" icon={<CalendarOutlined />} onClick={() => navigate('/Attendance')} block>
                      Mark Attendance
                    </Button>
                    <Button type="primary" icon={<PhoneOutlined />} onClick={() => navigate('/Appoinment')} block>
                      Schedule Appointment
                    </Button>
                    <Button type="primary" icon={<NotificationOutlined />} onClick={() => navigate('/Announcement')} block>
                      View Announcements
                    </Button>
                    <Button type="primary" icon={<MessageOutlined />} onClick={() => navigate('/chat')} block>
                      Open Chat
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card 
                  title="Today's Summary" 
                  bordered={false}
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Typography.Text>✅ {stats.todayAttendance} members attended today</Typography.Text>
                    </div>
                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Typography.Text>📞 {stats.totalAppointments} total appointments</Typography.Text>
                    </div>
                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Typography.Text>⏳ {stats.pendingTasks} pending tasks</Typography.Text>
                    </div>
                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Typography.Text>💪 {stats.completedSessions} training sessions completed</Typography.Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Important Notes */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card 
                  title="Important Notes" 
                  bordered={false}
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                  <Typography.Paragraph>
                    🎯 Remember to check and update member attendance regularly
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    📋 Review upcoming appointments and prepare training schedules
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    💬 Respond to member messages and queries in the chat section
                  </Typography.Paragraph>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Gym Mega Power ©{new Date().getFullYear()} Created by K. Janith Chanuka
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffDashboard;