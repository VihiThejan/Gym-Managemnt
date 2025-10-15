import { useEffect, useState } from 'react';
import { Button, Table, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import moment from 'moment';

export const Appoinmenttable = () => {
  const navigate = useNavigate(); 
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/appointment/list");
      setData(response?.data?.data || []);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
    }
  };

  
  const handleEdit = (appointmentId) => {
    navigate(`/Appoinment/${appointmentId}`);
  };

  
  const handleDelete = async (appointmentid) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/appointment/delete/${appointmentid}`);
      fetchData(); 
    } catch (error) {
      console.error(`Error deleting record: ${error.message}`);
    }
  };

  
  const filteredData = data.filter((item) =>
    item.Member_Id.toString().includes(searchTerm)
  );

  
  const columns = [
    {
      title: 'App_ID',
      dataIndex: 'App_ID',
      key: 'appointmentid',
      fixed: "left", 
      width: 80,
    },
    {
      title: 'Member_Id',
      dataIndex: 'Member_Id',
      key: 'member_id',
      width: 100,
    },
    {
      title: 'Staff_ID',
      dataIndex: 'Staff_ID',
      key: 'staff_id',
      width: 100,
    },
    {
      title: 'Date and Time',
      dataIndex: 'Date_and_Time',
      key: 'date_time',
      width: 200,
      render: (date) => moment(date).format('YYYY.MM.DD hh:mm:ss A'),
      sorter: (a, b) => moment(a.Date_and_Time).unix() - moment(b.Date_and_Time).unix(), 
    },
    {
      title: 'Contact',
      dataIndex: 'Contact',
      key: 'contact',
      width: 150,
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      fixed: "right", 
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.App_ID)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.App_ID)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", width: "95%", margin: "auto" }}>
      
      <Table
        title={() => (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            
            <Button
              type="text"
              onClick={() => navigate("/Appoinment")}
              style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "black" }}
            >
              <LeftOutlined style={{ color: "black" }} />
              <span style={{ marginLeft: "8px" }}>Back</span>
            </Button>

          
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Appointment Information</h2>

            
            <Input
              placeholder="Search by Member ID"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "250px" }}
            />
          </div>
        )}
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: 1500, y: 500 }}
        style={{ overflowX: "auto" }}
        rowKey="App_ID"
      />
    </div>
  );
};

export default Appoinmenttable;