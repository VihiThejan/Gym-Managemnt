import React, { useEffect, useState } from "react";
import { Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LeftOutlined } from "@ant-design/icons";
import moment from 'moment';




const columns = (handleEdit, handleDelete) => [
  {
    title: 'Feedback_ID',
    dataIndex: 'Feedback_ID',
    key: 'feedbackid',
    fixed: "left", 
    width: 40,
  },
  {
    title: 'Member_Id',
    dataIndex: 'Member_Id',
    key: 'memberId',
    width: 40,
  },

  {
    title: 'Message',
    dataIndex: 'Message',
    key: 'message',
    width: 70,

  },

  {
    title: 'Date',
    dataIndex: 'Date',
    key: 'date',
    width: 50,
    render: (date) => moment(date).format('YYYY.MM.DD'),
    
  },
 
  {
    title: 'Action',
    key: 'action',
    fixed: "right", 
    width: 50,
    render: (_, record) => (
      <>
        <Button type="link" onClick={() => handleEdit(record.Feedback_ID)}>
          Edit
        </Button>
        <Button type="link" danger onClick={() => handleDelete(record.Feedback_ID)}>
          Delete
        </Button>
      </>
    ),
  },
];


export const Feedbacktable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  
  const handleEdit = (feedbackid) => {
    console.log(`Edit record with Feedback ID: ${feedbackid}`);
    navigate(`/Feedback/${feedbackid}`);
  };


  
  const handleDelete = async (feedbackid) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/feedback/delete/${feedbackid}`);
      console.log(`Deleted record with Feedback ID: ${feedbackid}`);
      
      const response = await axios.get("http://localhost:5000/api/v1/feedback/list");
      setData(response?.data?.data);
    } catch (error) {
      console.error(`Error deleting record: ${error.message}`);
    }
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/feedback/list");
        setData(response?.data?.data);
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };
    fetchData();
  }, []);

  return (
     <Table
          title={() => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Button
                type="text"
                onClick={() => navigate("/Feedback")}
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
              <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>Feedback Information</h2>
            </div>
          )}
          columns={columns(handleEdit, handleDelete)} 
        
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


