import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  DollarOutlined,
  BellOutlined,
  BarChartOutlined,
  MessageOutlined,
  SettingOutlined
} from '@ant-design/icons';
import Logo from './Logo';
import '../Dashboard.css';

const { Sider } = Layout;

const AdminSidebar = ({ selectedKey }) => {
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
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    {
      key: '/adminChat',
      icon: <MessageOutlined />,
      label: 'Chat',
    },
    {
      key: 'logout',
      icon: <SettingOutlined />,
      label: 'Logout',
      className: 'logout-menu-item',
    },
  ];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="80"
      className="dashboard-sider"
      width={260}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="sidebar-logo">
        <Logo size="small" showText={true} variant="white" />
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[selectedKey || location.pathname]}
        className="sidebar-menu"
        items={menuItems}
        onClick={({ key }) => {
          if (key === 'logout') {
            navigate('/');
          } else {
            navigate(key);
          }
        }}
      />
    </Sider>
  );
};

export default AdminSidebar;
