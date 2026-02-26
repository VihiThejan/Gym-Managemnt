import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Input, Tag, message, Avatar, Row, Col, Menu, Button, Space, Popconfirm } from "antd";
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
  ExclamationCircleOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  StarOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import Logo from './components/Logo';
import './StaffInfoTable.css';
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
  background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
};

const getMenuItems = () => [
  { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '/staffDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '/staffProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '/staffPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '/staffAnnouncement' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '/staffAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '/staffAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '/staffChat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '/Trainerrate' },
  { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '/WorkoutTracker' },
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

      console.log('Fetched appointments:', appointments);

      setData(appointments);
      setFilteredData(appointments);

      // Count based on actual status values from database
      const now = moment();
      const scheduled = appointments.filter(a =>
        (a.Status === 'Scheduled' || !a.Status) && moment(a.Date_and_Time).isAfter(now)
      ).length;
      const completed = appointments.filter(a =>
        a.Status === 'Completed' || moment(a.Date_and_Time).isBefore(now)
      ).length;
      const confirmed = appointments.filter(a => a.Status === 'Confirmed').length;

      setStats({
        total: appointments.length,
        pending: scheduled,
        confirmed: confirmed,
        completed: completed
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
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

  const handleStatusUpdate = async (appointmentId, status, action) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/v1/appointment/${action}/${appointmentId}`);
      message.success(`Appointment ${status} successfully!`);
      await fetchData();
    } catch (error) {
      console.error(`Error updating appointment to ${status}:`, error);
      message.error(`Failed to update appointment status`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (appointmentId) => {
    handleStatusUpdate(appointmentId, 'started', 'start');
  };

  const handleComplete = (appointmentId) => {
    handleStatusUpdate(appointmentId, 'completed', 'complete');
  };

  const handleConfirm = (appointmentId) => {
    handleStatusUpdate(appointmentId, 'confirmed', 'confirm');
  };

  const handleCancel = (appointmentId) => {
    handleStatusUpdate(appointmentId, 'cancelled', 'cancel');
  };

  const handleLogout = () => {
    message.success('Logged out successfully');
    navigate('/');
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
      dataIndex: "Date_and_Time",
      key: "date",
      width: 150,
      render: (dateTime) => (
        <div className="info-cell">
          <CalendarOutlined className="cell-icon" />
          <span>{dateTime ? moment.utc(dateTime).local().format('DD MMM YYYY') : 'N/A'}</span>
        </div>
      ),
      sorter: (a, b) => moment(a.Date_and_Time).unix() - moment(b.Date_and_Time).unix(),
    },
    {
      title: "Time",
      dataIndex: "Date_and_Time",
      key: "time",
      width: 120,
      render: (dateTime) => (
        <div className="info-cell">
          <ClockCircleOutlined className="cell-icon" />
          <span style={{ fontWeight: 500 }}>{dateTime ? moment.utc(dateTime).local().format('hh:mm A') : 'N/A'}</span>
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
      render: (status) => {
        const statusConfig = {
          'Scheduled': { color: 'processing', icon: <ClockCircleOutlined /> },
          'Pending': { color: 'warning', icon: <ClockCircleOutlined /> },
          'Confirmed': { color: 'success', icon: <CheckCircleOutlined /> },
          'Completed': { color: 'default', icon: <CheckCircleOutlined /> },
          'Cancelled': { color: 'error', icon: <ExclamationCircleOutlined /> },
          'In Progress': { color: 'cyan', icon: <PlayCircleOutlined /> }
        };
        const config = statusConfig[status] || statusConfig['Scheduled'];
        return (
          <Tag color={config.color} icon={config.icon}>
            {status || 'Scheduled'}
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
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_, record) => {
        const isPast = moment(record.Date_and_Time).isBefore(moment());
        const status = record.Status;
        
        return (
          <Space size="small" direction="vertical" style={{ width: '100%' }}>
            {status === 'Scheduled' && !isPast && (
              <>
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleStartSession(record.App_ID)}
                  style={{ width: '100%' }}
                >
                  Start
                </Button>
                <Popconfirm
                  title="Cancel appointment?"
                  description="Are you sure you want to cancel this appointment?"
                  onConfirm={() => handleCancel(record.App_ID)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button 
                    danger 
                    size="small" 
                    icon={<CloseCircleOutlined />}
                    style={{ width: '100%' }}
                  >
                    Cancel
                  </Button>
                </Popconfirm>
              </>
            )}
            {status === 'Confirmed' && !isPast && (
              <>
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleStartSession(record.App_ID)}
                  style={{ width: '100%' }}
                >
                  Start
                </Button>
              </>
            )}
            {status === 'In Progress' && (
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckCircleOutlined />}
                onClick={() => handleComplete(record.App_ID)}
                style={{ width: '100%', backgroundColor: '#52c41a' }}
              >
                Complete
              </Button>
            )}
            {status === 'Completed' && (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Finished
              </Tag>
            )}
            {status === 'Cancelled' && (
              <Tag color="error" icon={<CloseCircleOutlined />}>
                Cancelled
              </Tag>
            )}
          </Space>
        );
      },
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
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={['/staffAppointment']}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
          className="dashboard-menu"
          style={{ background: 'transparent', border: 'none' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'rgba(102, 126, 234, 0.1)'
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <MenuFoldOutlined style={{ fontSize: '20px', color: 'white' }} />
        </div>
      </Sider>

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="info-header" style={{ background: 'white' }}>
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
                scroll={{ x: 1500 }}
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
