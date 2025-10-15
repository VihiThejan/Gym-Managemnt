import React, { useState } from 'react';
import { Layout, Menu, theme, Typography, Input, Badge, Avatar, Dropdown, Button } from 'antd';
import { MenuUnfoldOutlined, UserOutlined, DollarOutlined, NotificationOutlined, CalendarOutlined,  BellOutlined, PhoneOutlined,MessageOutlined,ArrowLeftOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 360,
            }}
          >
            <h2>Staff Dashboard Content</h2>
            <p>Welcome to the Staff Dashboard</p>
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