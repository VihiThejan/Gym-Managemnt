import React, { useEffect, useState } from "react";
import { Button, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";

export const Paymenttable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/payment/list");
        setData(response?.data?.data || []);
        setFilteredData(response?.data?.data || []);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  
  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      setFilteredData(data.filter((item) => String(item.Member_Id).includes(value)));
    } else {
      setFilteredData(data);
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "Payment_ID",
      key: "paymentId",
      width: 100,
    },
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "member_id",
      width: 120,
    },
    {
      title: "Package ID",
      dataIndex: "Package_ID",
      key: "packageId",
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "amount",
      width: 120,
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "date",
      width: 150,
      render: (date) => moment(date).format("YYYY.MM.DD"),
    },
  ];

  return (
    <div style={{ width: "95%", margin: "auto" }}>
      
      <Table
        title={() => (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
            <Button
              type="text"
              onClick={() => navigate("/Payment")}
              style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "black" }}
            >
              <LeftOutlined style={{ color: "black" }} />
              <span style={{ marginLeft: "8px" }}>Back</span>
            </Button>

            {/* Title */}
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Payment Information</h2>

            
            <Input.Search
              placeholder="Search by Member ID..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 250 }}
            />
          </div>
        )}
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: 800, y: 400 }}
        style={{ overflowX: "auto" }}
        bordered
      />
    </div>
  );
};

export default Paymenttable;