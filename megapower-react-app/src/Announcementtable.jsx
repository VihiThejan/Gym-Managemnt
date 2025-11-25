import { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CalendarOutlined,
  UserOutlined,
  SoundOutlined
} from "@ant-design/icons";
import moment from 'moment';
import MainLayout from './components/Layout/MainLayout';
import './Announcementtable.css';





export const Announcementtable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/announcement/list");
      setData(response?.data?.data || []);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      message.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement_id) => {
    console.log(`Edit record with Announcement ID: ${announcement_id}`);
    navigate(`/Announcement/${announcement_id}`);
  };

  const handleDelete = async (announcement_id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/v1/announcement/delete/${announcement_id}`);
      console.log(`Deleted record with Announcement ID: ${announcement_id}`);
      message.success("Announcement deleted successfully");
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error(`Error deleting record: ${error.message}`);
      message.error("Failed to delete announcement");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Announcement_ID',
      key: 'announcement_id',
      fixed: "left", 
      width: 80,
      render: (id) => (
        <span className="announcement-id-cell">#{id}</span>
      ),
    },
    {
      title: 'Admin ID',
      dataIndex: 'Staff_ID',
      key: 'staff_id',
      width: 120,
      render: (staff_id) => (
        <span className="announcement-staff-cell">
          <UserOutlined />
          Admin #{staff_id}
        </span>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'Message',
      key: 'message',
      width: 400,
      render: (message) => (
        <div className="announcement-message-cell" title={message}>
          {message}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'Date_Time',
      key: 'date',
      width: 150,
      render: (date) => (
        <span className="announcement-date-cell">
          <CalendarOutlined />
          {moment(date).format('YYYY.MM.DD')}
        </span>
      ),
      sorter: (a, b) => moment(a.Date_Time).unix() - moment(b.Date_Time).unix(), 
    },
    {
      title: "Actions",
      key: "action",
      width: 180,
      fixed: "right", 
      render: (_, record) => (
        <div className="announcement-table-action-buttons">
          <button 
            className="announcement-table-btn announcement-table-btn-edit"
            onClick={() => handleEdit(record.Announcement_ID)}
          >
            <EditOutlined />
            Edit
          </button>
          <button 
            className="announcement-table-btn announcement-table-btn-delete"
            onClick={() => handleDelete(record.Announcement_ID)}
          >
            <DeleteOutlined />
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Filter data based on search
  const filteredData = data.filter(item => 
    item.Message?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.Staff_ID?.toString().includes(searchText) ||
    item.Announcement_ID?.toString().includes(searchText)
  );

  return (
    <MainLayout showSidebar={true} showNavigation={false}>
      <div className="announcement-table-container">
        <div className="announcement-table-card">
          {/* Header */}
          <div className="announcement-table-header">
            <div className="announcement-table-header-content">
              <div className="announcement-table-title-section">
                <div className="announcement-table-icon">📢</div>
                <div className="announcement-table-title-group">
                  <h1>Announcements</h1>
                  <p className="announcement-table-subtitle">
                    Manage and view all system announcements
                  </p>
                </div>
              </div>
              <div className="announcement-table-actions">
                <button 
                  className="announcement-action-button announcement-action-button-primary"
                  onClick={() => navigate("/Announcement")}
                >
                  <PlusOutlined />
                  New Announcement
                </button>
                <button 
                  className="announcement-action-button announcement-action-button-secondary"
                  onClick={() => navigate("/Dashboard")}
                >
                  <ArrowLeftOutlined />
                  Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="announcement-table-body">
            {/* Controls */}
            <div className="announcement-table-controls">
              <div className="announcement-table-stats">
                <div className="announcement-stat-item">
                  <SoundOutlined style={{ fontSize: '20px', color: '#f093fb' }} />
                  <span className="announcement-stat-label">Total:</span>
                  <span className="announcement-stat-value">{data.length}</span>
                </div>
                <div className="announcement-stat-item">
                  <CalendarOutlined style={{ fontSize: '20px', color: '#f093fb' }} />
                  <span className="announcement-stat-label">Showing:</span>
                  <span className="announcement-stat-value">{filteredData.length}</span>
                </div>
              </div>

              <div className="announcement-search-box">
                <input
                  type="text"
                  placeholder="🔍 Search announcements..."
                  className="announcement-search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="announcement-custom-table">
              {loading ? (
                <div className="announcement-loading">
                  <div className="announcement-loading-spinner">⏳</div>
                  <p className="announcement-loading-text">Loading announcements...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="announcement-empty-state">
                  <div className="announcement-empty-icon">📭</div>
                  <h3 className="announcement-empty-title">No announcements found</h3>
                  <p className="announcement-empty-text">
                    {searchText ? 'Try adjusting your search terms' : 'Create your first announcement to get started'}
                  </p>
                  {!searchText && (
                    <button 
                      className="announcement-action-button announcement-action-button-primary"
                      onClick={() => navigate("/Announcement")}
                      style={{ margin: '0 auto' }}
                    >
                      <PlusOutlined />
                      Create Announcement
                    </button>
                  )}
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="Announcement_ID"
                  scroll={{
                    x: 1000, 
                    y: 500, 
                  }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} announcements`,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
