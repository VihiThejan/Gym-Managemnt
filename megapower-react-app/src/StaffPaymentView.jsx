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
  CheckCircleOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  BellOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import moment from "moment";
import Logo from './components/Logo';
import './StaffPaymentView.css';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, #1a1f36 0%, #0f1419 100%)',
};

const navigationItems = [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/staffDashboard' },
  { label: 'Staff Info', icon: <TeamOutlined />, key: '2', path: '/staffInfo' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/staffPayment' },
  { label: 'Announcement', icon: <NotificationOutlined />, key: '4', path: '/staffAnnouncement' },
  { label: 'Attendance', icon: <CalendarOutlined />, key: '5', path: '/staffAttendance' },
  { label: 'Appointment', icon: <PhoneOutlined />, key: '6', path: '/staffAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '7', path: '/chat' },
];

const StaffPaymentView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/payment/list");
      const payments = res?.data?.data || [];
      setData(payments);
      setFilteredData(payments);
      
      const completed = payments.filter(p => p.Payment_Status === 'Completed').length;
      const pending = payments.filter(p => p.Payment_Status === 'Pending').length;
      const totalAmount = payments.reduce((sum, p) => sum + (parseFloat(p.Amount) || 0), 0);
      
      setStats({
        total: payments.length,
        completed,
        pending,
        totalAmount
      });
    } catch (error) {
      message.error('Failed to fetch payment data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Payment_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Member_ID || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Payment_Method || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Payment_Status || '').toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleLogout = () => {
    message.success('Logged out successfully');
    navigate('/login');
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "Payment_ID",
      key: "paymentid",
      fixed: "left",
      width: 130,
      render: (id) => (
        <Tag color="purple" className="id-tag">
          <WalletOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Member ID",
      dataIndex: "Member_ID",
      key: "memberid",
      width: 130,
      render: (id) => (
        <Tag color="blue" className="member-tag">
          <UserOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "amount",
      width: 140,
      render: (amount) => (
        <div className="info-cell">
          <DollarOutlined className="cell-icon" style={{ color: '#059669' }} />
          <span style={{ fontWeight: 600, color: '#059669' }}>Rs. {parseFloat(amount).toFixed(2)}</span>
        </div>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "Payment_Method",
      key: "method",
      width: 150,
      render: (method) => {
        const colors = {
          'Cash': 'green',
          'Card': 'blue',
          'Online': 'purple',
          'Bank Transfer': 'orange'
        };
        return (
          <Tag color={colors[method] || 'default'}>
            {method}
          </Tag>
        );
      },
    },
    {
      title: "Payment Date",
      dataIndex: "Payment_Date",
      key: "date",
      width: 150,
      render: (date) => (
        <div className="info-cell">
          <CalendarOutlined className="cell-icon" />
          <span>{date ? moment(date).format('DD MMM YYYY') : 'N/A'}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "Payment_Status",
      key: "status",
      width: 130,
      fixed: "right",
      render: (status) => {
        const color = status === 'Completed' ? 'success' : 
                     status === 'Pending' ? 'warning' : 'default';
        const icon = status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
        return (
          <Tag color={color} icon={icon}>
            {status || 'Pending'}
          </Tag>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "description",
      width: 250,
      ellipsis: true,
    },
  ];

  return (
    <Layout className="staff-payment-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={siderStyle}
        width={250}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <div className="dashboard-menu">
          {navigationItems.map(({ label, icon, key, path }) => (
            <div
              key={key}
              className={`menu-item ${path === '/staffPayment' ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <span className="menu-icon">{icon}</span>
              {!collapsed && <span className="menu-label">{label}</span>}
            </div>
          ))}
          <div className="menu-divider"></div>
          <div
            className="menu-item logout-item"
            onClick={handleLogout}
          >
            <span className="menu-icon"><LogoutOutlined /></span>
            {!collapsed && <span className="menu-label">Logout</span>}
          </div>
        </div>
      </Sider>

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="staff-payment-header">
          <div className="header-left">
            <div 
              className="trigger-button"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <h2 className="page-title">
              <WalletOutlined style={{ marginRight: '8px' }} />
              Payment Records
            </h2>
          </div>

          <div className="header-right">
            <div className="notification-badge">
              <BellOutlined className="notification-icon" />
              <span className="badge-count">{stats.pending}</span>
            </div>
            <Avatar 
              className="user-avatar" 
              icon={<UserOutlined />}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>

        <Content className="staff-payment-content">
          <div className="content-wrapper">
            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="stats-row">
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card stat-purple">
                  <Statistic
                    title={<span className="stat-title">Total Payments</span>}
                    value={stats.total}
                    prefix={<WalletOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card stat-green">
                  <Statistic
                    title={<span className="stat-title">Completed</span>}
                    value={stats.completed}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card stat-orange">
                  <Statistic
                    title={<span className="stat-title">Pending</span>}
                    value={stats.pending}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card stat-blue">
                  <Statistic
                    title={<span className="stat-title">Total Amount</span>}
                    value={stats.totalAmount.toFixed(2)}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card 
              className="payment-card"
              title={
                <div className="card-title-wrapper">
                  <div className="title-section">
                    <WalletOutlined className="title-icon" />
                    <span className="title-text">Payment Transactions</span>
                  </div>
                  <span className="title-subtitle">View and manage all payment records and transactions</span>
                </div>
              }
              extra={
                <Search
                  placeholder="Search payments..."
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
                rowKey="Payment_ID"
                loading={loading}
                scroll={{ x: 1200 }}
                className="staff-payment-table"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} payments`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
              />
            </Card>
          </div>
        </Content>

        <Footer className="staff-payment-footer">
          <div className="footer-content">
            <span>Mega Power Gym & Fitness © 2025</span>
            <span>Payment Portal</span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffPaymentView;
