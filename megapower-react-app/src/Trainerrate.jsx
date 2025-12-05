import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Form, Rate, Input, message, Card, Select } from "antd";
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
      // Navigate to success page immediately
      navigate('/RatingSubmitted');
    } catch (error) {
      console.error('Error submitting rating:', error);
      message.error("Failed to submit trainer rating.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
  };

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
          defaultSelectedKeys={['9']}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} style={menuItemStyle} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
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
            <Card className="trainerrate-card">
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

          <Card className="info-card">
            <div className="info-header">
              <TrophyOutlined className="info-icon" />
              <h3>Rating Guidelines</h3>
            </div>
            <div className="info-content">
              <div className="info-item">
                <StarOutlined className="item-icon" />
                <div>
                  <h4>Be Honest</h4>
                  <p>Provide honest feedback to help trainers improve</p>
                </div>
              </div>
              <div className="info-item">
                <UserOutlined className="item-icon" />
                <div>
                  <h4>Be Specific</h4>
                  <p>Mention specific aspects of training that stood out</p>
                </div>
              </div>
              <div className="info-item">
                <TeamOutlined className="item-icon" />
                <div>
                  <h4>Be Constructive</h4>
                  <p>Focus on constructive feedback for improvement</p>
                </div>
              </div>
              <div className="info-item">
                <CommentOutlined className="item-icon" />
                <div>
                  <h4>Be Detailed</h4>
                  <p>Include details about your training experience</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        </Content>
      </Layout>
    </Layout>
  );
};
