import { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";
import moment from 'moment';





export const Announcementtable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const handleEdit = (announcement_id) => {
    console.log(`Edit record with Announcement ID: ${announcement_id}`);
    navigate(`/Announcement/${announcement_id}`);
  };

  const handleDelete = async (announcement_id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/announcement/delete/${announcement_id}`);
      console.log(`Deleted record with Announcement ID: ${announcement_id}`);
      
      const response = await axios.get("http://localhost:5000/api/v1/announcement/list");
      setData(response?.data?.data || []);
    } catch (error) {
      console.error(`Error deleting record: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/announcement/list");
        setData(response?.data?.data || []);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Announcement ID',
      dataIndex: 'Announcement_ID',
      key: 'announcement_id',
      fixed: "left", 
      width: 50,
    },
    {
      title: 'Staff ID',
      dataIndex: 'Staff_ID',
      key: 'staff_id',
      width: 50,
     

    },
    {
      title: 'Message',
      dataIndex: 'Message',
      key: 'message',
      width: 90,
    },
    {
      title: 'Date_Time',
      dataIndex: 'Date_Time',
      key: 'date',
      width: 50,
      render: (date) => moment(date).format('YYYY.MM.DD'),
      sorter: (a, b) => moment(a.Date_Time).unix() - moment(b.Date_Time).unix(), 
      
    },
   
    {
      title: "Action",
      key: "action",
      width: 50,
      fixed: "right", 
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.Announcement_ID)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.Announcement_ID)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
      <Table
          title={() => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Button
                type="text"
                onClick={() => navigate("/Announcement")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                <LeftOutlined style={{ color: "black" }} />
                <span style={{ marginLeft: "8px" }}>Back</span>
              </Button>
    
              <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Announcement Information</h2>
            </div>
          )}
          columns={columns}
         
          dataSource={data}
          scroll={{
            x: 1500, 
            y: 500, 
          }}
          style={{
            width: "95%",
            overflowX: "auto",
          }}
        />
  );
};
