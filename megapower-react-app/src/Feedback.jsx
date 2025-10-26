import React, { useState } from "react";
import { Button, Form, DatePicker, Space, message as antdMessage } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const Feedback = () => {

    const navigate = useNavigate();

    const handleGoBack = () => {
      navigate('/Feedbacktable');
    };
   
   const [id, setId] = useState('');

   const [feedbackMessage, setFeedbackMessage] = useState('');
   const [date, setDate] = useState('');

   const validateForm = () => {
    if (!id || !feedbackMessage || !date) {
      antdMessage.error("Please fill in all required fields.");
      return false;
    }
    return true;
   }

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = {
      memberId: id,
      message: feedbackMessage,
      date: date,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/feedback/create', body);
      console.log(res?.data?.data);
      antdMessage.success("Feedback created successfully.");
      navigate('/Feedbacktable');
    } catch (Err) {
      console.log(Err.message);
      antdMessage.error("Failed to create feedback.");
    }
  };

    const handleReset = () => {
        setId('');
        setFeedbackMessage('');
        setDate(null);
    };

    return (
        <div className="auth-form-container" style={{ padding: "55px", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "15px", boxShadow: "10px 10px 12px rgba(0, 0, 0, 0.3)", maxWidth: "500px", margin: "auto", height: "400px" }}>
            <div style={{ textAlign: 'left', width: '100%' }}>
                <div style={{ marginBottom: '20px' }}>
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={handleGoBack} 
                    style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    Back
                  </Button>
                </div>
                <h2 style={{ textAlign: "center", marginBottom: "50px", marginTop: "0px", borderRadius: "50px", maxWidth: "100%", color: "white" }}>
                    Feedback
                </h2>
                <form className="Equipment-form" onSubmit={handleSubmit}>

                    <label htmlFor="Member Id" style={{ color: "white", fontWeight: "bold", marginBottom: "8px", display: "block" }}>Member ID </label>
                    <input value={id} name="Id" onChange={(e) => setId(e.target.value)} id="Id" placeholder="Member Id" style={{ width: '100%', marginBottom: "15px", borderRadius: "5px" }} /><br/>

                  

                    <label htmlFor="Message" style={{ color: "white", fontWeight: "bold", marginBottom: "8px", display: "block" }}>Message </label>
                    <input value={feedbackMessage} name="Message" onChange={(e) => setFeedbackMessage(e.target.value)} id="Message" placeholder="Message" style={{ width: '100%', marginBottom: "15px", borderRadius: "5px" }} /><br/>

                   <label htmlFor="Date" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Date</label>
                             <Space direction="vertical" style={{ width: '100%', marginBottom: "40px" }}>
                               <DatePicker onChange={(date) => setDate(date)} style={{ width: '100%' }} />
                             </Space><br />
                   
                    <Form.Item style={{ textAlign: "left", marginTop: "0px" }}>
                        <Space size="large">
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button
                                onClick={handleReset}
                                type="default"
                                htmlType="button"
                                style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    border: "1px solid #d9d9d9",
                                }}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </form>
            </div>
        </div>
    )
}
