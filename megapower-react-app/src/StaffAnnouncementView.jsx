import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Input, Tag, message, Avatar, Row, Col, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  DollarOutlined,
  TeamOutlined, 
  UserOutlined, 
  SearchOutlined,
  DashboardOutlined,
  NotificationOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MessageOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  SoundOutlined
} from "@ant-design/icons";
import moment from "moment";
import Logo from './components/Logo';
import './StaffAnnouncementView.css';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
};

const items = [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/staffDashboard' },
  { label: 'Staff Info', icon: <TeamOutlined />, key: '2', path: '/staffInfo' },
  { label: 'Payment', icon: <DollarOutlined />, key: '5', path: '/staffPayment' },
  { label: 'Announcement', icon: <NotificationOutlined />, key: '6', path: '/staffAnnouncement' },
  { label: 'Attendance', icon: <CalendarOutlined />, key: '7', path: '/Attendancetable' },
  { label: 'Appointment', icon: <PhoneOutlined />, key: '8', path: '/Appoinmenttable' },
  { label: 'Chat', icon: <MessageOutlined />, key: '9', path: '/chat' },
];

const StaffAnnouncementView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    newAnnouncements: 0,
    latestDate: 'N/A'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/announcement/list");
      const announcements = res?.data?.data || [];
      setData(announcements);
      setFilteredData(announcements);
      
      // Calculate stats
      const newAnnouncements = announcements.filter(a => 
        moment().diff(moment(a.Date_Time), 'days') <= 7
      ).length;
      
      const latestDate = announcements.length > 0 
        ? moment(announcements[0]?.Date_Time).format('MMM DD, YYYY')
        : 'N/A';
      
      setStats({
        total: announcements.length,
        newAnnouncements,
        latestDate
      });
    } catch (error) {
      message.error('Failed to fetch announcement data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Announcement_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Staff_ID || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Message || '').toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    message.success('Logged out successfully');
    navigate('/login');
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "Announcement_ID",
      key: "announcement_id",
      fixed: "left",
      width: 100,
      render: (id) => (
        <Tag color="purple" className="id-tag">
          <NotificationOutlined /> #{id}
        </Tag>
      ),
    },
    {
      title: "Admin ID",
      dataIndex: "Staff_ID",
      key: "staff_id",
      width: 120,
      render: (staff_id) => (
        <Tag color="blue" className="admin-tag">
          <IdcardOutlined /> Admin #{staff_id}
        </Tag>
      ),
    },
    {
      title: "Message",
      dataIndex: "Message",
      key: "message",
      width: 400,
      render: (message) => (
        <div className="message-cell" title={message}>
          <BellOutlined className="cell-icon" />
          <span>{message}</span>
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "Date_Time",
      key: "date",
      width: 180,
      render: (date) => (
        <div className="date-cell">
          <ClockCircleOutlined className="cell-icon" />
          <span>{date ? moment(date).format('DD MMM YYYY, HH:mm') : 'N/A'}</span>
        </div>
      ),
      sorter: (a, b) => moment(a.Date_Time).unix() - moment(b.Date_Time).unix(),
    },
    {
      title: "Status",
      dataIndex: "Date_Time",
      key: "status",
      width: 120,
      fixed: "right",
      render: (date) => {
        const isNew = moment().diff(moment(date), 'days') <= 7;
        return (
          <Tag color={isNew ? 'green' : 'default'} className="status-tag">
            {isNew ? 'New' : 'Posted'}
          </Tag>
        );
      },
    },
  ];

  return (
    <Layout className="staff-announcement-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={siderStyle}
        width={250}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" />
        </div>
        <div className="dashboard-menu">
          {items.map(({ label, icon, key, path }) => (
            <div
              key={key}
              className={`menu-item ${path === '/staffAnnouncement' ? 'active' : ''}`}
              onClick={() => handleMenuClick(path)}
            >
              <span className="menu-icon">{icon}</span>
              {!collapsed && <span className="menu-label">{label}</span>}
            </div>
          ))}
        </div>
      </Sider>

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="staff-announcement-header">
          <div className="header-left">
            <div 
              className="trigger-button"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <h2 className="page-title">
              <SoundOutlined style={{ marginRight: '8px' }} />
              Announcements
            </h2>
          </div>

          <div className="header-right">
            <div className="notification-badge">
              <BellOutlined className="notification-icon" />
              <span className="badge-count">{stats.newAnnouncements}</span>
            </div>
            <Avatar 
              className="user-avatar" 
              icon={<UserOutlined />}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>

        <Content className="staff-announcement-content">
          <div className="content-wrapper">
            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="stats-row">
              <Col xs={24} sm={12} lg={8}>
                <Card className="stat-card stat-purple">
                  <Statistic
                    title={<span className="stat-title">Total Announcements</span>}
                    value={stats.total}
                    prefix={<NotificationOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card className="stat-card stat-green">
                  <Statistic
                    title={<span className="stat-title">New (Last 7 Days)</span>}
                    value={stats.newAnnouncements}
                    prefix={<BellOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card className="stat-card stat-blue">
                  <Statistic
                    title={<span className="stat-title">Latest Update</span>}
                    value={stats.latestDate}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card 
              className="announcement-card"
              title={
                <div className="card-title-wrapper">
                  <div className="title-section">
                    <SoundOutlined className="title-icon" />
                    <span className="title-text">Announcement Board</span>
                  </div>
                  <span className="title-subtitle">View all announcements and updates from management</span>
                </div>
              }
              extra={
                <Search
                  placeholder="Search by ID, admin, or message..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                  style={{ width: 400 }}
                />
              }
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="Announcement_ID"
                loading={loading}
                scroll={{ x: 1000 }}
                className="staff-announcement-table"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} announcements`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
              />
            </Card>
          </div>
        </Content>

        <Footer className="staff-announcement-footer">
          <div className="footer-content">
            <span>Mega Power Gym & Fitness © 2025</span>
            <span>Announcements Portal</span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffAnnouncementView;
