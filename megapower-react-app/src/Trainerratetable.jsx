import React, { useEffect, useState } from "react";
import { Button, Table, Input, Tag, Rate, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  StarOutlined,
  UserOutlined,
  TeamOutlined,
  CommentOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import MainLayout from './components/Layout/MainLayout';
import './Trainerratetable.css';

export const Trainerratetable = () => {
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
      const response = await axios.get("http://localhost:5000/api/v1/trainerrate/list");
      setData(response?.data?.data || []);
      setFilteredData(response?.data?.data || []);
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
    },
  ];

  return (
    <MainLayout>
      <div className="trainerrate-table-container">
        <div className="trainerrate-table-header">
          <div className="header-icon">
            <StarOutlined />
          </div>
          <h1 className="header-title">Trainer Ratings</h1>
          <p className="header-subtitle">View and manage all trainer ratings and feedback</p>
        </div>

        <div className="table-actions">
          <Input
            placeholder="Search by Rating ID, Staff ID, Member ID, Rating, or Comment..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            className="search-input"
          />
          <Button 
            type="primary" 
            icon={<StarOutlined />}
            onClick={() => navigate("/Trainerrate")}
            className="add-button"
          >
            Add New Rating
          </Button>
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
    </MainLayout>
  );
};

export default Trainerratetable;
