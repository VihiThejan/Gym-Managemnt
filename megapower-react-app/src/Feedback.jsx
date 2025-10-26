import React, { useState, useEffect } from "react";
import { Button, Form, DatePicker, message as antdMessage, Card, Input } from 'antd';
import { PlusOutlined, UserOutlined, MessageOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import MainLayout from './components/Layout/MainLayout';
import './Feedback.css';

export const Feedback = () => {

    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const [id, setId] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [date, setDate] = useState('');

   // Auto-fill Member ID from localStorage
   useEffect(() => {
    const loginData = localStorage.getItem('login');
    if (loginData) {
      try {
        const userData = JSON.parse(loginData);
        // Try to get Member_Id from various possible field names
        const memberId = userData.Member_Id || userData.member_id || userData.id || userData.userId;
        if (memberId) {
          setId(memberId);
        } else {
          console.log('Member ID not found in user data:', userData);
        }
      } catch (error) {
        console.error('Error parsing login data:', error);
      }
    }
   }, []);

   const validateForm = () => {
    if (!id || !feedbackMessage || !date) {
      antdMessage.error("Please fill in all required fields.");
      return false;
    }
    return true;
   }

   const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    const body = {
      memberId: id,
      message: feedbackMessage,
      date: date,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/feedback/create', body);
      console.log(res?.data?.data);
      antdMessage.success("Feedback created successfully.");
      
      setTimeout(() => {
        navigate('/Feedbacktable');
      }, 1500);
    } catch (Err) {
      console.log(Err.message);
      antdMessage.error("Failed to create feedback.");
    } finally {
      setSubmitting(false);
    }
  };

    const handleReset = () => {
        setId('');
        setFeedbackMessage('');
        setDate(null);
    };

    return (
        <MainLayout>
            <div className="feedback-page">
                <div className="feedback-header">
                    <div className="header-content">
                        <div className="header-icon">
                            <PlusOutlined />
                        </div>
                        <div className="header-text">
                            <h1>Add Feedback</h1>
                            <p>Submit new member feedback</p>
                        </div>
                    </div>
                </div>

                <div className="feedback-content">
                    <Card className="feedback-card">
                        <Form onFinish={handleSubmit} layout="vertical">
                            <Form.Item>
                                <label className="form-label">
                                    <UserOutlined className="label-icon" />
                                    Member ID
                                </label>
                                <Input
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    placeholder="Enter member ID"
                                    size="large"
                                    disabled
                                    className="member-id-input"
                                />
                            </Form.Item>

                            <Form.Item>
                                <label className="form-label">
                                    <MessageOutlined className="label-icon" />
                                    Message
                                </label>
                                <Input.TextArea
                                    value={feedbackMessage}
                                    onChange={(e) => setFeedbackMessage(e.target.value)}
                                    placeholder="Enter feedback message"
                                    rows={4}
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>

                            <Form.Item>
                                <label className="form-label">
                                    <CalendarOutlined className="label-icon" />
                                    Date
                                </label>
                                <DatePicker
                                    onChange={(date) => setDate(date)}
                                    style={{ width: '100%' }}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item className="form-actions">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={submitting}
                                    disabled={submitting}
                                    className="submit-button"
                                >
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    size="large"
                                    className="cancel-button"
                                >
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}
