import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DatePicker, Input, message, Form, Card, Spin } from 'antd';
import { SaveOutlined, CloseOutlined, EditOutlined, CalendarOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import { Layout } from 'antd';
import AdminSidebar from './components/AdminSidebar';
import './EditAnnouncement.css';

const { Content } = Layout;

const { TextArea } = Input;

export const EditAnnouncement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [messageText, setMessage] = useState('');
  const [staff_id, setStaffId] = useState(null); 
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/v1/announcement/${id}`);
        const announcement = response.data.data;

        setStaffId(Number(announcement.Staff_ID)); 
        setMessage(announcement.Message);
        if (announcement.Date_Time) {
          const dateTime = moment(announcement.Date_Time);
          console.log('Loaded DateTime:', dateTime.format('YYYY-MM-DD HH:mm:ss'));
          setDate(dateTime);
        } else {
          // If no date/time exists, set default
          setDate(moment());
        }
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching announcement data: ${error.message}`);
        message.error('Failed to load announcement data');
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const validateForm = () => {
    if (!staff_id || isNaN(staff_id)) { 
      message.error("Staff ID is required and must be a valid number.");
      return false;
    }
    if (!messageText.trim()) { 
      message.error("Message cannot be empty.");
      return false;
    }
    if (!date) { 
      message.error("Please select a date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Format date to ISO string
    const formattedDate = date.toISOString();

    const body = {
      Staff_ID: staff_id,
      Message: messageText,
      Date_Time: formattedDate,
    };

    console.log("Sending update request with body:", body);

    try {
      setSubmitting(true);
      const res = await axios.put(`http://localhost:5000/api/v1/announcement/Update/${id}`, body);
      console.log("Response from server:", res.data);
      message.success("Announcement updated successfully!");
      setTimeout(() => navigate('/Announcementtable'), 1000);
    } catch (Err) {
      console.error("Error updating announcement:", Err.response?.data || Err.message);
      message.error("Failed to update Announcement: " + (Err.response?.data?.message || Err.message));
      setSubmitting(false);
    }
  };

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/Announcementtable" />
      <Layout style={{ marginLeft: 260 }}>
        <Content>
          <div className="edit-announcement-page">
        <div className="edit-announcement-content">
          <Card className="edit-announcement-card" bordered={false} loading={loading}>
            <div className="card-header">
              <div className="header-icon-card">
                <EditOutlined className="header-icon" />
              </div>
              <div className="header-text">
                <h2 className="card-title">Edit Announcement</h2>
                <p className="card-subtitle">Update announcement details and save changes</p>
              </div>
            </div>

            <Form onFinish={handleSubmit} layout="vertical" className="edit-announcement-form">
            {/* Staff ID Field */}
            <Form.Item
              label={
                <span className="form-label">
                  <UserOutlined className="label-icon" />
                  Staff ID
                </span>
              }
              required
            >
              <Input
                value={staff_id || ''} 
                onChange={(e) => setStaffId(Number(e.target.value))} 
                placeholder="Enter Staff ID"
                className="custom-input"
                size="large"
                type="number"
                prefix={<UserOutlined className="input-icon" />}
              />
            </Form.Item>

            {/* Message Field */}
            <Form.Item
              label={
                <span className="form-label">
                  <MessageOutlined className="label-icon" />
                  Announcement Message
                </span>
              }
              required
            >
              <TextArea
                value={messageText}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter announcement message"
                className="custom-textarea"
                rows={6}
                maxLength={500}
                showCount
              />
            </Form.Item>

            {/* Date Field */}
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
                className="custom-datepicker"
                size="large"
                format="YYYY-MM-DD"
                placeholder="Select date"
                style={{ width: '100%' }}
              />
            </Form.Item>

            {/* Action Buttons */}
            <div className="form-actions">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                className="submit-button"
                size="large"
                loading={submitting}
              >
                {submitting ? 'Updating...' : 'Update Announcement'}
              </Button>
              <Button
                onClick={() => navigate('/Announcementtable')}
                icon={<CloseOutlined />}
                className="cancel-button"
                size="large"
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card>
        </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};