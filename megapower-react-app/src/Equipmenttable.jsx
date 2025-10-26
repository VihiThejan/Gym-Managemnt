import React, { useEffect, useState } from "react";
import { Button, Table, Input, message, Modal, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, 
         TableOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import MainLayout from './components/Layout/MainLayout';
import './Equipmenttable.css';

const { confirm } = Modal;

const Equipmenttable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/v1/equipment/list");
        setData(response?.data?.data);
        setFilteredData(response?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        message.error('Failed to load equipment data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      setFilteredData(data.filter((item) => item.EName.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredData(data);
    }
  };

  const handleEdit = (equipmentid) => {
    navigate(`/Equipment/${equipmentid}`);
  };

  const handleDelete = async (equipmentid) => {
    confirm({
      title: 'Are you sure you want to delete this equipment?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/v1/equipment/delete/${equipmentid}`);
          message.success('Equipment deleted successfully!');

          const response = await axios.get("http://localhost:5000/api/v1/equipment/list");
          setData(response?.data?.data);
          setFilteredData(response?.data?.data);
        } catch (error) {
          console.error(`Error deleting record: ${error.message}`);
          message.error('Failed to delete equipment');
        }
      },
    });
  };

  const columns = [
    {
      title: "Equipment ID",
      dataIndex: "Equipment_Id",
      key: "equipmentid",
      fixed: "left",
      width: 120,
      render: (id) => <Tag color="blue">#{id}</Tag>,
    },
    {
      title: "Equipment Name",
      dataIndex: "EName",
      key: "ename",
      width: 150,
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: "Quantity",
      dataIndex: "Qty",
      key: "qty",
      width: 100,
      render: (qty) => <Tag color={qty < 10 ? 'red' : 'green'}>{qty}</Tag>,
    },
    {
      title: "Vendor",
      dataIndex: "Vendor",
      key: "vendor",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "description",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Purchase Date",
      dataIndex: "Date",
      key: "date",
      width: 130,
      render: (date) => moment(date).format("MMM DD, YYYY"),
      sorter: (a, b) => moment(a.Date).unix() - moment(b.Date).unix(),
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            type="primary" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.Equipment_Id)}
            className="edit-btn"
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            danger 
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.Equipment_Id)}
            className="delete-btn"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="equipment-table-page">
        {/* Header Section */}
        <div className="table-header">
          <div className="header-content">
            <TableOutlined className="header-icon" />
            <div className="header-text">
              <h1>Equipment Management</h1>
              <p>View and manage gym equipment inventory</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-content">
          <div className="table-controls">
            <Input
              placeholder="Search by equipment name..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="search-input"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/Equipment")}
              className="add-button"
            >
              Add Equipment
            </Button>
          </div>

          <div className="table-wrapper">
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="Equipment_Id"
              loading={loading}
              scroll={{ x: 1200, y: 500 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              className="equipment-table"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Equipmenttable;