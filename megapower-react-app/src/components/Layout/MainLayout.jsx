import React from 'react';
import { Layout, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  LoginOutlined,
  DashboardOutlined 
} from '@ant-design/icons';
import './MainLayout.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainLayout = ({ children, showNavigation = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = ['/', '/Forgotpw', '/Resetpw', '/Admin'].includes(location.pathname);

  return (
    <Layout className="main-layout">
      <Header className="modern-header">
        <div className="header-content">
          <div className="logo-section" onClick={() => navigate('/')}>
            <div className="logo-icon">💪</div>
            <Title level={3} className="brand-name">Mega Power Gym</Title>
          </div>
          
          {showNavigation && (
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

      <Content className="modern-content">
        <div className="content-wrapper">
          {children}
        </div>
      </Content>

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
    </Layout>
  );
};

export default MainLayout;
