import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Button, Modal, Form, DatePicker, Input, message, Tag, Space, Statistic, Row, Col, Typography, Empty, Select, TimePicker, Tabs, Badge, Avatar, Divider, Tooltip, Popconfirm, Spin, Menu } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  TeamOutlined,
  HistoryOutlined,
  FilterOutlined,
  SearchOutlined,
  FireOutlined,
  TrophyOutlined,
  RocketOutlined,
  ArrowLeftOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DollarOutlined,
  NotificationOutlined,
  CommentOutlined,
  MessageOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Logo from './components/Logo';
import './MemberAppointment.css';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
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

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
};

const items = [
  { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '1', path: '/MemberDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '2', path: '/MemberProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/MemberPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '4', path: '/MemberAnnouncements' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '5', path: '/MemberAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '7', path: '/MemberAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '8', path: '/chat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '9', path: '/Trainerrate' },
  { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '10', path: '/WorkoutTracker' },
];

const MemberAppointment = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchText, setSearchText] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0
  });

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('login'));
    if (loginData && loginData.Member_Id) {
      setMemberId(loginData.Member_Id);
      fetchAppointments(loginData.Member_Id);
      fetchStaffMembers();
    } else {
      message.error('Please login first');
      window.location.href = '/login';
    }
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/staffmember/list');
      if (response.data && response.data.data) {
        setStaffMembers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
      message.error('Failed to load staff members');
    }
  };

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const fetchAppointments = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/appointment/list');
      
      // Filter appointments for current member
      const memberAppointments = response.data.data.filter(
        apt => apt.Member_Id === id
      );
      
      setAppointments(memberAppointments);
      setFilteredAppointments(memberAppointments);
      calculateStats(memberAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on search and tab
  useEffect(() => {
    let filtered = [...appointments];
    
    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(apt => {
        const staff = staffMembers.find(s => s.Staff_ID === apt.Staff_ID);
        const staffName = staff ? staff.FName.toLowerCase() : '';
        const contact = apt.Contact.toLowerCase();
        return staffName.includes(searchText.toLowerCase()) || 
               contact.includes(searchText.toLowerCase());
      });
    }
    
    // Filter by tab
    const now = moment();
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(apt => moment(apt.Date_and_Time).isAfter(now));
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(apt => moment(apt.Date_and_Time).isBefore(now));
    }
    
    // Sort by date - upcoming: earliest first, completed: latest first
    filtered.sort((a, b) => {
      const dateA = moment(a.Date_and_Time);
      const dateB = moment(b.Date_and_Time);
      return activeTab === 'upcoming' ? dateA.diff(dateB) : dateB.diff(dateA);
    });
    
    setFilteredAppointments(filtered);
  }, [searchText, activeTab, appointments, staffMembers]);

  const calculateStats = (appointments) => {
    const now = moment();
    const total = appointments.length;
    const upcoming = appointments.filter(apt => 
      moment(apt.Date_and_Time).isAfter(now)
    ).length;
    const completed = appointments.filter(apt => 
      moment(apt.Date_and_Time).isBefore(now)
    ).length;

    setStats({ total, upcoming, completed });
  };

  const showModal = () => {
    setIsEditMode(false);
    setEditingAppointment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (appointment) => {
    setIsEditMode(true);
    setEditingAppointment(appointment);
    const appointmentMoment = moment(appointment.Date_and_Time);
    form.setFieldsValue({
      staffid: appointment.Staff_ID,
      date: appointmentMoment,
      time: appointmentMoment,
      contact: appointment.Contact
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsEditMode(false);
    setEditingAppointment(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Combine date and time
      const appointmentDate = values.date.format('YYYY-MM-DD');
      const appointmentTime = values.time.format('HH:mm:ss');
      const combinedDateTime = moment(`${appointmentDate} ${appointmentTime}`, 'YYYY-MM-DD HH:mm:ss');

      // Validate future date
      if (combinedDateTime.isBefore(moment())) {
        message.error('❌ Cannot book appointments in the past');
        setLoading(false);
        return;
      }

      const appointmentData = {
        memberid: memberId,
        staffid: parseInt(values.staffid),
        date_time: combinedDateTime.toISOString(),
        contact: values.contact
      };

      if (isEditMode && editingAppointment) {
        // Update existing appointment
        await axios.put(
          `http://localhost:5000/api/v1/appointment/update/${editingAppointment.App_ID}`,
          appointmentData
        );
        message.success('✅ Appointment updated successfully!');
      } else {
        // Create new appointment
        await axios.post(
          'http://localhost:5000/api/v1/appointment/create',
          appointmentData
        );
        message.success('✅ Appointment booked successfully!');
      }

      setIsModalVisible(false);
      form.resetFields();
      await fetchAppointments(memberId);
    } catch (error) {
      console.error('Error saving appointment:', error);
      message.error(error.response?.data?.message || '❌ Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/v1/appointment/delete/${appointmentId}`
      );
      message.success('✅ Appointment cancelled successfully');
      await fetchAppointments(memberId);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      message.error('❌ Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (dateTime) => {
    const appointmentDate = moment(dateTime);
    const now = moment();

    if (appointmentDate.isBefore(now)) {
      return <Tag color="default">Completed</Tag>;
    } else if (appointmentDate.diff(now, 'hours') <= 24) {
      return <Tag color="orange">Upcoming Soon</Tag>;
    } else {
      return <Tag color="green">Scheduled</Tag>;
    }
  };

  const disabledDate = (current) => {
    // Can't select dates before today
    return current && current < moment().startOf('day');
  };

  const columns = [
    {
      title: 'Appointment ID',
      dataIndex: 'App_ID',
      key: 'App_ID',
      render: (id) => <Text strong>#{id}</Text>
    },
    {
      title: 'Trainer/Staff',
      dataIndex: 'Staff_ID',
      key: 'Staff_ID',
      render: (staffId) => {
        const staff = staffMembers.find(s => s.Staff_ID === staffId);
        return (
          <Space>
            <TeamOutlined />
            <div>
              <Text strong>{staff ? staff.FName : `Staff-${staffId}`}</Text>
              {staff && <br />}
              {staff && <Text type="secondary" style={{ fontSize: '12px' }}>{staff.Job_Role}</Text>}
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Date & Time',
      dataIndex: 'Date_and_Time',
      key: 'Date_and_Time',
      render: (dateTime) => (
        <Space direction="vertical" size={0}>
          <Text>
            <CalendarOutlined /> {moment(dateTime).format('MMM DD, YYYY')}
          </Text>
          <Text type="secondary">
            <ClockCircleOutlined /> {moment(dateTime).format('hh:mm A')}
          </Text>
        </Space>
      ),
      sorter: (a, b) => moment(a.Date_and_Time).unix() - moment(b.Date_and_Time).unix()
    },
    {
      title: 'Contact',
      dataIndex: 'Contact',
      key: 'Contact',
      render: (contact) => (
        <Space>
          <PhoneOutlined />
          <Text>{contact}</Text>
        </Space>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => getStatusTag(record.Date_and_Time)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const isPast = moment(record.Date_and_Time).isBefore(moment());
        
        return (
          <Space>
            {!isPast && (
              <>
                <Button
                  type="primary"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => showEditModal(record)}
                >
                  Edit
                </Button>
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.App_ID)}
                >
                  Cancel
                </Button>
              </>
            )}
            {isPast && <Text type="secondary">-</Text>}
          </Space>
        );
      }
    }
  ];

  // Render appointment card
  const renderAppointmentCard = (appointment, index) => {
    const staff = staffMembers.find(s => s.Staff_ID === appointment.Staff_ID);
    const isPast = moment(appointment.Date_and_Time).isBefore(moment());
    const isToday = moment(appointment.Date_and_Time).isSame(moment(), 'day');
    
    return (
      <Card 
        key={appointment.App_ID}
        className={`appointment-card ${isPast ? 'past' : 'upcoming'} ${isToday ? 'today' : ''}`}
        hoverable
      >
        <div className="card-counter">
          <span className="counter-number">#{index + 1}</span>
        </div>
        <div className="appointment-card-header">
          <div className="staff-info">
            <Avatar 
              size={50} 
              icon={<TeamOutlined />}
              style={{ 
                background: isPast ? '#95a5a6' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                marginRight: 12
              }}
            />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {staff ? staff.FName : `Staff-${appointment.Staff_ID}`}
              </Title>
              <Text type="secondary">{staff ? staff.Job_Role : 'Trainer'}</Text>
            </div>
          </div>
          <div className="status-badge">
            {getStatusTag(appointment.Date_and_Time)}
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div className="appointment-details">
          <div className="detail-item">
            <CalendarOutlined className="detail-icon" />
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Date</Text>
              <br />
              <Text strong>{moment(appointment.Date_and_Time).format('MMM DD, YYYY')}</Text>
            </div>
          </div>
          
          <div className="detail-item">
            <ClockCircleOutlined className="detail-icon" />
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Time</Text>
              <br />
              <Text strong>{moment(appointment.Date_and_Time).format('hh:mm A')}</Text>
            </div>
          </div>
          
          <div className="detail-item">
            <PhoneOutlined className="detail-icon" />
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Contact</Text>
              <br />
              <Text strong>{appointment.Contact}</Text>
            </div>
          </div>
        </div>

        {!isPast && (
          <div className="appointment-actions">
            <Tooltip title="Edit appointment details">
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => showEditModal(appointment)}
                className="action-btn"
                loading={loading}
              >
                Edit
              </Button>
            </Tooltip>
            <Popconfirm
              title="Cancel Appointment"
              description="Are you sure you want to cancel this appointment?"
              onConfirm={() => handleDelete(appointment.App_ID)}
              okText="Yes, Cancel"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Cancel this appointment">
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  className="action-btn"
                  loading={loading}
                >
                  Cancel
                </Button>
              </Tooltip>
            </Popconfirm>
          </div>
        )}
      </Card>
    );
  };

  return (
    <Layout hasSider className="member-appointment-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={250}
        style={siderStyle}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={['7']}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} style={menuItemStyle} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
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
      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="dashboard-content-layout">
      <Header className="member-appointment-header">
        <div className="header-content">
          <div className="header-left-section">
            <div className="header-title">
              <RocketOutlined className="header-icon" />
              <div>
                <Title level={2} style={{ margin: 0, color: 'white' }}>
                  My Appointments
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                  Manage your training sessions
                </Text>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="book-appointment-btn"
          >
            Book New Session
          </Button>
        </div>
      </Header>

      <Content className="member-appointment-content">
        {/* Enhanced Statistics Cards */}
        <Row gutter={[20, 20]} className="stats-row">
          <Col xs={24} sm={8}>
            <Card className="stat-card stat-card-1" bordered={false}>
              <div className="stat-icon">
                <FireOutlined />
              </div>
              <Statistic
                title="Total Sessions"
                value={stats.total}
                valueStyle={{ color: '#ffffff' }}
              />
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>All time appointments</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="stat-card stat-card-2" bordered={false}>
              <div className="stat-icon">
                <ClockCircleOutlined />
              </div>
              <Statistic
                title="Upcoming"
                value={stats.upcoming}
                valueStyle={{ color: '#ffffff' }}
              />
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>Scheduled sessions</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="stat-card stat-card-3" bordered={false}>
              <div className="stat-icon">
                <TrophyOutlined />
              </div>
              <Statistic
                title="Completed"
                value={stats.completed}
                valueStyle={{ color: '#ffffff' }}
              />
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>Finished training</Text>
            </Card>
          </Col>
        </Row>

        {/* Search and Filter */}
        <Card className="filter-card" bordered={false}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="Search by trainer name or contact..."
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
            </Col>
          </Row>
        </Card>

        {/* Appointments Tabs */}
        <Card className="appointments-main-card" bordered={false}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            className="appointments-tabs"
          >
            <TabPane 
              tab={
                <span>
                  <ClockCircleOutlined />
                  Upcoming <Badge count={stats.upcoming} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
                </span>
              } 
              key="upcoming"
            >
              <div className="appointments-grid">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', width: '100%' }}>
                    <Spin size="large" tip="Loading appointments..." />
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map(apt => renderAppointmentCard(apt))
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div>
                        <Title level={4}>No Upcoming Appointments</Title>
                        <Text type="secondary">Book your next training session now!</Text>
                      </div>
                    }
                  >
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal} size="large">
                      Book Appointment
                    </Button>
                  </Empty>
                )}
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <CheckCircleOutlined />
                  Completed <Badge count={stats.completed} style={{ backgroundColor: '#1890ff', marginLeft: 8 }} />
                </span>
              } 
              key="completed"
            >
              <div className="appointments-grid">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', width: '100%' }}>
                    <Spin size="large" tip="Loading appointments..." />
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt, idx) => renderAppointmentCard(apt, idx))
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div>
                        <Title level={4}>No Completed Appointments</Title>
                        <Text type="secondary">Your completed sessions will appear here.</Text>
                      </div>
                    }
                  />
                )}
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <HistoryOutlined />
                  All History <Badge count={stats.total} style={{ backgroundColor: '#722ed1', marginLeft: 8 }} />
                </span>
              } 
              key="all"
            >
              <div className="appointments-grid">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', width: '100%' }}>
                    <Spin size="large" tip="Loading appointments..." />
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt, idx) => renderAppointmentCard(apt, idx))
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div>
                        <Title level={4}>No Appointments Found</Title>
                        <Text type="secondary">{searchText ? 'Try adjusting your search terms' : 'Start your fitness journey by booking your first session!'}</Text>
                      </div>
                    }
                  >
                    {!searchText && (
                      <Button type="primary" icon={<PlusOutlined />} onClick={showModal} size="large">
                        Book Your First Session
                      </Button>
                    )}
                  </Empty>
                )}
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Content>

      {/* Appointment Modal */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <span>{isEditMode ? 'Edit Appointment' : 'Book New Appointment'}</span>
          </Space>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="appointment-form"
        >
          <Form.Item
            label="Trainer/Staff"
            name="staffid"
            rules={[{ required: true, message: 'Please select a trainer or staff member' }]}
          >
            <Select
              size="large"
              placeholder="Select trainer or staff member"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {staffMembers.map(staff => (
                <Option key={staff.Staff_ID} value={staff.Staff_ID}>
                  <div>
                    <Text strong>{staff.FName}</Text>
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                      ({staff.Job_Role})
                    </Text>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Appointment Date"
                name="date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  size="large"
                  style={{ width: '100%' }}
                  disabledDate={disabledDate}
                  placeholder="Select date"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Appointment Time"
                name="time"
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <TimePicker
                  format="HH:mm"
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Select time"
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Contact Number"
            name="contact"
            rules={[
              { required: true, message: 'Please enter contact number' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter your contact number"
              size="large"
              maxLength={10}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel} size="large" disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large" icon={<CheckCircleOutlined />} loading={loading}>
                {isEditMode ? '✓ Update Appointment' : '✓ Book Appointment'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      </Layout>
    </Layout>
  );
};

export default MemberAppointment;
