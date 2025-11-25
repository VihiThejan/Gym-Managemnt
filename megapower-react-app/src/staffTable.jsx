import React, { useState, useEffect } from "react";
import { Button, Table, Input, Tag, message, Modal } from "antd";
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
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from "@ant-design/icons";
import moment from "moment";
import MainLayout from './components/Layout/MainLayout';
import './staffTable.css';

const StaffTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

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
      message.error('Failed to fetch staff data');
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

  const handleEdit = (staffid) => {
    navigate(`/staff/${staffid}`);
  };

  const handleDelete = (staffid, staffName) => {
    Modal.confirm({
      title: 'Delete Staff Member',
      content: `Are you sure you want to delete ${staffName}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/v1/staffmember/delete/${staffid}`);
          message.success('Staff member deleted successfully');
          fetchData();
        } catch (error) {
          message.error('Failed to delete staff member');
        }
      }
    });
  };

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
      width: 180,
      render: (name) => (
        <span className="name-cell">
          <UserOutlined /> {name}
        </span>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "DOB",
      key: "dob",
      width: 150,
      render: (date) => (
        <span className="date-cell">
          <CalendarOutlined /> {moment(date).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "gender",
      width: 120,
      render: (gender) => (
        <Tag color={gender === 'Male' ? 'blue' : 'pink'} className="gender-tag">
          {gender === 'Male' ? <ManOutlined /> : <WomanOutlined />} {gender}
        </Tag>
      ),
    },
    {
      title: "Contact",
      dataIndex: "Contact_No",
      key: "contact",
      width: 160,
      render: (contact) => (
        <span className="contact-cell">
          <PhoneOutlined /> {contact}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      width: 220,
      render: (email) => (
        <span className="email-cell">
          <MailOutlined /> {email}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "address",
      width: 250,
      render: (address) => (
        <span className="address-cell">
          <EnvironmentOutlined /> {address}
        </span>
      ),
    },
    {
      title: "Job Role",
      dataIndex: "Job_Role",
      key: "job_role",
      width: 130,
      render: (role) => (
        <Tag color="geekblue" className="role-tag">
          <TeamOutlined /> {role}
        </Tag>
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
            onClick={() => handleEdit(record.Staff_ID)}
            className="edit-button"
          >
            Edit
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.Staff_ID, record.FName)}
            className="delete-button"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout showSidebar={true} showNavigation={false}>
      <div className="staff-table-container">
        <div className="table-header">
          <div className="header-left">
            <TeamOutlined className="header-icon" />
            <h1 className="table-title">Staff Management</h1>
          </div>

          <div className="header-actions">
            <Input
              placeholder="Search by ID, name, email, role or contact..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined className="search-icon" />}
              allowClear
              className="search-input"
            />
            <Button 
              type="primary" 
              icon={<UserOutlined />}
              onClick={() => navigate("/staff")}
              className="add-button"
            >
              Add New Staff
            </Button>
          </div>
        </div>

        <div className="table-wrapper">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="Staff_ID"
            loading={loading}
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} staff members`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            className="staff-table"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffTable;