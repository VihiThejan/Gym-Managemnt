import React, { useState, useEffect } from "react";
import { Layout, Menu, Rate, message, Card, Table, Tag, Space, Button, Modal, Input } from "antd";
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
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Logo from './components/Logo';
import './Trainerrate.css';

const { TextArea } = Input;

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
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleReplyClick = (record) => {
    setSelectedRating(record);
    setReplyModalVisible(true);
    setReplyText('');
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      message.warning('Please enter a reply message');
      return;
    }

    try {
      setReplyLoading(true);
      // You can implement the reply API endpoint here
      // await axios.post('http://localhost:5000/api/v1/trainerrate/reply', {
      //   ratingId: selectedRating.Rating_ID,
      //   reply: replyText
      // });
      
      message.success('Reply sent successfully!');
      setReplyModalVisible(false);
      setReplyText('');
      setSelectedRating(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      message.error('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyModalVisible(false);
    setReplyText('');
    setSelectedRating(null);
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
        <div style={{ maxWidth: 400 }}>
          {comment}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<CommentOutlined />}
          onClick={() => handleReplyClick(record)}
          className="reply-button"
          size="middle"
        >
          Reply
        </Button>
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
            <Card 
              className="ratings-table-card"
              title={
                <Space>
                  <StarFilled style={{ fontSize: 24, color: '#ffd700' }} />
                  <span style={{ fontSize: 20, fontWeight: 700 }}>Trainer Ratings</span>
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
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
                scroll={{ x: 1200 }}
                className="ratings-table"
              />
            </Card>
          </div>
        </Content>
      </Layout>

      {/* Reply Modal */}
      <Modal
        title={
          <Space>
            <CommentOutlined style={{ color: '#667eea', fontSize: 20 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>Reply to Rating</span>
          </Space>
        }
        open={replyModalVisible}
        onOk={handleReplySubmit}
        onCancel={handleReplyCancel}
        confirmLoading={replyLoading}
        okText="Send Reply"
        cancelText="Cancel"
        width={600}
        okButtonProps={{
          icon: <SendOutlined />,
          style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }
        }}
      >
        {selectedRating && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <strong>Trainer:</strong> <Tag color="blue">{selectedRating.trainerName}</Tag>
                </div>
                <div>
                  <strong>Member ID:</strong> <Tag>{selectedRating.Member_Id}</Tag>
                </div>
                <div>
                  <strong>Rating:</strong> <Rate disabled value={selectedRating.Rating} style={{ fontSize: 14 }} />
                </div>
                <div>
                  <strong>Comment:</strong>
                  <div style={{ marginTop: 8, padding: 12, background: 'white', borderRadius: 6, border: '1px solid #e0e0e0' }}>
                    {selectedRating.Comment}
                  </div>
                </div>
              </Space>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                Your Reply:
              </label>
              <TextArea
                rows={5}
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                maxLength={500}
                showCount
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};
