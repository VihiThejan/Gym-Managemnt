import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Input, Tag, message, Avatar, Row, Col, Statistic, Menu } from "antd";
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
  LoginOutlined,
  LogoutOutlined,
  BellOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import Logo from './components/Logo';
import './StaffAttendanceView.css';
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

const StaffAttendanceView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/attendance/list");
      const attendance = res?.data?.data || [];
      setData(attendance);
      setFilteredData(attendance);
      
      const today = moment().format('YYYY-MM-DD');
      const weekStart = moment().startOf('week');
      const monthStart = moment().startOf('month');
      
      const todayCount = attendance.filter(a => moment(a.Current_date).format('YYYY-MM-DD') === today).length;
      const weekCount = attendance.filter(a => moment(a.Current_date).isSameOrAfter(weekStart)).length;
      const monthCount = attendance.filter(a => moment(a.Current_date).isSameOrAfter(monthStart)).length;
      
      setStats({
        total: attendance.length,
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount
      });
    } catch (error) {
      message.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Attendance_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Member_Id || '').toLowerCase().includes(value.toLowerCase()) ||
        moment(item.Current_date).format('YYYY-MM-DD').includes(value.toLowerCase())
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
      title: "Attendance ID",
      dataIndex: "Attendance_ID",
      key: "attendanceid",
      fixed: "left",
      width: 150,
      render: (id) => (
        <Tag color="purple" className="id-tag">
          <CalendarOutlined /> {id}
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
      title: "Date",
      dataIndex: "Current_date",
      key: "date",
      width: 150,
      render: (date) => (
        <div className="info-cell">
          <CalendarOutlined className="cell-icon" />
          <span>{date ? moment(date).format('DD MMM YYYY') : 'N/A'}</span>
        </div>
      ),
      sorter: (a, b) => moment(a.Current_date).unix() - moment(b.Current_date).unix(),
    },
    {
      title: "Check In",
      dataIndex: "In_time",
      key: "intime",
      width: 140,
      render: (time) => (
        <div className="info-cell">
          <LoginOutlined className="cell-icon" style={{ color: '#10b981' }} />
          <span style={{ fontWeight: 500 }}>{time ? moment(time, 'HH:mm:ss').format('hh:mm A') : 'N/A'}</span>
        </div>
      ),
    },
    {
      title: "Check Out",
      dataIndex: "Out_time",
      key: "outtime",
      width: 140,
      render: (time) => (
        <div className="info-cell">
          <LogoutOutlined className="cell-icon" style={{ color: '#ef4444' }} />
          <span style={{ fontWeight: 500 }}>{time ? moment(time, 'HH:mm:ss').format('hh:mm A') : 'N/A'}</span>
        </div>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      width: 130,
      render: (_, record) => {
        if (record.In_time && record.Out_time) {
          const inTime = moment(record.In_time, 'HH:mm:ss');
          const outTime = moment(record.Out_time, 'HH:mm:ss');
          const duration = moment.duration(outTime.diff(inTime));
          const hours = Math.floor(duration.asHours());
          const mins = duration.minutes();
          return (
            <Tag color="cyan" icon={<ClockCircleOutlined />}>
              {hours}h {mins}m
            </Tag>
          );
        }
        return <Tag color="default">Ongoing</Tag>;
      },
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      fixed: "right",
      render: (_, record) => {
        const today = moment().format('YYYY-MM-DD');
        const recordDate = moment(record.Current_date).format('YYYY-MM-DD');
        const isToday = today === recordDate;
        const hasCheckedOut = record.Out_time;
        
        if (isToday && !hasCheckedOut) {
          return <Tag color="processing">Active</Tag>;
        } else if (hasCheckedOut) {
          return <Tag color="success">Completed</Tag>;
        }
        return <Tag color="default">Past</Tag>;
      },
    },
  ];

  return (
    <Layout className="staff-attendance-layout">
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
          selectedKeys={['/staffAttendance']}
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
        <Header className="staff-attendance-header">
          <div className="header-left">
            <div 
              className="trigger-button"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <h2 className="page-title">
              <CalendarOutlined style={{ marginRight: '8px' }} />
              Attendance Records
            </h2>
          </div>

          <div className="header-right">
            <div className="notification-badge">
              <BellOutlined className="notification-icon" />
              <span className="badge-count">{stats.today}</span>
            </div>
            <Avatar 
              className="user-avatar" 
              icon={<UserOutlined />}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>

        <Content className="staff-attendance-content">
          <div className="content-wrapper">
            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="stats-row">
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card className="stat-card stat-purple">
                  <Statistic
                    title={<span className="stat-title">Total Records</span>}
                    value={stats.total}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card className="stat-card stat-green">
                  <Statistic
                    title={<span className="stat-title">Today</span>}
                    value={stats.today}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card className="stat-card stat-blue">
                  <Statistic
                    title={<span className="stat-title">This Week</span>}
                    value={stats.thisWeek}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card className="stat-card stat-orange">
                  <Statistic
                    title={<span className="stat-title">This Month</span>}
                    value={stats.thisMonth}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card 
              className="attendance-card"
              title={
                <div className="card-title-wrapper">
                  <div className="title-section">
                    <CalendarOutlined className="title-icon" />
                    <span className="title-text">Member Attendance Records</span>
                  </div>
                  <span className="title-subtitle">Track and manage all member check-ins and check-outs</span>
                </div>
              }
              extra={
                <Search
                  placeholder="Search by Attendance ID, Member ID, Date..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                  style={{ maxWidth: 400, width: '100%' }}
                />
              }
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="Attendance_ID"
                loading={loading}
                scroll={{ x: 1200, y: 500 }}
                className="staff-attendance-table"
                sticky
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} records`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  position: ['bottomCenter'],
                }}
              />
            </Card>
          </div>
        </Content>

        <Footer className="staff-attendance-footer">
          <div className="footer-content">
            <span>Mega Power Gym & Fitness © 2025</span>
            <span>Attendance Portal</span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffAttendanceView;
