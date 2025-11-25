import React, { useEffect, useState } from "react";
import { Button, Table, Input, Modal, message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { TableOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import MainLayout from './components/Layout/MainLayout';
import './Feedbacktable.css';




export const Feedbacktable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleEdit = (feedbackid) => {
    console.log(`Edit record with Feedback ID: ${feedbackid}`);
    navigate(`/EditFeedback/${feedbackid}`);
  };

  const handleDelete = async (feedbackid) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this feedback?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/v1/feedback/delete/${feedbackid}`);
          message.success('Feedback deleted successfully');
          fetchData();
        } catch (error) {
          console.error(`Error deleting record: ${error.message}`);
          message.error('Failed to delete feedback');
        }
      },
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/feedback/list");
      setData(response?.data?.data);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      message.error('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.Message?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.Member_Id?.toString().includes(searchText)
  );

  const columns = [
    {
      title: 'Feedback ID',
      dataIndex: 'Feedback_ID',
      key: 'feedbackid',
      width: 120,
      render: (id) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '6px' }}>
          #{id}
        </Tag>
      ),
    },
    {
      title: 'Member ID',
      dataIndex: 'Member_Id',
      key: 'memberId',
      width: 120,
      render: (id) => (
        <Tag color="purple" style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '6px' }}>
          {id}
        </Tag>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'Message',
      key: 'message',
      ellipsis: true,
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'date',
      width: 150,
      sorter: (a, b) => moment(a.Date).unix() - moment(b.Date).unix(),
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.Feedback_ID)}
            className="edit-button"
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.Feedback_ID)}
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
      <div className="feedbacktable-page">
        <div className="feedbacktable-header">
          <div className="header-content">
            <div className="header-icon">
              <TableOutlined />
            </div>
            <div className="header-text">
              <h1>Feedback Management</h1>
              <p>View and manage member feedback</p>
            </div>
          </div>
        </div>

        <div className="feedbacktable-content">
          <div className="table-controls">
            <Input
              placeholder="Search by message or member ID..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
              size="large"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/Feedback')}
              className="add-button"
              size="large"
            >
              Add Feedback
            </Button>
          </div>

          <div className="table-wrapper">
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              rowKey="Feedback_ID"
              scroll={{
                x: 1000,
                y: 500,
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) => `Total ${total} feedbacks`,
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};


