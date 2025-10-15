import React, { useEffect, useState } from "react";
import { Button, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";

export const Trainerratetable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/trainerrate/list");
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
      setFilteredData(data.filter((item) => String(item.Staff_ID).includes(value)));
    } else {
      setFilteredData(data);
    }
  };

  const columns = [
    {
      title: "Rating ID",
      dataIndex: "Rating_ID",
      key: "rating_ID",
      width: 80,
    },
    {
      title: "Staff ID",
      dataIndex: "Staff_ID",
      key: "staff_ID",
      width: 80,
    },
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "member_ID",
      width: 80,
    },
    {
      title: "Rating",
      dataIndex: "Rating",
      key: "rating",
      width: 80,
    },
    {
      title: "Comment",
      dataIndex: "Comment",
      key: "comment",
      width: 150,
    },
  ];

  return (
    <div style={{ width: "95%", margin: "auto" }}>
      
      <Table
        title={() => (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            
            <Button
              type="text"
              onClick={() => navigate("/Trainerrate")}
              style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "black" }}
            >
              <LeftOutlined style={{ color: "black" }} />
              <span style={{ marginLeft: "8px" }}>Back</span>
            </Button>

            
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Trainer Ratings Information</h2>

            
            <Input.Search
              placeholder="Search by Staff ID..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 250 }}
            />
          </div>
        )}
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: 1000, y: 400 }}
        style={{ overflowX: "auto" }}
        bordered
      />
    </div>
  );
};

export default Trainerratetable;
