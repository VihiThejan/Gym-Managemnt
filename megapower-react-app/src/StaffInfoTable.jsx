import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Input, Tag, message, Avatar, Row, Col, Statistic, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  TeamOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  IdcardOutlined,
  CalendarOutlined,
  SearchOutlined,
  DashboardOutlined,
  DollarOutlined,
  NotificationOutlined,
  MessageOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import moment from "moment";
import Logo from './components/Logo';
import './StaffInfoView.css';
import './staffDashboard.css';

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

const getMenuItems = () => [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '/staffDashboard' },
  { label: 'Staff Info', icon: <TeamOutlined />, key: '/staffInfo' },
  { label: 'Payment', icon: <DollarOutlined />, key: '/staffPayment' },
  { label: 'Announcement', icon: <NotificationOutlined />, key: '/staffAnnouncement' },
  { label: 'Attendance', icon: <CalendarOutlined />, key: '/staffAttendance' },
  { label: 'Appointment', icon: <PhoneOutlined />, key: '/staffAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '/chat' },
];

const StaffInfoTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    trainers: 0,
    male: 0,
    female: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/staffmember/list");
      const staffData = res?.data?.data || [];
      setData(staffData);
      setFilteredData(staffData);
      
      // Calculate stats
      const trainers = staffData.filter(s => s.Job_Role === 'Trainer').length;
      const male = staffData.filter(s => s.Gender === 'Male').length;
      const female = staffData.filter(s => s.Gender === 'Female').length;
      
      setStats({
        total: staffData.length,
        trainers,
        male,
        female
      });
    } catch (error) {
      message.error('Failed to fetch staff information');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Staff_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.FName || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Email || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Job_Role || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Contact_No || '').toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleLogout = () => {
    message.success('Logged out successfully');
    navigate('/');
  };

  const columns = [
    {
      title: "Staff ID",
      dataIndex: "Staff_ID",
      key: "staffid",
      fixed: "left",
      width: 120,
      render: (id) => (
        <Tag color="purple" className="id-tag">
          <IdcardOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Name",
      dataIndex: "FName",
      key: "fname",
      width: 200,
      render: (text, record) => (
        <div className="name-cell">
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ 
              background: record.Gender === 'Male' ? 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
            }}
          />
          <div className="name-info">
            <span className="name-text">{text}</span>
            {record.Gender && (
              <span className="gender-icon">
                {record.Gender === 'Male' ? 
                  <ManOutlined style={{ color: '#667eea' }} /> : 
                  <WomanOutlined style={{ color: '#f5576c' }} />
                }
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Job Role",
      dataIndex: "Job_Role",
      key: "jobrole",
      width: 180,
      render: (role) => {
        const colors = {
          'Manager': 'purple',
          'Trainer': 'blue',
          'Receptionist': 'green',
          'Cleaner': 'orange',
          'Maintenance': 'red'
        };
        return (
          <Tag color={colors[role] || 'default'} className="role-tag">
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      width: 220,
      render: (email) => (
        <div className="info-cell">
          <MailOutlined className="cell-icon" />
          <span>{email}</span>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "Contact_No",
      key: "contact",
      width: 150,
      render: (contact) => (
        <div className="info-cell">
          <PhoneOutlined className="cell-icon" />
          <span>{contact}</span>
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "address",
      width: 250,
      ellipsis: true,
      render: (address) => (
        <div className="info-cell">
          <EnvironmentOutlined className="cell-icon" />
          <span>{address}</span>
        </div>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "Date_of_Birth",
      key: "dob",
      width: 140,
      render: (date) => (
        <div className="info-cell">
          <CalendarOutlined className="cell-icon" />
          <span>{date ? moment(date).format('DD MMM YYYY') : 'N/A'}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      width: 120,
      fixed: "right",
      render: (status) => (
        <Tag color={status === 'Active' ? 'success' : 'default'} className="status-tag">
          {status || 'Active'}
        </Tag>
      ),
    },
  ];

  return (
    <Layout className="staff-info-layout">
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
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={['/staffInfo']}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
          className="dashboard-menu"
          style={{ background: 'transparent', border: 'none' }}
        />
        <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <Menu
            theme="dark"
            mode="inline"
            items={[{ label: 'Logout', icon: <LogoutOutlined />, key: 'logout' }]}
            onClick={handleLogout}
            className="dashboard-menu"
            style={{ background: 'transparent', border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
          />
        </div>
      </Sider>

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="staff-info-header">
          <div className="header-left">
            <div 
              className="trigger-button"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <h2 className="page-title">
              <TeamOutlined style={{ marginRight: '8px' }} />
              Staff Information
            </h2>
          </div>

          <div className="header-right">
            <div className="notification-badge">
              <BellOutlined className="notification-icon" />
              <span className="badge-count">{stats.total}</span>
            </div>
            <Avatar 
              className="user-avatar" 
              icon={<UserOutlined />}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>

        <Content className="staff-info-content">
          <div className="content-wrapper">
            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="stats-row">
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card stat-purple">
                  <Statistic
                    title={<span className="stat-title">Total Staff</span>}
                    value={stats.total}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card stat-blue">
                  <Statistic
                    title={<span className="stat-title">Trainers</span>}
                    value={stats.trainers}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card stat-green">
                  <Statistic
                    title={<span className="stat-title">Male Staff</span>}
                    value={stats.male}
                    prefix={<ManOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card stat-pink">
                  <Statistic
                    title={<span className="stat-title">Female Staff</span>}
                    value={stats.female}
                    prefix={<WomanOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card 
              className="staff-card"
              title={
                <div className="card-title-wrapper">
                  <div className="title-section">
                    <TeamOutlined className="title-icon" />
                    <span className="title-text">Staff Team Directory</span>
                  </div>
                  <span className="title-subtitle">View all staff members and their contact information</span>
                </div>
              }
              extra={
                <Search
                  placeholder="Search by name, ID, role, email or contact..."
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
                rowKey="Staff_ID"
                loading={loading}
                scroll={{ x: 1500 }}
                className="staff-info-table"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} staff members`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
              />
            </Card>
          </div>
        </Content>

        <Footer className="staff-info-footer">
          <div className="footer-content">
            <span>Mega Power Gym & Fitness © 2025</span>
            <span>Staff Information Portal</span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffInfoTable;
