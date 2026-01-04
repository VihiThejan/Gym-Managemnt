import React, { useState, useEffect } from "react";
import { Layout, Menu, Rate, message, Card, Table, Tag, Space, Button, Modal, Input, Form, Select, Row, Col, Divider, Avatar } from "antd";
import {
  StarOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  DashboardOutlined,
  DollarOutlined,
  NotificationOutlined,
  CalendarOutlined,
  MessageOutlined,
  ScheduleOutlined,
  MenuFoldOutlined,
  StarFilled,
  CommentOutlined,
  SendOutlined,
  PlusOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Logo from './components/Logo';
import './Trainerrate.css';

const { TextArea } = Input;
const { Option } = Select;

const { Header, Content, Sider } = Layout;

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
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/MemberDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '2', path: '/MemberProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/MemberPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '4', path: '/MemberAnnouncements' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '5', path: '/MemberAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '7', path: '/MemberAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '8', path: '/chat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '9', path: '/Trainerrate' },
  { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '10', path: '/WorkoutTracker' },
];

export const Trainerrate = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Get member ID from localStorage
  // Determine user type and ID from localStorage
  const getLoginData = () => {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsedData = JSON.parse(loginData);
        if (parsedData.Member_Id) {
          return {
            userId: parsedData.Member_Id,
            userName: parsedData.FName || '',
            userType: 'member'
          };
        } else if (parsedData.Staff_ID || parsedData.Staff_Id || parsedData.id) {
          return {
            userId: parsedData.Staff_ID || parsedData.Staff_Id || parsedData.id,
            userName: parsedData.FName || '',
            userType: 'staff'
          };
        }
      }
      return { userId: null, userName: '', userType: null };
    } catch (error) {
      return { userId: null, userName: '', userType: null };
    }
  };

  const { userId, userName, userType } = getLoginData();



  useEffect(() => {
    if (!userId) {
      message.error('Please login to view ratings');
      navigate('/');
      return;
    }
    fetchRatings();
    fetchTrainers();
  }, [userId, userType]);

  const fetchTrainers = async () => {
    try {
      setLoadingTrainers(true);
      const res = await axios.get('http://localhost:5000/api/v1/staffmember/list');
      const staffData = res?.data?.data || [];
      const trainersList = staffData.filter(staff =>
        staff.Job_Role && staff.Job_Role.toLowerCase().includes('trainer')
      );
      setTrainers(trainersList);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoadingTrainers(false);
    }
  };

  const handleOpenRateModal = () => {
    form.resetFields();
    setRateModalVisible(true);
  };

  const handleSubmitRating = async (values) => {
    try {
      setSubmittingRating(true);
      const body = {
        staffId: values.trainerId,
        memberId: parseInt(userId),
        rating: values.rating,
        comment: values.comment || ''
      };

      await axios.post('http://localhost:5000/api/v1/trainerrate/create', body);
      message.success('Rating submitted successfully!');
      setRateModalVisible(false);
      form.resetFields();
      fetchRatings();
    } catch (error) {
      console.error('Error submitting rating:', error);
      message.error('Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('login');
    message.success('Logged out successfully');
    navigate('/');
  };

  const fetchRatings = async () => {
    try {
      setLoadingRatings(true);
      const res = await axios.get('http://localhost:5000/api/v1/trainerrate/list');
      const ratingsData = res?.data?.data || [];

      let processedRatings = [];

      if (userType === 'member') {
        // Fetch staff details to map names for member view
        const staffRes = await axios.get('http://localhost:5000/api/v1/staffmember/list');
        const staffData = staffRes?.data?.data || [];

        const myRatings = ratingsData.filter(rating => rating.Member_Id === parseInt(userId));

        processedRatings = myRatings.map(rating => {
          const staffMember = staffData.find(s =>
            (s.Staff_ID || s.Staff_Id || s.staff_id || s.id) === rating.Staff_ID
          );
          const staffName = staffMember
            ? `${staffMember.FName || ''} ${staffMember.LName || ''}`.trim() || staffMember.Name || 'Unknown Trainer'
            : 'Unknown Trainer';

          return {
            ...rating,
            displayName: staffName, // Display Trainer Name
            istrainer: true
          };
        });
      } else if (userType === 'staff') {
        // Fetch member details to map names for staff view
        const memberRes = await axios.get('http://localhost:5000/api/v1/member/list');
        const memberData = memberRes?.data?.data || [];

        // Filter ratings received by this staff member
        const myRatings = ratingsData.filter(rating => rating.Staff_ID === parseInt(userId));

        processedRatings = myRatings.map(rating => {
          const member = memberData.find(m => m.Member_Id === rating.Member_Id);
          const memberName = member
            ? `${member.FName || ''} ${member.LName || ''}`.trim()
            : 'Unknown Member';

          return {
            ...rating,
            displayName: memberName, // Display Member Name
            istrainer: false
          };
        });
      }

      setRatings(processedRatings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      message.error('Failed to load ratings');
    } finally {
      setLoadingRatings(false);
    }
  };

  const columns = [
    {
      title: userType === 'staff' ? 'Member Name' : 'Trainer Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (name) => (
        <Space>
          {userType === 'staff' ? <UserOutlined style={{ color: '#667eea' }} /> : <TeamOutlined style={{ color: '#667eea' }} />}
          <strong>{name}</strong>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'Rating',
      key: 'Rating',
      width: 180,
      render: (rating) => (
        <Rate disabled value={rating} style={{ fontSize: 16 }} />
      ),
      sorter: (a, b) => a.Rating - b.Rating,
    },
    {
      title: 'Comment',
      dataIndex: 'Comment',
      key: 'Comment',
      ellipsis: true,
      render: (comment) => (
        <div style={{ maxWidth: 400 }}>
          {comment || 'No comment'}
        </div>
      ),
    },
  ];

  // Define sidebar items based on user type
  const staffItems = [
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

  const displayItems = userType === 'staff' ? staffItems : items;

  const handleMenuClick = ({ key }) => {
    if (userType === 'staff') {
      navigate(key);
    } else {
      const selectedItem = items.find(item => item.key === key);
      if (selectedItem) navigate(selectedItem.path);
    }
  };

  const selectedKey = userType === 'staff' ? location.pathname : '9';

  return (
    <Layout hasSider className="trainerrate-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
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
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          className="dashboard-menu"
          items={displayItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            style: menuItemStyle
          }))}
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

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }}>
        <Header className="trainerrate-header">
          <div className="header-content-wrapper">
            <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '700' }}>
              <StarOutlined style={{ marginRight: 12 }} />
              Rate Trainer
            </h2>
            <Space>
              <Avatar style={{ background: '#667eea' }} icon={<UserOutlined />} />
              <span style={{ color: 'white', fontWeight: 600 }}>{userName}</span>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Space>
          </div>
        </Header>

        <Content className="trainerrate-main-content">
          <div className="trainerrate-content">
            <Row gutter={[24, 24]}>
              {userType !== 'staff' && (
                <Col xs={24}>
                  <Card
                    className="rate-trainer-card"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                    styles={{ body: { padding: '32px' } }}
                  >
                    <Row align="middle" justify="space-between">
                      <Col>
                        <Space direction="vertical" size={4}>
                          <h3 style={{ color: 'white', margin: 0, fontSize: 24 }}>
                            <StarFilled style={{ marginRight: 12, color: '#ffd700' }} />
                            Share Your Experience
                          </h3>
                          <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontSize: 16 }}>
                            Rate your trainer and help us improve our services
                          </p>
                        </Space>
                      </Col>
                      <Col>
                        <Button
                          type="primary"
                          size="large"
                          icon={<PlusOutlined />}
                          onClick={handleOpenRateModal}
                          style={{
                            height: 48,
                            background: 'white',
                            color: '#667eea',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: 16
                          }}
                        >
                          Rate a Trainer
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              )}

              <Col xs={24}>
                <Card
                  className="ratings-table-card"
                  title={
                    <Space>
                      <StarFilled style={{ fontSize: 24, color: '#ffd700' }} />
                      <span style={{ fontSize: 20, fontWeight: 700 }}>My Ratings</span>
                      <Tag color="purple" style={{ fontSize: 14, padding: '4px 12px' }}>{ratings.length} Total</Tag>
                    </Space>
                  }
                >
                  <Table
                    columns={columns}
                    dataSource={ratings}
                    rowKey="Rating_ID"
                    loading={loadingRatings}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} ratings`,
                      pageSizeOptions: ['10', '20', '50'],
                    }}
                    locale={{
                      emptyText: 'You haven\'t rated any trainers yet'
                    }}
                    className="ratings-table"
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>

      {/* Rate Trainer Modal */}
      <Modal
        title={
          <Space>
            <StarFilled style={{ color: '#ffd700', fontSize: 24 }} />
            <span style={{ fontSize: 20, fontWeight: 700 }}>Rate Trainer</span>
          </Space>
        }
        open={rateModalVisible}
        onCancel={() => setRateModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitRating}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="trainerId"
            label={<span style={{ fontWeight: 600, fontSize: 15 }}>Select Trainer</span>}
            rules={[{ required: true, message: 'Please select a trainer' }]}
          >
            <Select
              placeholder="Choose a trainer to rate"
              size="large"
              loading={loadingTrainers}
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
            >
              {trainers.map(trainer => (
                <Option key={trainer.Staff_ID} value={trainer.Staff_ID}>
                  <Space>
                    <TeamOutlined style={{ color: '#667eea' }} />
                    {trainer.FName} {trainer.LName || ''} - {trainer.Job_Role}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="rating"
            label={<span style={{ fontWeight: 600, fontSize: 15 }}>Your Rating</span>}
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate style={{ fontSize: 32 }} />
          </Form.Item>

          <Form.Item
            name="comment"
            label={<span style={{ fontWeight: 600, fontSize: 15 }}>Comment (Optional)</span>}
          >
            <TextArea
              rows={4}
              placeholder="Share your experience with this trainer..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Divider style={{ margin: '24px 0' }} />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space size="middle">
              <Button
                size="large"
                onClick={() => setRateModalVisible(false)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={submittingRating}
                icon={<SendOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  minWidth: 140
                }}
              >
                Submit Rating
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
