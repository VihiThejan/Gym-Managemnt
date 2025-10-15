import React, { useEffect, useState } from "react";
import { Button, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";

export const MemberTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 

  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/member/list").then((response) => {
      setData(response?.data?.data);
      setFilteredData(response?.data?.data);
    });
  }, []);

  
  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      setFilteredData(data.filter((item) => String(item.Member_Id).includes(value)));
    } else {
      setFilteredData(data);
    }
  };

  const handleEdit = (memberid) => {
    navigate(`/Member/${memberid}`);
  };

  const handleDelete = async (memberid) => {
    await axios.delete(`http://localhost:5000/api/v1/member/delete/${memberid}`);
    axios.get("http://localhost:5000/api/v1/member/list").then((response) => {
      setData(response?.data?.data);
      setFilteredData(response?.data?.data);
    });
  };

  const columns = [
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "memberid",
      fixed: "left",
      width: 150,
    },
    {
      title: "First Name",
      dataIndex: "FName",
      key: "fname",
      width: 250,
    },
    {
      title: "DOB",
      dataIndex: "DOB",
      key: "dob",
      width: 150,
      render: (date) => moment(date).format("YYYY.MM.DD"),
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "gender",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      width: 200,
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "address",
      width: 250,
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
      width: 100,
    },
    {
      title: "Weight",
      dataIndex: "Weight",
      key: "weight",
      width: 100,
    },
    {
      title: "Height",
      dataIndex: "Height",
      key: "height",
      width: 100,
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
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.Member_Id)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.Member_Id)}>
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
              onClick={() => navigate("/Member")}
              style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "black" }}
            >
              <LeftOutlined style={{ color: "black" }} />
              <span style={{ marginLeft: "8px" }}>Back</span>
            </Button>

            
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Members Information</h2>

            
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
        scroll={{ x: 1500, y: 400 }}
        style={{ overflowX: "auto" }}
        bordered
      />
    </div>
  );
};

export default MemberTable;