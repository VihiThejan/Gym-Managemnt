import React from 'react';
import { Layout, Typography, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  LoginOutlined,
  DashboardOutlined,
  UserOutlined, 
  ShopOutlined, 
  DollarOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  AppstoreOutlined,
  BellOutlined,
  BarChartOutlined,
  MessageOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './MainLayout.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const MainLayout = ({ children, showNavigation = true, showSidebar = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = ['/', '/Forgotpw', '/Resetpw', '/Admin'].includes(location.pathname);

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
    <Layout className="main-layout" hasSider={showSidebar}>
      {showSidebar && (
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
      )}

      <Layout style={{ marginLeft: showSidebar ? 260 : 0, transition: 'margin-left 0.2s' }}>
        <Header className="modern-header">
          <div className="header-content">
            <div className="logo-section" onClick={() => navigate('/')}>
              <div className="logo-icon">💪</div>
              <Title level={3} className="brand-name">Mega Power Gym</Title>
            </div>
            
            {showNavigation && !showSidebar && (
              <nav className="header-nav">
                {isAuthPage ? (
                  <>
                    <a onClick={() => navigate('/')} className="nav-link">
                      <LoginOutlined /> Login
                    </a>
                    <a onClick={() => navigate('/Admin')} className="nav-link nav-link-primary">
                      Register
                    </a>
                  </>
                ) : (
                  <>
                    <a onClick={() => navigate('/Dashboard')} className="nav-link">
                      <DashboardOutlined /> Dashboard
                    </a>
                    <a onClick={() => navigate('/')} className="nav-link">
                      <HomeOutlined /> Home
                    </a>
                  </>
                )}
              </nav>
            )}
          </div>
        </Header>

        <Content className="modern-content" style={{ minHeight: showSidebar ? '100vh' : 'auto' }}>
          <div className="content-wrapper">
            {children}
          </div>
        </Content>

        {!showSidebar && (
          <Footer className="modern-footer">
            <div className="footer-content">
              <div className="footer-section">
                <Title level={5} className="footer-title">Mega Power Gym</Title>
                <p className="footer-text">Transform your body, transform your life</p>
              </div>
              
              <div className="footer-section">
                <h4 className="footer-heading">Quick Links</h4>
                <div className="footer-links">
                  <a onClick={() => navigate('/')}>Home</a>
                  <a onClick={() => navigate('/Admin')}>Register</a>
                  <a onClick={() => navigate('/Dashboard')}>Dashboard</a>
                </div>
              </div>
              
              <div className="footer-section">
                <h4 className="footer-heading">Contact</h4>
                <p className="footer-text">Email: info@megapowergym.com</p>
                <p className="footer-text">Phone: +94 77 123 4567</p>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Mega Power Gym. All rights reserved. | Created by K. Janith Chanuka</p>
            </div>
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};

export default MainLayout;
