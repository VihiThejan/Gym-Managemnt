import React, { useEffect, useState } from "react";
import { Button, Table, Input, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LeftOutlined, 
  SearchOutlined, 
  DollarOutlined,
  CreditCardOutlined 
} from "@ant-design/icons";
import moment from "moment";
import { Layout } from 'antd';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import './Paymenttable.css';

const { Content } = Layout;

export const Paymenttable = () => {
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
      const response = await axios.get("http://localhost:5000/api/v1/payment/list");
      setData(response?.data?.data || []);
      setFilteredData(response?.data?.data || []);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      message.error("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Payment_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Member_Id).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Package_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Amount).toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "Payment_ID",
      key: "paymentId",
      width: 120,
      fixed: "left",
      render: (id) => <Tag color="green" className="payment-id-tag">{id}</Tag>,
    },
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "member_id",
      width: 120,
      render: (id) => <Tag color="blue" className="member-id-tag">{id}</Tag>,
    },
    {
      title: "Package",
      dataIndex: "Package_ID",
      key: "packageId",
      width: 150,
      render: (pkg) => {
        const packageMap = {
          "1": { name: "Basic", color: "default" },
          "2": { name: "Standard", color: "blue" },
          "3": { name: "Premium", color: "gold" }
        };
        const packageInfo = packageMap[pkg] || { name: `Package ${pkg}`, color: "default" };
        return <Tag color={packageInfo.color}>{packageInfo.name}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "amount",
      width: 150,
      render: (amount) => (
        <span className="amount-display">
          <DollarOutlined className="amount-icon" />
          Rs. {parseFloat(amount).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Payment Date",
      dataIndex: "Date",
      key: "date",
      width: 150,
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
  ];

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/payment" />
      <Layout style={{ marginLeft: 260 }}>
        <Content className="dashboard-content">
      <div className="payment-table-container">
        <div className="table-header">
          <div className="header-left">
            <CreditCardOutlined className="header-icon" />
            <h1 className="table-title">Payment Management</h1>
          </div>
          <div className="header-actions">
            <Input
              placeholder="Search by Payment ID, Member ID, Package or Amount..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              className="search-input"
            />
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => navigate("/Payment")}
              className="add-button"
            >
              Add Payment
            </Button>
          </div>
        </div>

        <div className="table-content">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="Payment_ID"
            scroll={{ x: 800 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} payments`,
            }}
            className="payment-table"
          />
        </div>
      </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Paymenttable;