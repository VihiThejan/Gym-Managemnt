import React, { useState, useEffect } from "react";
import { Layout, Card, Table, Input, Tag, message, Avatar, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  TeamOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  IdcardOutlined,
  CalendarOutlined,
  SearchOutlined,
  DashboardOutlined,
  DollarOutlined,
  NotificationOutlined,
  MessageOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined
} from "@ant-design/icons";
import moment from "moment";
import Logo from './components/Logo';
import './StaffInfoTable.css';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
};

const items = [
  { label: 'Dashboard', icon: <DashboardOutlined />, key: '1', path: '/staffDashboard' },
  { label: 'Staff Info', icon: <TeamOutlined />, key: '2', path: '/staffInfo' },
  { label: 'Payment', icon: <DollarOutlined />, key: '5', path: '/Paymenttable' },
  { label: 'Announcement', icon: <NotificationOutlined />, key: '6', path: '/staffAnnouncement' },
  { label: 'Attendance', icon: <CalendarOutlined />, key: '7', path: '/Attendancetable' },
  { label: 'Appointment', icon: <PhoneOutlined />, key: '8', path: '/Appoinmenttable' },
  { label: 'Chat', icon: <MessageOutlined />, key: '9', path: '/chat' },
];

const StaffInfoTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/staffmember/list");
      setData(res?.data?.data);
      setFilteredData(res?.data?.data);
    } catch (error) {
      message.error('Failed to fetch staff information');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Staff_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.FName || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Email || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Job_Role || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Contact_No || '').toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);  
    }
  };

  const handleLogout = () => {
    message.success('Logged out successfully');
    navigate('/login');
  };

  const profileMenu = (
    <div className="profile-dropdown">
      <div className="profile-item" onClick={() => navigate('/profile')}>
        <SettingOutlined /> Settings
      </div>
      <div className="profile-item" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </div>
    </div>
  );

  const columns = [
    {
      title: "Staff ID",
      dataIndex: "Staff_ID",
      key: "staffid",
      fixed: "left",
      width: 120,
      render: (id) => (
        <Tag color="purple" className="id-tag">
          <IdcardOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Name",
      dataIndex: "FName",
      key: "fname",
      width: 200,
      render: (text, record) => (
        <div className="name-cell">
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ 
              background: record.Gender === 'Male' ? 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
            }}
          />
          <div className="name-info">
            <span className="name-text">{text}</span>
            {record.Gender && (
              <span className="gender-icon">
                {record.Gender === 'Male' ? 
                  <ManOutlined style={{ color: '#667eea' }} /> : 
                  <WomanOutlined style={{ color: '#f5576c' }} />
                }
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Job Role",
      dataIndex: "Job_Role",
      key: "jobrole",
      width: 180,
      render: (role) => {
        const colors = {
          'Manager': 'purple',
          'Trainer': 'blue',
          'Receptionist': 'green',
          'Cleaner': 'orange',
          'Maintenance': 'red'
        };
        return (
          <Tag color={colors[role] || 'default'} className="role-tag">
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      width: 220,
      render: (email) => (
        <div className="info-cell">
          <MailOutlined className="cell-icon" />
          <span>{email}</span>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "Contact_No",
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
      title: "Address",
      dataIndex: "Address",
      key: "address",
      width: 250,
      ellipsis: true,
      render: (address) => (
        <div className="info-cell">
          <EnvironmentOutlined className="cell-icon" />
          <span>{address}</span>
        </div>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "Date_of_Birth",
      key: "dob",
      width: 140,
      render: (date) => (
        <div className="info-cell">
          <CalendarOutlined className="cell-icon" />
          <span>{date ? moment(date).format('DD MMM YYYY') : 'N/A'}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      width: 120,
      fixed: "right",
      render: (status) => (
        <Tag color={status === 'Active' ? 'success' : 'default'} className="status-tag">
          {status || 'Active'}
        </Tag>
      ),
    },
  ];

  return (
    <Layout className="staff-info-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={siderStyle}
        width={250}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" />
        </div>
        <div className="dashboard-menu">
          {items.map(({ label, icon, key, path }) => (
            <div
              key={key}
              className={`menu-item ${path === '/staffInfo' ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              <span className="menu-icon">{icon}</span>
              {!collapsed && <span className="menu-label">{label}</span>}
            </div>
          ))}
        </div>
      </Sider>

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }} className="main-layout">
        <Header className="staff-info-header">
          <div className="header-left">
            <div 
              className="trigger-button"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <h2 className="page-title">Staff Information</h2>
          </div>

          <div className="header-right">
            <div className="notification-badge">
              <BellOutlined className="notification-icon" />
              <span className="badge-count">3</span>
            </div>
            <Avatar 
              className="user-avatar" 
              icon={<UserOutlined />}
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>

        <Content className="staff-info-content">
          <div className="content-wrapper">
            <Card 
              className="info-card"
              title={
                <div className="card-title-wrapper">
                  <div className="title-section">
                    <TeamOutlined className="title-icon" />
                    <span className="title-text">Staff Team Directory</span>
                  </div>
                  <span className="title-subtitle">View all staff members and their contact information</span>
                </div>
              }
              extra={
                <Search
                  placeholder="Search by name, ID, role, email or contact..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                  style={{ width: 400 }}
                />
              }
            >
              <div className="stats-summary">
                <Row gutter={16}>
                  <Col span={6}>
                    <div className="stat-box stat-purple">
                      <TeamOutlined className="stat-icon" />
                      <div className="stat-content">
                        <div className="stat-value">{filteredData.length}</div>
                        <div className="stat-label">Total Staff</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="stat-box stat-blue">
                      <UserOutlined className="stat-icon" />
                      <div className="stat-content">
                        <div className="stat-value">
                          {filteredData.filter(s => s.Job_Role === 'Trainer').length}
                        </div>
                        <div className="stat-label">Trainers</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="stat-box stat-green">
                      <ManOutlined className="stat-icon" />
                      <div className="stat-content">
                        <div className="stat-value">
                          {filteredData.filter(s => s.Gender === 'Male').length}
                        </div>
                        <div className="stat-label">Male Staff</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="stat-box stat-pink">
                      <WomanOutlined className="stat-icon" />
                      <div className="stat-content">
                        <div className="stat-value">
                          {filteredData.filter(s => s.Gender === 'Female').length}
                        </div>
                        <div className="stat-label">Female Staff</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="Staff_ID"
                loading={loading}
                scroll={{ x: 1500 }}
                className="staff-info-table"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} staff members`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
              />
            </Card>
          </div>
        </Content>

        <Footer className="staff-info-footer">
          <div className="footer-content">
            <span>Mega Power Gym & Fitness © 2025</span>
            <span>Staff Information Portal</span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffInfoTable;
