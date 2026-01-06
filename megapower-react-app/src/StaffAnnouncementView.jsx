import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Input, Tag, message, Avatar, Row, Col, Statistic, Menu, Modal, Form, Button, Space, Popconfirm } from "antd";
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
  SoundOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  StarOutlined,
  TrophyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import moment from "moment";
import Logo from './components/Logo';
import './StaffAnnouncementView.css';
import './staffDashboard.css';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;
const { TextArea } = Input;

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

const StaffAnnouncementView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    total: 0,
    newAnnouncements: 0,
    latestDate: 'N/A'
  });

  // Get staff ID from localStorage
  const getStaffId = () => {
    const loginData = localStorage.getItem('login');
    if (loginData) {
      const userData = JSON.parse(loginData);
      return userData.Staff_ID || null;
    }
    return null;
  };

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

  const handleLogout = () => {
    message.success('Logged out successfully');
    navigate('/');
  };

  const showModal = () => {
    setIsEditMode(false);
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setEditingRecord(record);
    form.setFieldsValue({
      message: record.Message,
      date_time: moment(record.Date_Time)
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const staffId = getStaffId();

      if (!staffId) {
        message.error('Staff ID not found. Please login again.');
        return;
      }

      if (isEditMode && editingRecord) {
        // Update announcement
        await axios.put(
          `http://localhost:5000/api/v1/announcement/Update/${editingRecord.Announcement_ID}`,
          {
            Staff_ID: staffId,
            Message: values.message,
            Date_Time: moment().toISOString()
          }
        );
        message.success('Announcement updated successfully!');
      } else {
        // Create new announcement
        await axios.post('http://localhost:5000/api/v1/announcement/create', {
          staff_id: staffId,
          message: values.message,
          date_time: moment().toISOString()
        });
        message.success('Announcement created successfully!');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error('Error saving announcement:', error);
      message.error('Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/v1/announcement/delete/${id}`);
      message.success('Announcement deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      message.error('Failed to delete announcement');
    } finally {
      setLoading(false);
    }
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
      ellipsis: {
        showTitle: false,
      },
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
      render: (date) => {
        const isNew = moment().diff(moment(date), 'days') <= 7;
        return (
          <Tag color={isNew ? 'green' : 'default'} className="status-tag">
            {isNew ? 'New' : 'Posted'}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Announcement"
            description="Are you sure you want to delete this announcement?"
            onConfirm={() => handleDelete(record.Announcement_ID)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
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
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={['/staffAnnouncement']}
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
              <Col xs={24} sm={12} md={8} lg={8}>
                <Card className="stat-card stat-purple">
                  <Statistic
                    title={<span className="stat-title">Total Announcements</span>}
                    value={stats.total}
                    prefix={<NotificationOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <Card className="stat-card stat-green">
                  <Statistic
                    title={<span className="stat-title">New (Last 7 Days)</span>}
                    value={stats.newAnnouncements}
                    prefix={<BellOutlined />}
                    valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
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
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    Create Announcement
                  </Button>
                  <Search
                    placeholder="Search by ID, admin, or message..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                    style={{ maxWidth: 400, width: '100%' }}
                  />
                </Space>
              }
            >
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="Announcement_ID"
                loading={loading}
                scroll={{ x: 1200, y: 500 }}
                className="staff-announcement-table"
                sticky
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} announcements`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  position: ['bottomCenter'],
                }}
              />
            </Card>

            {/* Create/Edit Announcement Modal */}
            <Modal
              title={
                <Space>
                  {isEditMode ? <EditOutlined /> : <PlusOutlined />}
                  <span style={{ fontSize: '20px', fontWeight: 600 }}>
                    {isEditMode ? 'Edit Announcement' : 'Create New Announcement'}
                  </span>
                </Space>
              }
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
              width={600}
              destroyOnClose
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ marginTop: 24 }}
              >
                <Form.Item
                  name="message"
                  label={<span style={{ fontWeight: 600, fontSize: 15 }}>Announcement Message</span>}
                  rules={[
                    { required: true, message: 'Please enter the announcement message' },
                    { min: 10, message: 'Message must be at least 10 characters' }
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Enter your announcement message here..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button size="large" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={loading}
                      icon={isEditMode ? <EditOutlined /> : <PlusOutlined />}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        minWidth: 120
                      }}
                    >
                      {isEditMode ? 'Update' : 'Create'}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
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
