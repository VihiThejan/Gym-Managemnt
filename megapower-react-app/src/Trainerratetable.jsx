import React, { useEffect, useState } from "react";
import { Button, Table, Input, Tag, Rate, message, Modal, Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  StarOutlined,
  UserOutlined,
  TeamOutlined,
  CommentOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DollarOutlined,
  NotificationOutlined,
  CalendarOutlined,
  MessageOutlined,
  ScheduleOutlined,
  LogoutOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import AdminSidebar from './components/AdminSidebar';
import Logo from './components/Logo';
import './Trainerratetable.css';

const { Content, Sider } = Layout;

export const Trainerratetable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Helper to get login data
  const getLoginData = () => {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsedData = JSON.parse(loginData);
        if (parsedData.Member_Id) {
          return { userId: parsedData.Member_Id, userType: 'member' };
        } else if (parsedData.Staff_ID || parsedData.Staff_Id || parsedData.id) {
          return { userId: parsedData.Staff_ID || parsedData.Staff_Id || parsedData.id, userType: 'staff' };
        } else if (parsedData.adminId || parsedData.role === 'admin') { // Assuming admin structure
          return { userId: 'admin', userType: 'admin' };
        }
        // Fallback for Admin (often just "role: admin" or similar in simpler apps)
        // If AdminSidebar is used, presumably there's a check. 
        // For now, if not member/staff, assume Admin access if accessing this page?
        // Actually, let's default to Admin if no staff/member ID found but login exists?
        return { userId: 'admin', userType: 'admin' };
      }
      return { userId: null, userType: null };
    } catch (error) {
      return { userId: null, userType: null };
    }
  };

  const { userId, userType } = getLoginData();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/trainerrate/list");
      let allData = response?.data?.data || [];

      // Filter for Staff
      if (userType === 'staff') {
        allData = allData.filter(item => item.Staff_ID === parseInt(userId));
      }

      setData(allData);
      setFilteredData(allData);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      message.error('Failed to fetch trainer ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = data.filter((item) =>
        String(item.Rating_ID || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Staff_ID || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Member_Id || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Rating || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Comment || '').toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleEdit = (ratingId) => {
    navigate(`/EditTrainerrate/${ratingId}`);
  };

  const handleDelete = (ratingId) => {
    Modal.confirm({
      title: 'Delete Rating',
      content: 'Are you sure you want to delete this rating? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/v1/trainerrate/delete/${ratingId}`);
          message.success('Rating deleted successfully');
          fetchData();
        } catch (error) {
          message.error('Failed to delete rating');
        }
      }
    });
  };

  const columns = [
    {
      title: "Rating ID",
      dataIndex: "Rating_ID",
      key: "rating_ID",
      width: 120,
      render: (id) => (
        <Tag color="purple" className="id-tag">
          <TrophyOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Staff ID",
      dataIndex: "Staff_ID",
      key: "staff_ID",
      width: 120,
      render: (id) => (
        <Tag color="geekblue" className="staff-tag">
          <TeamOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "member_ID",
      width: 120,
      render: (id) => (
        <Tag color="blue" className="member-tag">
          <UserOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Rating",
      dataIndex: "Rating",
      key: "rating",
      width: 180,
      render: (rating) => (
        <div className="rating-cell">
          <Rate disabled value={rating} className="table-rate" />
          <span className="rating-value">({rating}/5)</span>
        </div>
      ),
    },
    {
      title: "Comment",
      dataIndex: "Comment",
      key: "comment",
      width: 300,
      render: (comment) => (
        <div className="comment-cell">
          <CommentOutlined className="comment-icon" />
          <span className="comment-text">{comment}</span>
        </div>
      ),
    },
  ];

  // Only add Actions column if NOT staff (i.e. Admin)
  if (userType !== 'staff') {
    columns.push({
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.Rating_ID)}
            className="edit-button"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.Rating_ID)}
            className="delete-button"
          >
            Delete
          </Button>
        </div>
      ),
    });
  }

  // Staff Sidebar Logic
  const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
  };

  const getStaffMenuItems = () => [
    { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '/staffDashboard' },
    { label: 'My Profile', icon: <UserOutlined />, key: '/staffProfile' },
    { label: 'My Ratings', icon: <StarOutlined />, key: '/Trainerrate' }, // Mapping 'My Ratings' to this view if needed, or keeping unified
    // Note: If Trainerratetable is "My Ratings", we link here.
  ];

  const handleLogout = () => {
    localStorage.removeItem('login');
    navigate('/');
  };

  // If Staff, use Custom Layout. If Admin, use AdminSidebar
  const isStaff = userType === 'staff';

  return (
    <Layout className="dashboard-layout" hasSider>
      {isStaff ? (
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
            selectedKeys={['/Trainerrate']} // Highlight depending on where we are
            items={[
              { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '/staffDashboard' },
              { label: 'My Profile', icon: <UserOutlined />, key: '/staffProfile' },
              { label: 'Payment', icon: <DollarOutlined />, key: '/staffPayment' },
              { label: 'Announcements', icon: <NotificationOutlined />, key: '/staffAnnouncement' },
              { label: 'My Attendance', icon: <CalendarOutlined />, key: '/staffAttendance' },
              { label: 'Appointments', icon: <ScheduleOutlined />, key: '/staffAppointment' },
              { label: 'Chat', icon: <MessageOutlined />, key: '/staffChat' },
              { label: 'Rate Trainer', icon: <StarOutlined />, key: '/Trainerrate' },
              { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '/WorkoutTracker' },
              { label: 'Logout', icon: <LogoutOutlined />, key: 'logout', onClick: handleLogout, danger: true }
            ]}
            onClick={({ key }) => {
              if (key === 'logout') handleLogout();
              else navigate(key);
            }}
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
            {collapsed ? <MenuUnfoldOutlined style={{ color: 'white' }} /> : <MenuFoldOutlined style={{ color: 'white' }} />}
          </div>
        </Sider>
      ) : (
        <AdminSidebar selectedKey="/Trainerratetable" />
      )}

      <Layout style={{ marginLeft: isStaff ? (collapsed ? 80 : 250) : 260 }}>
        <Content>
          <div className="trainerrate-table-container">
            <div className="trainerrate-table-header">
              <div className="header-icon">
                <StarOutlined />
              </div>
              <h1 className="header-title">{isStaff ? 'My Ratings' : 'Trainer Ratings'}</h1>
              <p className="header-subtitle">{isStaff ? 'View feedback from your members' : 'View and manage all trainer ratings and feedback'}</p>
            </div>

            <div className="table-actions">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
                className="search-input"
              />
              {!isStaff && (
                <Button
                  type="primary"
                  icon={<StarOutlined />}
                  onClick={() => navigate("/Trainerrate")}
                  className="add-button"
                >
                  Add New Rating
                </Button>
              )}
            </div>

            <div className="table-wrapper">
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="Rating_ID"
                loading={loading}
                scroll={{ x: 1200 }}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total ${total} ratings`,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
                className="trainerrate-table"
              />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Trainerratetable;
