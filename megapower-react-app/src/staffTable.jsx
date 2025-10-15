import React, { useState, useEffect } from "react";
import { Button, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";

const StaffTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/staffmember/list").then((res) => {
      setData(res?.data?.data);
      setFilteredData(res?.data?.data);
    });
  }, []);

  
  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      setFilteredData(data.filter((item) => String(item.Staff_ID).includes(value)));
    } else {
      setFilteredData(data);
    }
  };

  const handleEdit = (staffid) => {
    navigate(`/staff/${staffid}`);
  };

  const handleDelete = async (staffid) => {
    await axios.delete(`http://localhost:5000/api/v1/staffmember/delete/${staffid}`);
    axios.get("http://localhost:5000/api/v1/staffmember/list").then((res) => {
      setData(res?.data?.data);
      setFilteredData(res?.data?.data);
    });
  };

  const columns = [
    {
      title: "Staff ID",
      dataIndex: "Staff_ID",
      key: "staffid",
      fixed: "left",
      width: 100,
    },
    {
      title: "First Name",
      dataIndex: "FName",
      key: "fname",
      width: 180,
    },
    {
      title: "DOB",
      dataIndex: "DOB",
      key: "dob",
      width: 150,
      render: (date) => moment(date).format("YYYY.MM.DD"),
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "address",
      width: 250,
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "gender",
      width: 100,
    },
    {
      title: "Contact Number",
      dataIndex: "Contact_No",
      key: "contact",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      width: 200,
    },
    {
      title: "Job Role",
      dataIndex: "Job_Role",
      key: "job_role",
      width: 150,
    },
    {
      title: "Username",
      dataIndex: "UName",
      key: "uname",
      width: 150,
    },
    {
      title: "Password",
      dataIndex: "Password",
      key: "password",
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.Staff_ID)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.Staff_ID)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      
      <Table
        title={() => (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            
            <Button
              type="text"
              onClick={() => navigate("/staff")}
              style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "black" }}
            >
              <LeftOutlined style={{ color: "black" }} />
              <span style={{ marginLeft: "8px" }}>Back</span>
            </Button>

            
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Staff Information</h2>

            
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
        scroll={{ x: 1400, y: 400 }}
        style={{ overflowX: "auto" }}
        bordered
      />
    </div>
  );
};

export default StaffTable;