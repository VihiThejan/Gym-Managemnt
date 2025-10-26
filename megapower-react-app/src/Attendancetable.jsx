import React, { useEffect, useState } from "react";
import { Button, Table, Input, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import moment from "moment";
import MainLayout from "./components/Layout/MainLayout";
import "./Attendancetable.css";

export const Attendancetable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/attendance/list");
        setData(response?.data?.data || []);
        setFilteredData(response?.data?.data || []);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (attendanceid) => {
    console.log(`Edit record with Attendance ID: ${attendanceid}`);
    navigate(`/Attendance/${attendanceid}`);
  };

  const handleDelete = async (attendanceid) => {
    Modal.confirm({
      title: 'Delete Attendance Record',
      content: `Are you sure you want to delete attendance record #${attendanceid}? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/v1/attendance/delete/${attendanceid}`);
          message.success(`Attendance record #${attendanceid} deleted successfully`);

          const response = await axios.get("http://localhost:5000/api/v1/attendance/list");
          setData(response?.data?.data);
          setFilteredData(response?.data?.data);
        } catch (error) {
          console.error(`Error deleting record: ${error.message}`);
          message.error('Failed to delete attendance record');
        }
      },
    });
  };

  
  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const searchLower = value.toLowerCase();
      setFilteredData(data.filter((item) => 
        String(item.Attendance_ID).includes(value) ||
        String(item.Member_Id).includes(value) ||
        moment(item.Current_date).format("YYYY-MM-DD").includes(searchLower) ||
        moment(item.In_time).format("HH:mm:ss").includes(searchLower) ||
        moment(item.Out_time).format("HH:mm:ss").includes(searchLower)
      ));
    } else {
      setFilteredData(data);
    }
  };

  const columns = [
    {
      title: <span><ClockCircleOutlined /> Attendance ID</span>,
      dataIndex: "Attendance_ID",
      key: "attendanceid",
      width: 150,
      render: (id) => (
        <span className="attendance-id-cell">
          #{id}
        </span>
      ),
    },
    {
      title: <span><UserOutlined /> Member ID</span>,
      dataIndex: "Member_Id",
      key: "memberId",
      width: 130,
      sorter: (a, b) => a.Member_Id - b.Member_Id,
      render: (id) => (
        <span className="member-id-cell">
          Member #{id}
        </span>
      ),
    },
    {
      title: <span><CalendarOutlined /> Date</span>,
      dataIndex: "Current_date",
      key: "current_date",
      width: 150,
      render: (date) => (
        <div className="date-cell">
          <CalendarOutlined style={{ marginRight: '6px', color: '#667eea' }} />
          {moment(date).format("YYYY-MM-DD")}
        </div>
      ),
      sorter: (a, b) => moment(a.Current_date).unix() - moment(b.Current_date).unix(),
    },
    {
      title: <span><LoginOutlined /> Check-In Time</span>,
      dataIndex: "In_time",
      key: "inTime",
      width: 150,
      render: (time) => (
        <div className="time-cell in-time">
          <LoginOutlined style={{ marginRight: '6px' }} />
          {moment(time, "HH:mm:ss").format("hh:mm:ss A")}
        </div>
      ),
    },
    {
      title: <span><LogoutOutlined /> Check-Out Time</span>,
      dataIndex: "Out_time",
      key: "outTime",
      width: 150,
      render: (time) => (
        <div className="time-cell out-time">
          <LogoutOutlined style={{ marginRight: '6px' }} />
          {moment(time, "HH:mm:ss").format("hh:mm:ss A")}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.Attendance_ID)}
            className="edit-button"
            size="small"
          >
            Edit
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.Attendance_ID)}
            className="delete-button"
            size="small"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="attendancetable-page">
        <div className="attendancetable-container">
          {/* Header Section */}
          <div className="attendancetable-header">
            <h1 className="attendancetable-title">
              <ClockCircleOutlined /> Attendance Records
            </h1>
            <p className="attendancetable-subtitle">
              Track member check-ins and check-outs
            </p>
          </div>

          {/* Statistics Dashboard */}
          <div className="stats-dashboard">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <ClockCircleOutlined />
              </div>
              <div className="stat-content">
                <div className="stat-value">{data.length}</div>
                <div className="stat-label">Total Records</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <UserOutlined />
              </div>
              <div className="stat-content">
                <div className="stat-value">{filteredData.length}</div>
                <div className="stat-label">Filtered Results</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <CalendarOutlined />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {data.filter(item => moment(item.Current_date).isSame(moment(), 'day')).length}
                </div>
                <div className="stat-label">Today's Records</div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="table-card">
            {/* Search and Actions Bar */}
            <div className="table-header">
              <div className="search-section">
                <Input
                  placeholder="Search by ID, Member, Date, or Time..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                  className="search-input"
                  size="large"
                />
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/Attendance")}
                className="add-button"
                size="large"
              >
                Mark Attendance
              </Button>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="Attendance_ID"
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              scroll={{ x: 1000 }}
              className="attendance-table"
              locale={{
                emptyText: (
                  <div className="empty-state">
                    <ClockCircleOutlined style={{ fontSize: '48px', color: '#d1d5db' }} />
                    <h3>No Attendance Records Found</h3>
                    <p>Start marking attendance to see records here</p>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => navigate("/Attendance")}
                      style={{ marginTop: '16px' }}
                    >
                      Mark Attendance
                    </Button>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Attendancetable;
