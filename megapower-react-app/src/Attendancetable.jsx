import React, { useEffect, useState } from "react";
import { Button, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";

export const Attendancetable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/attendance/list");
        setData(response?.data?.data || []);
        setFilteredData(response?.data?.data || []);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (attendanceid) => {
    console.log(`Edit record with Attendance ID: ${attendanceid}`);
    navigate(`/Attendance/${attendanceid}`);
  };

  const handleDelete = async (attendanceid) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/attendance/delete/${attendanceid}`);
      console.log(`Deleted record with Attendance ID: ${attendanceid}`);

      const response = await axios.get("http://localhost:5000/api/v1/attendance/list");
      setData(response?.data?.data);
      setFilteredData(response?.data?.data);
    } catch (error) {
      console.error(`Error deleting record: ${error.message}`);
    }
  };

  
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
      title: "Attendance ID",
      dataIndex: "Attendance_ID",
      key: "attendanceid",
      fixed: "left",
      width: 80,
    },
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "memberId",
      width: 80,
      sorter: (a, b) => a.Member_Id - b.Member_Id,
    },
    {
      title: "Current Date",
      dataIndex: "Current_date",
      key: "current_date",
      width: 100,
      render: (date) => moment(date).format("YYYY.MM.DD"),
      sorter: (a, b) => moment(a.Current_date).unix() - moment(b.Current_date).unix(),
    },
    {
      title: "In Time",
      dataIndex: "In_time",
      key: "inTime",
      width: 100,
      render: (date) => moment(date).format("HH:mm:ss A"),
    },
    {
      title: "Out Time",
      dataIndex: "Out_time",
      key: "outTime",
      width: 100,
      render: (date) => moment(date).format("HH:mm:ss A"),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.Attendance_ID)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.Attendance_ID)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "95%", margin: "auto" }}>
      
      <Table
        title={() => (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            
            <Button
              type="text"
              onClick={() => navigate("/Attendance")}
              style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "black" }}
            >
              <LeftOutlined style={{ color: "black" }} />
              <span style={{ marginLeft: "8px" }}>Back</span>
            </Button>

          
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Attendance Information</h2>

            
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
        scroll={{ x: 1000, y: 500 }}
        style={{ overflowX: "auto" }}
        bordered
      />
    </div>
  );
};

export default Attendancetable;
