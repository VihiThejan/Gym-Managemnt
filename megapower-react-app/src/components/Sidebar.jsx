import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  DollarOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  AppstoreOutlined,
  BellOutlined,
  BarChartOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const { Sider } = Layout;
const { Title } = Typography;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <AppstoreOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/MemberTable',
      icon: <TeamOutlined />,
      label: 'Members',
    },
    {
      key: '/staffTable',
      icon: <UserOutlined />,
      label: 'Staff',
    },
    {
      key: '/Equipmenttable',
      icon: <ShopOutlined />,
      label: 'Equipment',
    },
    {
      key: '/Attendancetable',
      icon: <CalendarOutlined />,
      label: 'Attendance',
    },
    {
      key: '/payment',
      icon: <DollarOutlined />,
      label: 'Payments',
    },
    {
      key: '/Announcementtable',
      icon: <BellOutlined />,
      label: 'Announcements',
    },
    {
      key: '/Chat',
      icon: <MessageOutlined />,
      label: 'Chat',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      navigate('/');
    } else {
      navigate(key);
    }
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      className="dashboard-sider"
      width={260}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div className="sidebar-logo">
        <div className="logo-icon">💪</div>
        <Title level={4} className="logo-text">Mega Power</Title>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="sidebar-menu"
        items={menuItems}
        onClick={handleMenuClick}
      />

      <div className="sidebar-footer">
        <Menu
          mode="inline"
          className="sidebar-menu logout-menu"
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
              className: 'logout-menu-item',
            }
          ]}
          onClick={handleMenuClick}
        />
      </div>
    </Sider>
  );
};
