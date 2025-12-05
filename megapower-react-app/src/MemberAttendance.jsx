import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Space, Button, Dropdown, Menu, Avatar, Table, Badge, message, Modal, Form, TimePicker, Statistic, Row, Col } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined,
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  DollarOutlined,
  NotificationOutlined,
  ScheduleOutlined,
  CommentOutlined,
  MessageOutlined,
  StarOutlined,
  LoginOutlined,
  LogoutOutlined as LogoutIcon,
  TrophyOutlined,
  FireOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Logo from './components/Logo';
import './MemberAttendance.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

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

export const MemberAttendance = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInModalVisible, setCheckInModalVisible] = useState(false);
  const [checkOutModalVisible, setCheckOutModalVisible] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [stats, setStats] = useState({
    totalDays: 0,
    thisMonth: 0,
    thisWeek: 0,
    avgDuration: 0
  });
  const [form] = Form.useForm();

  const getLoginData = () => {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsedData = JSON.parse(loginData);
        return {
          memberId: parsedData.Member_Id || null,
          memberName: parsedData.FName || ''
        };
      }
      return { memberId: null, memberName: '' };
    } catch (error) {
      return { memberId: null, memberName: '' };
    }
  };

  const { memberId, memberName } = getLoginData();

  useEffect(() => {
    if (!memberId) {
      message.error('No member ID found. Please login again.');
      navigate('/');
      return;
    }
    fetchAttendanceData();
  }, [memberId]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/attendance/list");
      const allAttendance = response?.data?.data || [];
      
      // Filter for current member
      const memberAttendance = allAttendance.filter(
        att => att.Member_Id === parseInt(memberId)
      );

      // Sort by date, newest first
      const sortedData = memberAttendance.sort((a, b) => 
        moment(b.Current_date).unix() - moment(a.Current_date).unix()
      );

      setAttendanceData(sortedData);
      calculateStats(sortedData);
      checkTodayAttendance(sortedData);
    } catch (error) {
      console.error(`Error fetching attendance: ${error.message}`);
      message.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const checkTodayAttendance = (data) => {
    const today = moment().format('YYYY-MM-DD');
    const todayRecord = data.find(att => 
      moment(att.Current_date).format('YYYY-MM-DD') === today
    );
    setTodayAttendance(todayRecord || null);
  };

  const calculateStats = (data) => {
    // Only count completed attendance (duration > 5 minutes)
    const completedData = data.filter(att => {
      if (!att.In_time || !att.Out_time) return false;
      const duration = moment(att.Out_time).diff(moment(att.In_time), 'minutes');
      return duration > 5;
    });

    const totalDays = completedData.length;
    
    const thisMonth = completedData.filter(att => 
      moment(att.Current_date).isSame(moment(), 'month')
    ).length;

    const thisWeek = completedData.filter(att => 
      moment(att.Current_date).isSame(moment(), 'week')
    ).length;

    // Calculate average duration from completed attendance only
    const totalMinutes = completedData.reduce((sum, att) => {
      const duration = moment(att.Out_time).diff(moment(att.In_time), 'minutes');
      return sum + duration;
    }, 0);
    const avgDuration = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0;

    setStats({ totalDays, thisMonth, thisWeek, avgDuration });
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

  const handleCheckIn = async () => {
    const today = moment().format('YYYY-MM-DD');
    const now = moment().format('HH:mm:ss');

    try {
      await axios.post("http://localhost:5000/api/v1/attendance/create", {
        memberId: parseInt(memberId),
        currentDate: today,
        inTime: now
      });

      message.success({
        content: 'Checked in successfully! Enjoy your workout! Remember to check out when you leave.',
        duration: 5
      });
      setCheckInModalVisible(false);
      fetchAttendanceData();
    } catch (error) {
      console.error('Error checking in:', error);
      const errorMsg = error.response?.data?.message || 'Failed to check in. Please try again.';
      message.error(errorMsg);
    }
  };

  const handleCheckOut = async (values) => {
    try {
      if (!values.outTime) {
        message.error('Please select a checkout time!');
        return;
      }

      if (!todayAttendance) {
        message.error('Please check in first!');
        return;
      }

      const currentDate = moment(todayAttendance.Current_date).format('YYYY-MM-DD');
      const inTime = moment(todayAttendance.In_time).format('HH:mm:ss');
      
      // Convert the time picker value to 24-hour format
      const outTime = moment(values.outTime).format('HH:mm:ss');
      
      // Validate that check-out time is after check-in time
      const checkInMoment = moment(todayAttendance.In_time);
      const checkOutMoment = moment(`${currentDate} ${outTime}`, 'YYYY-MM-DD HH:mm:ss');
      
      if (checkOutMoment.isSameOrBefore(checkInMoment)) {
        message.error('Check-out time must be after check-in time!');
        return;
      }
      
      // Calculate duration for confirmation
      const duration = checkOutMoment.diff(checkInMoment, 'minutes');
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      console.log('Checkout data:', {
        Attendance_ID: todayAttendance.Attendance_ID,
        Member_Id: parseInt(memberId),
        Current_date: currentDate,
        In_time: inTime,
        Out_time: outTime,
        Duration: `${hours}h ${minutes}m`
      });
      
      const response = await axios.put(`http://localhost:5000/api/v1/attendance/update/${todayAttendance.Attendance_ID}`, {
        Member_Id: parseInt(memberId),
        Current_date: currentDate,
        In_time: inTime,
        Out_time: outTime
      });

      message.success({
        content: `Checked out successfully! Workout duration: ${hours}h ${minutes}m. Great job!`,
        duration: 5
      });
      setCheckOutModalVisible(false);
      form.resetFields();
      fetchAttendanceData();
    } catch (error) {
      console.error('Error checking out:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to check out. Please try again.';
      message.error(errorMsg);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'Current_date',
      key: 'date',
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: '#667eea' }} />
          <Text strong>{moment(date).format('MMM DD, YYYY')}</Text>
        </Space>
      ),
      sorter: (a, b) => moment(a.Current_date).unix() - moment(b.Current_date).unix(),
    },
    {
      title: 'Day',
      dataIndex: 'Current_date',
      key: 'day',
      render: (date) => moment(date).format('dddd'),
    },
    {
      title: 'Check In',
      dataIndex: 'In_time',
      key: 'inTime',
      render: (time) => (
        <Space>
          <LoginOutlined style={{ color: '#52c41a' }} />
          <Text>{moment(time).format('hh:mm A')}</Text>
        </Space>
      ),
    },
    {
      title: 'Check Out',
      dataIndex: 'Out_time',
      key: 'outTime',
      render: (time) => time ? (
        <Space>
          <LogoutIcon style={{ color: '#ff4d4f' }} />
          <Text>{moment(time).format('hh:mm A')}</Text>
        </Space>
      ) : (
        <Text type="secondary" italic>Not yet</Text>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => {
        if (record.In_time && record.Out_time) {
          const duration = moment(record.Out_time).diff(moment(record.In_time), 'minutes');
          
          // Handle negative or zero duration
          if (duration <= 0) {
            return <Text type="secondary">-</Text>;
          }
          
          const hours = Math.floor(duration / 60);
          const minutes = duration % 60;
          
          return (
            <Space>
              <ClockCircleOutlined style={{ color: '#667eea' }} />
              <Text>{hours > 0 ? `${hours}h ` : ''}{minutes}m</Text>
            </Space>
          );
        }
        return <Text type="secondary">In Progress</Text>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (!record.In_time) {
          return <Badge status="error" text="Invalid" />;
        }
        
        if (!record.Out_time) {
          return <Badge status="processing" text="In Progress" />;
        }
        
        const duration = moment(record.Out_time).diff(moment(record.In_time), 'minutes');
        
        // Handle invalid duration
        if (duration < 0) {
          return <Badge status="error" text="Invalid" />;
        }
        
        if (duration === 0) {
          return <Badge status="processing" text="In Progress" />;
        } else {
          return <Badge status="success" text="Completed" />;
        }
      },
    },
  ];

  // Check if member can check in today
  const canCheckIn = !todayAttendance;
  
  // Check if member can check out (has checked in today but Out_time is null or not set)
  const canCheckOut = todayAttendance && todayAttendance.In_time && !todayAttendance.Out_time;

  return (
    <Layout hasSider className="member-attendance-layout">
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
          selectedKeys={['5']}
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
        <Header className="attendance-header">
          <Space size="large">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="menu-toggle-btn"
            />
            <Title level={4} className="page-title">
              <CalendarOutlined className="page-title-icon" />
              My Attendance
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
        <Content className="attendance-content">
          <div className="content-container">
            {/* Quick Actions Card */}
            <Card className="actions-card">
              <Row gutter={24} align="middle">
                <Col xs={24} md={12}>
                  <div className="welcome-section">
                    <Title level={3} className="welcome-title">
                      <FireOutlined /> Welcome back, {memberName}!
                    </Title>
                    <Text className="welcome-subtitle">
                      {moment().format('dddd, MMMM DD, YYYY')}
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <Space size="middle" className="action-buttons">
                    <Button
                      type="primary"
                      size="large"
                      icon={<LoginOutlined />}
                      onClick={() => setCheckInModalVisible(true)}
                      disabled={!canCheckIn}
                      className="check-in-btn"
                    >
                      Check In
                    </Button>
                    <Button
                      size="large"
                      icon={<LogoutIcon />}
                      onClick={() => setCheckOutModalVisible(true)}
                      disabled={!canCheckOut}
                      className="check-out-btn"
                    >
                      Check Out
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={[24, 24]} className="stats-row">
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card">
                  <Statistic
                    title="Total Days"
                    value={stats.totalDays}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card">
                  <Statistic
                    title="This Month"
                    value={stats.thisMonth}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card">
                  <Statistic
                    title="This Week"
                    value={stats.thisWeek}
                    prefix={<FireOutlined />}
                    valueStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card">
                  <Statistic
                    title="Avg Duration"
                    value={stats.avgDuration}
                    suffix="min"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Attendance Table */}
            <Card className="attendance-table-card">
              <div className="table-header">
                <Title level={4} className="table-title">
                  <CalendarOutlined /> Attendance History
                </Title>
                <Text type="secondary">
                  Total Records: {attendanceData.length} ({stats.totalDays} completed)
                </Text>
              </div>
              <Table
                columns={columns}
                dataSource={attendanceData}
                rowKey="Attendance_ID"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} records`,
                }}
                className="attendance-table"
              />
            </Card>
          </div>
        </Content>

        {/* Check In Modal */}
        <Modal
          title={
            <Space>
              <LoginOutlined style={{ color: '#52c41a' }} />
              <span>Check In</span>
            </Space>
          }
          open={checkInModalVisible}
          onOk={handleCheckIn}
          onCancel={() => setCheckInModalVisible(false)}
          okText="Check In"
          okButtonProps={{ size: 'large', icon: <CheckCircleOutlined /> }}
          cancelButtonProps={{ size: 'large' }}
        >
          <div className="modal-content">
            <div className="time-display">
              <ClockCircleOutlined className="clock-icon" />
              <Title level={2} className="current-time">
                {moment().format('hh:mm:ss A')}
              </Title>
              <Text type="secondary">{moment().format('dddd, MMMM DD, YYYY')}</Text>
            </div>
            <Text className="modal-text">
              Are you sure you want to check in now?
            </Text>
          </div>
        </Modal>

        {/* Check Out Modal */}
        <Modal
          title={
            <Space>
              <LogoutIcon style={{ color: '#ff4d4f' }} />
              <span>Check Out</span>
            </Space>
          }
          open={checkOutModalVisible}
          onOk={() => form.submit()}
          onCancel={() => {
            setCheckOutModalVisible(false);
            form.resetFields();
          }}
          okText="Check Out"
          okButtonProps={{ size: 'large', icon: <CheckCircleOutlined /> }}
          cancelButtonProps={{ size: 'large' }}
        >
          <Form
            form={form}
            onFinish={handleCheckOut}
            layout="vertical"
          >
            <div className="modal-content">
              <div className="time-display">
                <ClockCircleOutlined className="clock-icon" />
                <Title level={2} className="current-time">
                  {moment().format('hh:mm:ss A')}
                </Title>
                <Text type="secondary">{moment().format('dddd, MMMM DD, YYYY')}</Text>
              </div>
              <Form.Item
                label="Check Out Time"
                name="outTime"
                rules={[{ required: true, message: 'Please select check out time' }]}
                initialValue={moment()}
              >
                <TimePicker
                  format="hh:mm A"
                  use12Hours
                  size="large"
                  style={{ width: '100%' }}
                  showNow
                  defaultValue={moment()}
                />
              </Form.Item>
              <Text className="modal-text">
                Please confirm your check out time.
              </Text>
            </div>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default MemberAttendance;
