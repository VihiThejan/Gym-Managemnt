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
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  PhoneOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import moment from 'moment';
import MainLayout from './components/Layout/MainLayout';
import './Appoinmenttable.css';

export const Appoinmenttable = () => {
  const navigate = useNavigate(); 
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/appointment/list");
      setData(response?.data?.data || []);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      message.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  
  const handleEdit = (appointmentId) => {
    navigate(`/Appoinment/${appointmentId}`);
  };

  
  const handleDelete = async (appointmentid) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/v1/appointment/delete/${appointmentid}`);
      message.success("Appointment deleted successfully");
      fetchData(); 
    } catch (error) {
      console.error(`Error deleting record: ${error.message}`);
      message.error("Failed to delete appointment");
    }
  };

  const filteredData = data.filter((item) =>
    item.Member_Id.toString().includes(searchTerm) ||
    item.Staff_ID.toString().includes(searchTerm) ||
    item.Contact.toString().includes(searchTerm) ||
    item.App_ID.toString().includes(searchTerm)
  );

  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'App_ID',
      key: 'appointmentid',
      fixed: "left", 
      width: 80,
      render: (id) => (
        <span className="appointment-id-cell">#{id}</span>
      ),
    },
    {
      title: 'Member',
      dataIndex: 'Member_Id',
      key: 'member_id',
      width: 120,
      render: (member_id) => (
        <span className="appointment-member-cell">
          <UserOutlined />
          M-{member_id}
        </span>
      ),
    },
    {
      title: 'Staff',
      dataIndex: 'Staff_ID',
      key: 'staff_id',
      width: 120,
      render: (staff_id) => (
        <span className="appointment-staff-cell">
          <TeamOutlined />
          S-{staff_id}
        </span>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'Date_and_Time',
      key: 'date_time',
      width: 200,
      render: (date) => (
        <div className="appointment-datetime-cell">
          <span className="appointment-date">
            <CalendarOutlined />
            {moment(date).format('YYYY-MM-DD')}
          </span>
          <span className="appointment-time">
            <ClockCircleOutlined />
            {moment(date).format('hh:mm:ss A')}
          </span>
        </div>
      ),
      sorter: (a, b) => moment(a.Date_and_Time).unix() - moment(b.Date_and_Time).unix(), 
    },
    {
      title: 'Contact',
      dataIndex: 'Contact',
      key: 'contact',
      width: 180,
      render: (contact) => (
        <span className="appointment-contact-cell">
          <PhoneOutlined />
          {contact}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 180,
      fixed: "right", 
      render: (_, record) => (
        <div className="appointment-table-action-buttons">
          <button 
            className="appointment-table-btn appointment-table-btn-edit"
            onClick={() => handleEdit(record.App_ID)}
          >
            <EditOutlined />
            Edit
          </button>
          <button 
            className="appointment-table-btn appointment-table-btn-delete"
            onClick={() => handleDelete(record.App_ID)}
          >
            <DeleteOutlined />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="appointment-table-container">
        <div className="appointment-table-card">
          {/* Header */}
          <div className="appointment-table-header">
            <div className="appointment-table-header-content">
              <div className="appointment-table-title-section">
                <div className="appointment-table-icon">📅</div>
                <div className="appointment-table-title-group">
                  <h1>Appointments</h1>
                  <p className="appointment-table-subtitle">
                    Manage member and staff appointments
                  </p>
                </div>
              </div>
              <div className="appointment-table-actions">
                <button 
                  className="appointment-action-button appointment-action-button-primary"
                  onClick={() => navigate("/Appoinment")}
                >
                  <PlusOutlined />
                  New Appointment
                </button>
                <button 
                  className="appointment-action-button appointment-action-button-secondary"
                  onClick={() => navigate("/Dashboard")}
                >
                  <ArrowLeftOutlined />
                  Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="appointment-table-body">
            {/* Controls */}
            <div className="appointment-table-controls">
              <div className="appointment-table-stats">
                <div className="appointment-stat-item">
                  <CheckCircleOutlined style={{ fontSize: '20px', color: '#667eea' }} />
                  <span className="appointment-stat-label">Total:</span>
                  <span className="appointment-stat-value">{data.length}</span>
                </div>
                <div className="appointment-stat-item">
                  <CalendarOutlined style={{ fontSize: '20px', color: '#667eea' }} />
                  <span className="appointment-stat-label">Showing:</span>
                  <span className="appointment-stat-value">{filteredData.length}</span>
                </div>
              </div>

              <div className="appointment-search-box">
                <input
                  type="text"
                  placeholder="Search by ID, Member, Staff, or Contact..."
                  className="appointment-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="appointment-custom-table">
              {loading ? (
                <div className="appointment-loading">
                  <div className="appointment-loading-spinner">⏳</div>
                  <p className="appointment-loading-text">Loading appointments...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="appointment-empty-state">
                  <div className="appointment-empty-icon">📭</div>
                  <h3 className="appointment-empty-title">No appointments found</h3>
                  <p className="appointment-empty-text">
                    {searchTerm ? 'Try adjusting your search terms' : 'Schedule your first appointment to get started'}
                  </p>
                  {!searchTerm && (
                    <button 
                      className="appointment-action-button appointment-action-button-primary"
                      onClick={() => navigate("/Appoinment")}
                      style={{ margin: '0 auto' }}
                    >
                      <PlusOutlined />
                      Schedule Appointment
                    </button>
                  )}
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="App_ID"
                  scroll={{
                    x: 1100, 
                    y: 500, 
                  }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
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

export default Appoinmenttable;