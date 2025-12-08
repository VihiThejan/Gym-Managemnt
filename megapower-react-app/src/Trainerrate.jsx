import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Form, Rate, Input, message, Card, Select, Table, Tag, Space, Divider } from "antd";
import { 
  StarOutlined, 
  UserOutlined, 
  TeamOutlined, 
  CommentOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  DashboardOutlined,
  DollarOutlined,
  NotificationOutlined,
  CalendarOutlined,
  MessageOutlined,
  ScheduleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  EyeOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Logo from './components/Logo';
import './Trainerrate.css';

const { Header, Content, Sider } = Layout;

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
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  useEffect(() => {
    // Auto-populate member ID from logged-in user
    const loginData = localStorage.getItem('login');
    if (loginData) {
      try {
        const user = JSON.parse(loginData);
        if (user.Member_Id) {
          form.setFieldsValue({ memberId: user.Member_Id });
        }
      } catch (error) {
        console.error('Error parsing login data:', error);
      }
    }
    
    fetchStaff();
    fetchRatings();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const res = await axios.get('http://localhost:5000/api/v1/staffmember/list');
      setStaff(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      message.error('Failed to load staff');
    } finally {
      setLoadingStaff(false);
    }
  };

  const fetchRatings = async () => {
    try {
      setLoadingRatings(true);
      const res = await axios.get('http://localhost:5000/api/v1/trainerrate/list');
      const ratingsData = res?.data?.data || [];
      
      // Fetch staff details to map names
      const staffRes = await axios.get('http://localhost:5000/api/v1/staffmember/list');
      const staffData = staffRes?.data?.data || [];
      
      // Map ratings with staff names
      const ratingsWithNames = ratingsData.map(rating => {
        const staffMember = staffData.find(s => 
          (s.Staff_ID || s.Staff_Id || s.staff_id || s.id) === rating.Staff_ID
        );
        const staffName = staffMember 
          ? `${staffMember.FName || ''} ${staffMember.LName || ''}`.trim() || staffMember.Name || 'Unknown Trainer'
          : 'Unknown Trainer';
        
        return {
          ...rating,
          trainerName: staffName,
        };
      });
      
      setRatings(ratingsWithNames);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      message.error('Failed to load ratings');
    } finally {
      setLoadingRatings(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const body = {
        staffId: values.staffId,
        memberId: values.memberId,
        rating: values.rating,
        comment: values.comment,
      };

      await axios.post('http://localhost:5000/api/v1/trainerrate/create', body);
      message.success('Rating submitted successfully!');
      form.resetFields();
      
      // Auto-populate member ID again after reset
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const user = JSON.parse(loginData);
        if (user.Member_Id) {
          form.setFieldsValue({ memberId: user.Member_Id });
        }
      }
      
      // Refresh ratings list
      fetchRatings();
    } catch (error) {
      console.error('Error submitting rating:', error);
      message.error("Failed to submit trainer rating.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    // Auto-populate member ID again after clear
    const loginData = localStorage.getItem('login');
    if (loginData) {
      const user = JSON.parse(loginData);
      if (user.Member_Id) {
        form.setFieldsValue({ memberId: user.Member_Id });
      }
    }
  };

  const columns = [
    {
      title: 'Rating ID',
      dataIndex: 'Rating_ID',
      key: 'Rating_ID',
      width: 100,
      sorter: (a, b) => a.Rating_ID - b.Rating_ID,
    },
    {
      title: 'Trainer Name',
      dataIndex: 'trainerName',
      key: 'trainerName',
      render: (name) => (
        <Space>
          <TeamOutlined style={{ color: '#667eea' }} />
          <strong>{name}</strong>
        </Space>
      ),
    },
    {
      title: 'Member ID',
      dataIndex: 'Member_Id',
      key: 'Member_Id',
      width: 120,
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
        <div style={{ maxWidth: 300 }}>
          {comment}
        </div>
      ),
    },
  ];

  return (
    <Layout hasSider className="trainerrate-layout">
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
          selectedKeys={['9']}
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

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }}>
        <Header className="trainerrate-header">
          <div className="header-content-wrapper">
            <h2 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: '700' }}>
              <StarOutlined style={{ marginRight: 12 }} />
              Rate Trainer
            </h2>
          </div>
        </Header>

        <Content className="trainerrate-main-content">
          <div className="trainerrate-content">
            <Card className="trainerrate-card" style={{ marginBottom: 24 }}>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="trainerrate-form"
            >
              <div className="form-header">
                <h2 className="form-title">
                  <StarOutlined className="title-icon" />
                  Rate Your Trainer
                </h2>
                <p className="form-description">Share your feedback to help us improve our training services</p>
              </div>

              <Form.Item
                label="Select Trainer"
                name="staffId"
                rules={[{ required: true, message: 'Please select a trainer' }]}
                className="form-item"
              >
                <Select
                  placeholder="Choose your trainer"
                  size="large"
                  showSearch
                  loading={loadingStaff}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  suffixIcon={<TeamOutlined />}
                >
                  {staff.map((staffMember) => {
                    const staffId = staffMember.Staff_ID || staffMember.Staff_Id || staffMember.staff_id || staffMember.id;
                    const staffName = `${staffMember.FName || ''} ${staffMember.LName || ''}`.trim() || staffMember.Name || staffMember.name || staffMember.StaffName || 'Unknown';
                    const position = staffMember.Position || 'Trainer';
                    return (
                      <Select.Option key={staffId} value={staffId} label={`${staffName} - ${position}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <TeamOutlined style={{ color: '#667eea' }} />
                          <span><strong>{staffName}</strong> - {position}</span>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>

              {/* Member ID is auto-populated from logged-in user */}
              <Form.Item
                name="memberId"
                rules={[{ required: true, message: 'Member ID is required' }]}
                hidden
              >
                <Input type="hidden" />
              </Form.Item>

              <Form.Item
                label="Rating"
                name="rating"
                rules={[{ required: true, message: 'Please provide a rating' }]}
                className="rating-item"
              >
                <Rate className="custom-rate" />
              </Form.Item>

              <Form.Item
                label="Comment"
                name="comment"
                rules={[
                  { required: true, message: 'Please provide a comment' },
                  { min: 10, message: 'Comment must be at least 10 characters' }
                ]}
                className="form-item"
              >
                <TextArea
                  rows={5}
                  placeholder="Share your experience and feedback about the trainer..."
                  prefix={<CommentOutlined />}
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item className="form-actions">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<CheckCircleOutlined />}
                  loading={loading}
                  className="submit-button"
                >
                  Submit Rating
                </Button>
                <Button 
                  onClick={handleClear}
                  className="clear-button"
                >
                  Clear
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Divider>
            <Space>
              <StarFilled style={{ color: '#ffd700', fontSize: 20 }} />
              <span style={{ fontSize: 18, fontWeight: 600, color: '#667eea' }}>All Trainer Ratings</span>
              <StarFilled style={{ color: '#ffd700', fontSize: 20 }} />
            </Space>
          </Divider>

          <Card 
            className="ratings-table-card"
            title={
              <Space>
                <EyeOutlined style={{ fontSize: 20, color: '#667eea' }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>Submitted Ratings</span>
                <Tag color="purple">{ratings.length} Total</Tag>
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
              }}
              scroll={{ x: 800 }}
              className="ratings-table"
            />
          </Card>
        </div>
        </Content>
      </Layout>
    </Layout>
  );
};
