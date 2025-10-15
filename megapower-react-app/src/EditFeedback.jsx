import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, DatePicker, Space, message as antdMessage } from 'antd';
import axios from "axios";
import moment from "moment";

export const EditFeedback = () => {
   const navigate = useNavigate();
   const { id } = useParams();
   const [memberid, setMemberId] = useState('');
   const [feedbackMessage, setFeedbackMessage] = useState('');
   const [date, setDate] = useState(null);

   useEffect(() => {
      const fetchFeedback = async () => {
         try {
            const response = await axios.get(`http://localhost:5000/api/v1/feedback/${id}`);
            const feedback = response.data.data;

            setMemberId(Number(feedback.Member_Id));
            setFeedbackMessage(feedback.Message);
            setDate(feedback.Date ? moment(feedback.Date) : null);
         } catch (error) {
            console.error(`Error fetching feedback data: ${error.message}`);
         }
      };
      fetchFeedback();
   }, [id]);


   const validateForm = () => {
      if (!id  || !feedbackMessage || !date) {
         antdMessage.error("Please fill in all required fields.");
         return false;
      }
      return true;
   };

   

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const formattedDate = date ? date.toISOString() : null;

      const body = {
         Member_Id: memberid,
         Message: feedbackMessage,
         Date: formattedDate,
      };

      console.log("Sending update request with body:", body);

      try {
         const res = await axios.put(`http://localhost:5000/api/v1/feedback/update/${id}`, body);
         console.log("Response from server:", res.data);
         antdMessage.success("Feedback updated successfully.");
         navigate('/Feedbacktable');
      } catch (Err) {
         console.error("Error updating feedback:", Err.response?.data || Err.message);
         antdMessage.error("Failed to update Feedback: " + (Err.response?.data?.message || Err.message));
      }
   };

   const handleReset = () => {
      setMemberId('');
      setFeedbackMessage('');
      setDate(null);
   };

   return (
      <div className="auth-form-container" style={{ padding: "55px", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "15px", boxShadow: "10px 10px 12px rgba(0, 0, 0, 0.3)", maxWidth: "500px", margin: "auto", height: "550px" }}>
         <div style={{ textAlign: 'left', width: '100%' }}>
            <h2 style={{ textAlign: "center", marginBottom: "50px", marginTop: "0px", borderRadius: "50px", maxWidth: "100%", color: "white" }}>
               Edit Feedback
            </h2>
            <form className="Equipment-form" onSubmit={handleSubmit}>
               <label htmlFor="Member Id" style={{ color: "white", fontWeight: "bold", marginBottom: "8px", display: "block" }}>Member ID </label>
               <input value={memberid} name="memberid" onChange={(e) => setMemberId(e.target.value)} id="Id" placeholder="Member Id" style={{ width: '100%', marginBottom: "15px", borderRadius: "5px" }} /><br/>

               <label htmlFor="Message" style={{ color: "white", fontWeight: "bold", marginBottom: "8px", display: "block" }}>Message </label>
               <input value={feedbackMessage} name="Message" onChange={(e) => setFeedbackMessage(e.target.value)} id="Message" placeholder="Message" style={{ width: '100%', marginBottom: "15px", borderRadius: "5px" }} /><br/>

               <label htmlFor="Date" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Date</label>
               <Space direction="vertical" style={{ width: '100%', marginBottom: "40px" }}>
                  <DatePicker value={date} onChange={(date) => setDate(date)} style={{ width: '100%' }} />
               </Space><br />

               <Form.Item style={{ textAlign: "left", marginTop: "0px" }}>
                  <Space size="large">
                     <Button type="primary" htmlType="submit"> Update </Button>
                     <Button onClick={handleReset} type="default" htmlType="button" style={{ backgroundColor: "white", color: "black", border: "1px solid #d9d9d9" }}> Cancel </Button>
                  </Space>
               </Form.Item>
            </form>
         </div>
      </div>
   );
};
