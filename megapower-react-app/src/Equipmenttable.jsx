import React, { useEffect, useState } from "react";
import { Button, Table, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";

const Equipmenttable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/equipment/list");
        setData(response?.data?.data);
        setFilteredData(response?.data?.data);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
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
    try {
      await axios.delete(`http://localhost:5000/api/v1/equipment/delete/${equipmentid}`);
      console.log(`Deleted record with Equipment ID: ${equipmentid}`);

      const response = await axios.get("http://localhost:5000/api/v1/equipment/list");
      setData(response?.data?.data);
      setFilteredData(response?.data?.data);
    } catch (error) {
      console.error(`Error deleting record: ${error.message}`);
    }
  };

  const columns = [
    {
      title: "Equipment ID",
      dataIndex: "Equipment_Id",
      key: "equipmentid",
      fixed: "left",
      width: 80,
    },
    {
      title: "EName",
      dataIndex: "EName",
      key: "ename",
      width: 120,
    },
    {
      title: "Qty",
      dataIndex: "Qty",
      key: "qty",
      width: 80,
    },
    {
      title: "Vendor",
      dataIndex: "Vendor",
      key: "vendor",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "description",
      width: 200,
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "date",
      width: 120,
      render: (date) => moment(date).format("YYYY.MM.DD"),
      sorter: (a, b) => moment(a.Date).unix() - moment(b.Date).unix(),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.Equipment_Id)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.Equipment_Id)}>Delete</Button>
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
              onClick={() => navigate("/Equipment")}
              style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "black" }}
            >
              <LeftOutlined style={{ color: "black" }} />
              <span style={{ marginLeft: "8px" }}>Back</span>
            </Button>

            
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Equipment Information</h2>

            
            <Input.Search
              placeholder="Search by EName..."
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
      />
    </div>
  );
};

export default Equipmenttable;