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
        <div className="action-buttons">
          <button 
            className="edit-button"
            onClick={() => handleEdit(record.Announcement_ID)}
          >
            <EditOutlined />
            Edit
          </button>
          <button 
            className="delete-button"
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
        {/* Header */}
        <div className="table-header">
          <div className="header-left">
            <SoundOutlined className="header-icon" />
            <h1 className="table-title">Announcement Management</h1>
          </div>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Search announcements..."
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button 
              className="add-button"
              onClick={() => navigate("/Announcement")}
            >
              <PlusOutlined />
              New Announcement
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-content">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="Announcement_ID"
            loading={loading}
            scroll={{ x: 1000 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} announcements`,
            }}
            className="announcement-table"
          />
        </div>
      </div>
    </MainLayout>
  );
};
