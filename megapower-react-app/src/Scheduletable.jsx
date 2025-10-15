import React, { useEffect, useState } from "react";
import { Button, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";

export const Scheduletable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/schedule/list");
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
      setFilteredData(data.filter((item) => String(item.Member_ID).includes(value)));
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
      dataIndex: "Member_ID",
      key: "member_ID",
      width: 80,
    },
    {
      title: "Exercise Name",
      dataIndex: "EName",
      key: "ename",
      width: 120,
    },
    {
      title: "Equipment",
      dataIndex: "Equipment",
      key: "equipment",
      width: 100,
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "quantity",
      width: 80,
    },
    {
      title: "Date & Time",
      dataIndex: "Date_Time",
      key: "date_Time",
      width: 150,
      render: (date) => moment(date).format("YYYY.MM.DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.Schedule_ID)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.Schedule_ID)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleEdit = (schedule_ID) => {
    console.log(`Edit record with Schedule ID: ${schedule_ID}`);
    navigate(`/Schedule/${schedule_ID}`);
  };

  const handleDelete = async (schedule_ID) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/schedule/delete/${schedule_ID}`);
      console.log(`Deleted record with Schedule ID: ${schedule_ID}`);

      const response = await axios.get("http://localhost:5000/api/v1/schedule/list");
      setData(response?.data?.data);
      setFilteredData(response?.data?.data);
    } catch (error) {
      console.error(`Error deleting record: ${error.message}`);
    }
  };

  return (
    <div style={{ width: "95%", margin: "auto" }}>
      
      <Table
        title={() => (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
            <Button
              type="text"
              onClick={() => navigate("/Schedule")}
              style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "black" }}
            >
              <LeftOutlined style={{ color: "black" }} />
              <span style={{ marginLeft: "8px" }}>Back</span>
            </Button>

        
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Schedule Information</h2>

            
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
        scroll={{ x: 1200, y: 400 }}
        style={{ overflowX: "auto" }}
        bordered
      />
    </div>
  );
};

export default Scheduletable;