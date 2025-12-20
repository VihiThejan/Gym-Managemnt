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
import { Layout } from 'antd';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import "./Attendancetable.css";

const { Content } = Layout;

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
        (item.Current_date && moment(item.Current_date).format("YYYY-MM-DD").includes(searchLower)) ||
        (item.In_time && moment(item.In_time).format("hh:mm A").toLowerCase().includes(searchLower)) ||
        (item.Out_time && moment(item.Out_time).format("hh:mm A").toLowerCase().includes(searchLower))
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
      render: (date) => {
        const formattedDate = date ? moment(date).format("YYYY-MM-DD") : 'N/A';
        return (
          <div className="date-cell">
            <CalendarOutlined style={{ marginRight: '6px', color: '#667eea' }} />
            {formattedDate}
          </div>
        );
      },
      sorter: (a, b) => moment(a.Current_date).unix() - moment(b.Current_date).unix(),
    },
    {
      title: <span><LoginOutlined /> Check-In Time</span>,
      dataIndex: "In_time",
      key: "inTime",
      width: 150,
      render: (time) => {
        const formattedTime = time ? moment(time).format("hh:mm A") : 'N/A';
        return (
          <div className="time-cell in-time">
            <LoginOutlined style={{ marginRight: '6px' }} />
            {formattedTime}
          </div>
        );
      },
    },
    {
      title: <span><LogoutOutlined /> Check-Out Time</span>,
      dataIndex: "Out_time",
      key: "outTime",
      width: 150,
      render: (time) => {
        if (!time) {
          return (
            <div className="time-cell out-time" style={{ color: '#999' }}>
              <LogoutOutlined style={{ marginRight: '6px' }} />
              Not checked out
            </div>
          );
        }
        const formattedTime = moment(time).format("hh:mm A");
        return (
          <div className="time-cell out-time">
            <LogoutOutlined style={{ marginRight: '6px' }} />
            {formattedTime}
          </div>
        );
      },
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
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/Attendancetable" />
      <Layout style={{ marginLeft: 260 }}>
        <Content className="dashboard-content">
      <div className="attendancetable-container">
        {/* Header Section */}
        <div className="table-header">
          <div className="header-left">
            <ClockCircleOutlined className="header-icon" />
            <h1 className="table-title">Attendance Management</h1>
          </div>
          <div className="header-actions">
            <Input
              placeholder="Search by ID, Member, Date, or Time..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="search-input"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/Attendance")}
              className="add-button"
            >
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-content">
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
            scroll={{ x: 1200 }}
            className="attendance-table"
          />
        </div>
      </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Attendancetable;
