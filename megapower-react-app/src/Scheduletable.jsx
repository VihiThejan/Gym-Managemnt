import React, { useEffect, useState } from "react";
import { Button, Table, Input, Tag, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CalendarOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined
} from "@ant-design/icons";
import moment from "moment";
import MainLayout from './components/Layout/MainLayout';
import './Scheduletable.css';

export const Scheduletable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/schedule/list");
      setData(response?.data?.data || []);
      setFilteredData(response?.data?.data || []);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      message.error("Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const searchLower = value.toLowerCase();
      setFilteredData(
        data.filter(
          (item) =>
            String(item.Schedule_ID).toLowerCase().includes(searchLower) ||
            String(item.Staff_ID).toLowerCase().includes(searchLower) ||
            String(item.Member_ID).toLowerCase().includes(searchLower) ||
            String(item.EName).toLowerCase().includes(searchLower) ||
            String(item.Equipment).toLowerCase().includes(searchLower)
        )
      );
    } else {
      setFilteredData(data);
    }
  };

  const columns = [
    {
      title: "Schedule ID",
      dataIndex: "Schedule_ID",
      key: "schedule_ID",
      fixed: "left",
      width: 120,
      render: (id) => (
        <Tag color="purple" icon={<CalendarOutlined />}>
          {id}
        </Tag>
      ),
    },
    {
      title: "Staff ID",
      dataIndex: "Staff_ID",
      key: "staff_ID",
      width: 110,
      render: (id) => (
        <Tag color="geekblue" icon={<TeamOutlined />}>
          {id}
        </Tag>
      ),
    },
    {
      title: "Member ID",
      dataIndex: "Member_ID",
      key: "member_ID",
      width: 120,
      render: (id) => (
        <Tag color="blue" icon={<UserOutlined />}>
          {id}
        </Tag>
      ),
    },
    {
      title: "Exercise",
      dataIndex: "EName",
      key: "ename",
      width: 150,
      render: (exercise) => (
        <span className="exercise-name">
          <ThunderboltOutlined /> {exercise}
        </span>
      ),
    },
    {
      title: "Equipment",
      dataIndex: "Equipment",
      key: "equipment",
      width: 180,
      render: (equipment) => (
        <span className="equipment-name">
          <ToolOutlined /> {equipment}
        </span>
      ),
    },
    {
      title: "Sets/Reps",
      dataIndex: "Quantity",
      key: "quantity",
      width: 100,
      align: "center",
      render: (quantity) => (
        <Tag color="cyan" className="quantity-tag">
          {quantity}
        </Tag>
      ),
    },
    {
      title: "Schedule Date",
      dataIndex: "Date_Time",
      key: "date_Time",
      width: 150,
      render: (date) => (
        <span className="date-text">
          <CalendarOutlined /> {moment(date).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.Schedule_ID)}
            className="edit-btn"
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.Schedule_ID)}
            className="delete-btn"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (schedule_ID) => {
    console.log(`Edit record with Schedule ID: ${schedule_ID}`);
    navigate(`/Schedule/${schedule_ID}`);
  };

  const handleDelete = async (schedule_ID) => {
    Modal.confirm({
      title: 'Delete Schedule',
      content: `Are you sure you want to delete schedule ${schedule_ID}?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/v1/schedule/delete/${schedule_ID}`);
          message.success("Schedule deleted successfully!");
          fetchData();
        } catch (error) {
          console.error(`Error deleting record: ${error.message}`);
          message.error("Failed to delete schedule");
        }
      },
    });
  };

  return (
    <MainLayout showSidebar={true} showNavigation={false}>
      <div className="scheduletable-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-title">
              <CalendarOutlined className="title-icon" />
              <div>
                <h2>Training Schedules</h2>
                <p>Manage workout schedules and training sessions</p>
              </div>
            </div>
            <div className="header-actions">
              <Input
                placeholder="Search schedules..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
                className="search-input"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/Schedule")}
                className="add-button"
              >
                Add Schedule
              </Button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="Schedule_ID"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} schedules`,
              className: "custom-pagination",
            }}
            className="schedule-table"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Scheduletable;