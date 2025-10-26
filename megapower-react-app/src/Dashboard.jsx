import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Typography, Input, Badge, Avatar, Dropdown, Modal, message, Button, Card, Row, Col, Statistic } from 'antd';
import { MenuUnfoldOutlined, UserOutlined, ShopOutlined, DollarOutlined, NotificationOutlined, CalendarOutlined, BarChartOutlined, BellOutlined, ArrowLeftOutlined, TeamOutlined, RiseOutlined, CheckCircleOutlined 
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
  { label: 'Member', icon: <UserOutlined />, key: '3', path: '/MemberTable' },
  { label: 'Equipment', icon: <ShopOutlined />, key: '4', path: '/Equipmenttable' },
  { label: 'Payment', icon: <DollarOutlined />, key: '5', path: '/payment' },
  { label: 'Announcement', icon: <NotificationOutlined />, key: '6', path: '/Announcementtable' },
  { label: 'Attendance', icon: <CalendarOutlined />, key: '7', path: '/Attendancetable' },
  { label: 'Reports', icon: <BarChartOutlined />, key: '8', path: '/reports' },
];

export const Dashboard = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalStaff: 0,
    totalEquipment: 0,
    totalRevenue: 0,
    activeMembers: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch members
      const membersRes = await axios.get('http://localhost:5000/api/v1/member/list');
      const totalMembers = membersRes.data?.data?.length || 0;
      
      // Fetch staff
      const staffRes = await axios.get('http://localhost:5000/api/v1/staffmember/list');
      const totalStaff = staffRes.data?.data?.length || 0;
      
      // Fetch equipment
      const equipmentRes = await axios.get('http://localhost:5000/api/v1/equipment/list');
      const totalEquipment = equipmentRes.data?.data?.length || 0;
      
      // Fetch payments
      const paymentsRes = await axios.get('http://localhost:5000/api/v1/payment/list');
      const payments = paymentsRes.data?.data || [];
      const totalRevenue = payments.reduce((sum, payment) => sum + (parseFloat(payment.Amount) || 0), 0);
      
      // Fetch attendance for active members calculation
      const attendanceRes = await axios.get('http://localhost:5000/api/v1/attendance/list');
      const activeMembers = attendanceRes.data?.data?.length || 0;

      setStats({
        totalMembers,
        totalStaff,
        totalEquipment,
        totalRevenue,
        activeMembers,
        pendingPayments: Math.floor(totalMembers * 0.15) // Mock calculation
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      setProfileData(response.data.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      message.error('Failed to fetch profile data');
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

  const handleProfileClick = () => {
    fetchProfileData(); 
    setIsProfileModalVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/'); 
  };

  

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleProfileClick}>Profile</Menu.Item>
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
                fontSize: '16px', 
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
            <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>Admin Dashboard</h2>
            
            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Total Members</span>}
                    value={stats.totalMembers}
                    prefix={<TeamOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Total Staff</span>}
                    value={stats.totalStaff}
                    prefix={<UserOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Total Equipment</span>}
                    value={stats.totalEquipment}
                    prefix={<ShopOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Total Revenue</span>}
                    value={stats.totalRevenue}
                    prefix={<DollarOutlined style={{ color: 'white' }} />}
                    suffix={<span style={{ color: 'white', fontSize: 16 }}>LKR</span>}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                    precision={2}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Active Members Today</span>}
                    value={stats.activeMembers}
                    prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
                    valueStyle={{ color: 'white', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card loading={loading} bordered={false} style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                  <Statistic
                    title={<span style={{ color: 'white' }}>Pending Payments</span>}
                    value={stats.pendingPayments}
                    prefix={<RiseOutlined style={{ color: 'white' }} />}
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
                    <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/Member')} block>
                      Add New Member
                    </Button>
                    <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/staff')} block>
                      Add New Staff
                    </Button>
                    <Button type="primary" icon={<ShopOutlined />} onClick={() => navigate('/Equipment')} block>
                      Add Equipment
                    </Button>
                    <Button type="primary" icon={<NotificationOutlined />} onClick={() => navigate('/Announcement')} block>
                      Create Announcement
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card 
                  title="Recent Activity" 
                  bordered={false}
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Text>📊 {stats.totalMembers} total members registered</Text>
                    </div>
                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Text>👥 {stats.totalStaff} staff members active</Text>
                    </div>
                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Text>✅ {stats.activeMembers} members attended today</Text>
                    </div>
                    <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <Text>💰 LKR {stats.totalRevenue.toFixed(2)} total revenue</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Gym Mega Power ©{new Date().getFullYear()} Created by K. Janith Chanuka
        </Footer>
      </Layout>

      
      <Modal
        title="Profile Information"
        visible={isProfileModalVisible}
        onCancel={() => setIsProfileModalVisible(false)}
        footer={null}
      >
        {profileData ? (
          <div>
            <p><strong>Name:</strong> {profileData.Name}</p>
            <p><strong>Username:</strong> {profileData.UserName}</p>
            <p><strong>Contact:</strong> {profileData.Contact}</p>
            <p><strong>Role:</strong> {profileData.role}</p>
          </div>
        ) : (
          <p>Loading profile data...</p>
        )}
      </Modal>
    </Layout>
  );
};

export default Dashboard;


