import React, { useEffect, useState } from "react";
import { Button, Table, Input, Modal, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LeftOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserAddOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import MainLayout from "./components/Layout/MainLayout";
import "./MemberTable.css";

export const MemberTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/member/list");
      setData(response?.data?.data);
      setFilteredData(response?.data?.data);
    } catch (error) {
      message.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Member_Id).toLowerCase().includes(value.toLowerCase()) ||
        String(item.FName).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Email).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Contact).toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleEdit = (memberid) => {
    navigate(`/Member/${memberid}`);
  };

  const handleDelete = async (memberid, memberName) => {
    Modal.confirm({
      title: 'Delete Member',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${memberName}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          await axios.delete(`http://localhost:5000/api/v1/member/delete/${memberid}`);
          message.success('Member deleted successfully');
          fetchMembers();
        } catch (error) {
          message.error('Failed to delete member');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "memberid",
      fixed: "left",
      width: 120,
      render: (id) => <Tag color="blue" className="member-id-tag">{id}</Tag>,
    },
    {
      title: "Full Name",
      dataIndex: "FName",
      key: "fname",
      width: 200,
      render: (name) => (
        <div className="member-name">
          <UserOutlined className="name-icon" />
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "DOB",
      key: "dob",
      width: 130,
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "gender",
      width: 100,
      render: (gender) => (
        <Tag color={gender === "Male" ? "blue" : "pink"}>
          {gender}
        </Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "address",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Contact",
      dataIndex: "Contact",
      key: "contact",
      width: 150,
    },
    {
      title: "Package",
      dataIndex: "Package",
      key: "package",
      width: 130,
      render: (pkg) => {
        const colorMap = {
          "Basic": "default",
          "Standard": "blue",
          "Premium": "gold"
        };
        return <Tag color={colorMap[pkg] || "default"}>{pkg}</Tag>;
      },
    },
    {
      title: "Weight (kg)",
      dataIndex: "Weight",
      key: "weight",
      width: 100,
      align: "center",
    },
    {
      title: "Height (ft)",
      dataIndex: "Height",
      key: "height",
      width: 100,
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.Member_Id)}
            className="edit-button"
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.Member_Id, record.FName)}
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
      <div className="member-table-container">
        <div className="table-header">
          <div className="header-left">
            <UserOutlined className="header-icon" />
            <h1 className="table-title">Members Management</h1>
          </div>

          <div className="header-actions">
            <Input
              placeholder="Search by ID, name, email or contact..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined className="search-icon" />}
              allowClear
              className="search-input"
            />
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => navigate("/Member")}
              className="add-button"
            >
              Add New Member
            </Button>
          </div>
        </div>

        <div className="table-wrapper">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="Member_Id"
            scroll={{ x: 1800, y: 500 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} members`,
              className: "table-pagination"
            }}
            bordered
            className="member-table"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default MemberTable;