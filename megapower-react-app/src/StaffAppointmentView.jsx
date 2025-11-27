import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Input, Tag, message, Avatar, Row, Col } from "antd";
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
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import Logo from './components/Logo';
import './StaffInfoTable.css';

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

const navigationItems = [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/staffDashboard' },
  { label: 'Staff Info', icon: <TeamOutlined />, key: '2', path: '/staffInfo' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/staffPayment' },
  { label: 'Announcement', icon: <NotificationOutlined />, key: '4', path: '/staffAnnouncement' },
  { label: 'Attendance', icon: <CalendarOutlined />, key: '5', path: '/staffAttendance' },
  { label: 'Appointment', icon: <PhoneOutlined />, key: '6', path: '/staffAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '7', path: '/chat' },
];

const StaffAppointmentView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/appointment/list");
      const appointments = res?.data?.data || [];
      setData(appointments);
      setFilteredData(appointments);
      
      const pending = appointments.filter(a => a.Status === 'Pending').length;
      const confirmed = appointments.filter(a => a.Status === 'Confirmed').length;
      const completed = appointments.filter(a => a.Status === 'Completed').length;
      
      setStats({
        total: appointments.length,
        pending,
        confirmed,
        completed
      });
    } catch (error) {
      message.error('Failed to fetch appointment data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    if (value) {
      const filtered = data.filter((item) => 
        String(item.App_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Member_Id || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Staff_ID || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Contact || '').toLowerCase().includes(value.toLowerCase())
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
      title: "Appointment ID",
      dataIndex: "App_ID",
      key: "appid",
      fixed: "left",
      width: 150,
      render: (id) => (
        <Tag color="purple" className="id-tag">
          <PhoneOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "memberid",
      width: 130,
      render: (id) => (
        <Tag color="blue" className="member-tag">
          <UserOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Staff ID",
      dataIndex: "Staff_ID",
      key: "staffid",
      width: 130,
      render: (id) => (
        <Tag color="cyan" className="id-tag">
          <TeamOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "date",
      width: 150,
      render: (date) => (
        <div className="info-cell">
          <CalendarOutlined className="cell-icon" />
          <span>{date ? moment(date).format('DD MMM YYYY') : 'N/A'}</span>
        </div>
      ),
      sorter: (a, b) => moment(a.Date).unix() - moment(b.Date).unix(),
    },
    {
      title: "Time",
      dataIndex: "Time",
      key: "time",
      width: 120,
      render: (time) => (
        <div className="info-cell">
          <ClockCircleOutlined className="cell-icon" />
          <span style={{ fontWeight: 500 }}>{time ? moment(time, 'HH:mm:ss').format('hh:mm A') : 'N/A'}</span>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "Contact",
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
      title: "Status",
      dataIndex: "Status",
      key: "status",
      width: 130,
      fixed: "right",
      render: (status) => {
        const statusConfig = {
          'Pending': { color: 'warning', icon: <ClockCircleOutlined /> },
          'Confirmed': { color: 'processing', icon: <ExclamationCircleOutlined /> },
          'Completed': { color: 'success', icon: <CheckCircleOutlined /> },
          'Cancelled': { color: 'error', icon: <ExclamationCircleOutlined /> }
        };
        const config = statusConfig[status] || { color: 'default', icon: null };
        return (
          <Tag color={config.color} icon={config.icon}>
            {status || 'Pending'}
          </Tag>
        );
      },
    },
    {
      title: "Notes",
      dataIndex: "Notes",
      key: "notes",
      width: 250,
      ellipsis: true,
    },
  ];

  return (
    <Layout className="info-layout">
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
              className={`menu-item ${path === '/staffAppointment' ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <span className="menu-icon">{icon}</span>
              {!collapsed && <span className="menu-label">{label}</span>}
            </div>
          ))}
        </div>
      </Sider>

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="info-header">
          <div className="header-left">
            <div 
              className="trigger-button"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <h2 className="page-title">
              <PhoneOutlined style={{ marginRight: '8px' }} />
              Appointment Records
            </h2>
          </div>

          <div className="header-right">
            <Avatar 
              className="user-avatar" 
              icon={<UserOutlined />}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>

        <Content className="info-content">
          <div className="content-wrapper">
            <Card className="info-card">
              <Row gutter={[16, 16]} className="stats-summary">
                <Col xs={24} sm={12} lg={6}>
                  <div className="stat-box stat-purple">
                    <div className="stat-icon">
                      <PhoneOutlined />
                    </div>
                    <div className="stat-details">
                      <h3>{stats.total}</h3>
                      <p>Total Appointments</p>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className="stat-box stat-orange">
                    <div className="stat-icon">
                      <ClockCircleOutlined />
                    </div>
                    <div className="stat-details">
                      <h3>{stats.pending}</h3>
                      <p>Pending</p>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className="stat-box stat-blue">
                    <div className="stat-icon">
                      <ExclamationCircleOutlined />
                    </div>
                    <div className="stat-details">
                      <h3>{stats.confirmed}</h3>
                      <p>Confirmed</p>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div className="stat-box stat-green">
                    <div className="stat-icon">
                      <CheckCircleOutlined />
                    </div>
                    <div className="stat-details">
                      <h3>{stats.completed}</h3>
                      <p>Completed</p>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="table-header">
                <h3 className="table-title">
                  <PhoneOutlined style={{ marginRight: '8px' }} />
                  Scheduled Appointments
                </h3>
                <Search
                  placeholder="Search by ID, Member ID, Staff ID, Contact..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                  style={{ width: 400 }}
                />
              </div>

              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="App_ID"
                loading={loading}
                scroll={{ x: 1300 }}
                className="info-table"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} appointments`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
              />
            </Card>
          </div>
        </Content>

        <Footer className="info-footer">
          <div className="footer-content">
            <span>Mega Power Gym & Fitness © 2025</span>
            <span>Appointment Records Portal</span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffAppointmentView;
