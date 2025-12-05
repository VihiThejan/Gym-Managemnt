import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Space, Button, Dropdown, Menu, Avatar, Empty, Spin, Badge, Tag, message } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined,
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  NotificationOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BellOutlined,
  DashboardOutlined,
  DollarOutlined,
  ScheduleOutlined,
  CommentOutlined,
  MessageOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Logo from './components/Logo';
import './MemberAnnouncements.css';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const items = [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/MemberDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '2', path: '/MemberProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/MemberPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '4', path: '/MemberAnnouncements' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '5', path: '/MemberAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '6', path: '/MemberAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '7', path: '/chat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '8', path: '/Trainerrate' },
  { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '9', path: '/WorkoutTracker' },
];

export const MemberAnnouncements = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/announcement/list");
      // Sort by date, newest first
      const sortedData = (response?.data?.data || []).sort((a, b) => 
        moment(b.Date_Time).unix() - moment(a.Date_Time).unix()
      );
      setAnnouncements(sortedData);
    } catch (error) {
      console.error(`Error fetching announcements: ${error.message}`);
      message.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = ({ key }) => {
    const item = items.find(i => i.key === key);
    if (item && item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('login');
    navigate('/');
  };

  const getFilteredAnnouncements = () => {
    const now = moment();
    switch (filter) {
      case 'today':
        return announcements.filter(a => moment(a.Date_Time).isSame(now, 'day'));
      case 'week':
        return announcements.filter(a => moment(a.Date_Time).isAfter(now.clone().subtract(7, 'days')));
      case 'month':
        return announcements.filter(a => moment(a.Date_Time).isAfter(now.clone().subtract(30, 'days')));
      default:
        return announcements;
    }
  };

  const getTimeAgo = (dateTime) => {
    const now = moment();
    const date = moment(dateTime);
    const diffDays = now.diff(date, 'days');
    
    if (diffDays === 0) {
      const diffHours = now.diff(date, 'hours');
      if (diffHours === 0) {
        const diffMinutes = now.diff(date, 'minutes');
        return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else {
      return date.format('MMM DD, YYYY');
    }
  };

  const isNew = (dateTime) => {
    return moment().diff(moment(dateTime), 'days') <= 3;
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  if (loading) {
    return (
      <Layout hasSider>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          width={250}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
          }}
          className="dashboard-sider"
        >
          <div className="logo-container">
            <Logo size="small" showText={!collapsed} variant="white" />
          </div>
        </Sider>
        <Layout className="main-layout" style={{ marginInlineStart: collapsed ? 80 : 250 }}>
          <Content className="loading-content">
            <Card className="loading-card">
              <Space direction="vertical" size="large" align="center">
                <Spin size="large" />
                <Title level={4}>Loading announcements...</Title>
              </Space>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout hasSider className="member-announcements-layout">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
        }}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={['4']}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout className="main-layout" style={{ marginInlineStart: collapsed ? 80 : 250 }}>
        {/* Header */}
        <Header className="announcements-header">
          <Space size="large">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="menu-toggle-btn"
            />
            <Title level={4} className="page-title">
              <NotificationOutlined className="page-title-icon" />
              Announcements
            </Title>
          </Space>

          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" icon={<UserOutlined />} onClick={() => navigate('/MemberProfile')}>
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Avatar 
                size="large"
                icon={<UserOutlined />}
                className="user-avatar"
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content className="announcements-content">
          <div className="content-container">
            {/* Filter Header */}
            <Card className="filter-card">
              <div className="filter-header">
                <div className="filter-info">
                  <BellOutlined className="bell-icon" />
                  <div>
                    <Title level={5} className="filter-title">All Announcements</Title>
                    <Text className="filter-subtitle">
                      Stay updated with the latest news and information
                    </Text>
                  </div>
                </div>
                <Space size="middle" className="filter-buttons">
                  <Button 
                    type={filter === 'all' ? 'primary' : 'default'}
                    onClick={() => setFilter('all')}
                    className="filter-btn"
                  >
                    All
                  </Button>
                  <Button 
                    type={filter === 'today' ? 'primary' : 'default'}
                    onClick={() => setFilter('today')}
                    className="filter-btn"
                  >
                    Today
                  </Button>
                  <Button 
                    type={filter === 'week' ? 'primary' : 'default'}
                    onClick={() => setFilter('week')}
                    className="filter-btn"
                  >
                    This Week
                  </Button>
                  <Button 
                    type={filter === 'month' ? 'primary' : 'default'}
                    onClick={() => setFilter('month')}
                    className="filter-btn"
                  >
                    This Month
                  </Button>
                </Space>
              </div>
            </Card>

            {/* Announcements List */}
            <div className="announcements-list">
              {filteredAnnouncements.length === 0 ? (
                <Card className="empty-card">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div>
                        <Title level={4}>No Announcements</Title>
                        <Text type="secondary">
                          {filter === 'all' 
                            ? 'There are no announcements at this time.' 
                            : `No announcements found for the selected time period.`}
                        </Text>
                      </div>
                    }
                  />
                </Card>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <Card 
                    key={announcement.Announcement_ID} 
                    className="announcement-card"
                    hoverable
                  >
                    <div className="announcement-header">
                      <div className="announcement-meta">
                        <Badge 
                          status="processing" 
                          text={
                            <Space size="small">
                              <CalendarOutlined />
                              <Text className="announcement-date">
                                {moment(announcement.Date_Time).format('MMMM DD, YYYY')}
                              </Text>
                            </Space>
                          } 
                        />
                        <Text className="announcement-time">
                          <ClockCircleOutlined /> {getTimeAgo(announcement.Date_Time)}
                        </Text>
                      </div>
                      {isNew(announcement.Date_Time) && (
                        <Tag color="success" className="new-badge">NEW</Tag>
                      )}
                    </div>
                    
                    <div className="announcement-content">
                      <NotificationOutlined className="announcement-icon" />
                      <Paragraph className="announcement-message">
                        {announcement.Message}
                      </Paragraph>
                    </div>

                    <div className="announcement-footer">
                      <Text type="secondary" className="announcement-author">
                        <UserOutlined /> Posted by Admin/Staff #{announcement.Staff_ID}
                      </Text>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Summary Card */}
            {filteredAnnouncements.length > 0 && (
              <Card className="summary-card">
                <Space size="large" className="summary-content">
                  <div className="summary-item">
                    <Text type="secondary">Total Announcements</Text>
                    <Title level={3}>{filteredAnnouncements.length}</Title>
                  </div>
                  <div className="summary-item">
                    <Text type="secondary">New This Week</Text>
                    <Title level={3}>
                      {announcements.filter(a => 
                        moment().diff(moment(a.Date_Time), 'days') <= 7
                      ).length}
                    </Title>
                  </div>
                  <div className="summary-item">
                    <Text type="secondary">Latest Update</Text>
                    <Title level={3}>
                      {announcements.length > 0 
                        ? getTimeAgo(announcements[0].Date_Time)
                        : 'N/A'}
                    </Title>
                  </div>
                </Space>
              </Card>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
