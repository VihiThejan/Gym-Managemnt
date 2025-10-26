import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, DatePicker, message, Input, Card } from 'antd';
import { SaveOutlined, CloseOutlined, EditOutlined, CalendarOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import MainLayout from './components/Layout/MainLayout';
import './EditFeedback.css';

const { TextArea } = Input;

export const EditFeedback = () => {
   const navigate = useNavigate();
   const { id } = useParams();
   const [memberid, setMemberId] = useState('');
   const [feedbackMessage, setFeedbackMessage] = useState('');
   const [date, setDate] = useState(null);
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);

   useEffect(() => {
      const fetchFeedback = async () => {
         try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/v1/feedback/${id}`);
            const feedback = response.data.data;

            setMemberId(Number(feedback.Member_Id));
            setFeedbackMessage(feedback.Message);
            setDate(feedback.Date ? moment(feedback.Date) : null);
            setLoading(false);
         } catch (error) {
            console.error(`Error fetching feedback data: ${error.message}`);
            message.error('Failed to load feedback data');
            setLoading(false);
         }
      };
      fetchFeedback();
   }, [id]);


   const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!id || !feedbackMessage || !date) {
         message.error("Please fill in all required fields.");
         return;
      }
      
      try {
         setSubmitting(true);

         const formattedDate = date ? date.toISOString() : null;

         const body = {
            Member_Id: memberid,
            Message: feedbackMessage,
            Date: formattedDate,
         };

         await axios.put(`http://localhost:5000/api/v1/feedback/update/${id}`, body);
         message.success("Feedback updated successfully!");
         
         setTimeout(() => {
            navigate('/Feedbacktable');
         }, 1500);
      } catch (Err) {
         console.error("Error updating feedback:", Err.response?.data || Err.message);
         message.error("Failed to update Feedback: " + (Err.response?.data?.message || Err.message));
         setSubmitting(false);
      }
   };

   if (loading) {
      return (
         <MainLayout>
            <div className="edit-feedback-page">
               <div className="edit-feedback-container">
                  <Card className="edit-feedback-card" loading={true}>
                     <div style={{ padding: '40px' }}>Loading feedback data...</div>
                  </Card>
               </div>
            </div>
         </MainLayout>
      );
   }

   return (
      <MainLayout>
         <div className="edit-feedback-page">
            <div className="edit-feedback-header">
               <EditOutlined className="header-icon" />
               <div>
                  <h1 className="header-title">Edit Feedback</h1>
                  <p className="header-subtitle">Update member feedback and comments</p>
               </div>
            </div>

            <div className="edit-feedback-container">
               <Card className="edit-feedback-card">
                  <Form layout="vertical" onFinish={handleSubmit}>
                     <Form.Item
                        label={
                           <span className="form-label">
                              <UserOutlined className="label-icon" />
                              Member ID
                           </span>
                        }
                        required
                     >
                        <Input
                           type="number"
                           value={memberid}
                           onChange={(e) => setMemberId(e.target.value)}
                           placeholder="Enter member ID"
                           size="large"
                           className="form-input"
                           required
                        />
                     </Form.Item>

                     <Form.Item
                        label={
                           <span className="form-label">
                              <MessageOutlined className="label-icon" />
                              Feedback Message
                           </span>
                        }
                        required
                     >
                        <TextArea
                           value={feedbackMessage}
                           onChange={(e) => setFeedbackMessage(e.target.value)}
                           placeholder="Enter feedback message"
                           rows={5}
                           maxLength={500}
                           showCount
                           className="form-textarea"
                           required
                        />
                     </Form.Item>

                     <Form.Item
                        label={
                           <span className="form-label">
                              <CalendarOutlined className="label-icon" />
                              Date
                           </span>
                        }
                        required
                     >
                        <DatePicker
                           value={date}
                           onChange={(date) => setDate(date)}
                           style={{ width: "100%" }}
                           size="large"
                           className="form-input"
                           format="YYYY-MM-DD"
                           required
                        />
                     </Form.Item>

                     <div className="form-actions">
                        <Button
                           type="primary"
                           htmlType="submit"
                           icon={<SaveOutlined />}
                           size="large"
                           className="submit-button"
                           loading={submitting}
                        >
                           {submitting ? 'Updating...' : 'Update Feedback'}
                        </Button>
                        <Button
                           type="default"
                           icon={<CloseOutlined />}
                           size="large"
                           className="cancel-button"
                           onClick={() => navigate('/Feedbacktable')}
                           disabled={submitting}
                        >
                           Cancel
                        </Button>
                     </div>
                  </Form>
               </Card>
            </div>
         </div>
      </MainLayout>
   );
};
