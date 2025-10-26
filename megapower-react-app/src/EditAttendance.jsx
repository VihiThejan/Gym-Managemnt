import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, DatePicker, TimePicker, message, Input, Card } from "antd";
import { SaveOutlined, CloseOutlined, EditOutlined, CalendarOutlined, UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import MainLayout from './components/Layout/MainLayout';
import './EditAttendance.css';

export const EditAttendance = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [memberid, setMemberId] = useState("");
  const [date, setDate] = useState(null);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/v1/attendance/${id}`);
        const attendance = response.data.data;

        setMemberId(Number(attendance.Member_Id));
        setDate(attendance.Current_date ? moment(attendance.Current_date) : null);
        setInTime(attendance.In_time ? moment(attendance.In_time, 'HH:mm:ss') : null);
        setOutTime(attendance.Out_time ? moment(attendance.Out_time, 'HH:mm:ss') : null);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching attendance data: ${error.message}`);
        message.error('Failed to load attendance data');
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!memberid || !date || !inTime || !outTime) {
      message.error("Please fill in all required fields.");
      return;
    }
    
    try {
      setSubmitting(true);

      const formattedDate = date ? date.format('YYYY-MM-DD') : null;
      const formattedInTime = inTime ? inTime.format('HH:mm:ss') : null;
      const formattedOutTime = outTime ? outTime.format('HH:mm:ss') : null;

      const body = {
        Member_Id: Number(memberid),
        Current_date: formattedDate,
        In_time: formattedInTime,
        Out_time: formattedOutTime,
      };

      await axios.put(`http://localhost:5000/api/v1/attendance/update/${id}`, body);
      message.success("Attendance updated successfully!");
      
      setTimeout(() => {
        navigate('/Attendancetable');
      }, 1500);
    } catch (Err) {
      console.error("Error updating attendance:", Err.response?.data || Err.message);
      message.error("Failed to update Attendance: " + (Err.response?.data?.message || Err.message));
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="edit-attendance-page">
          <div className="edit-attendance-container">
            <Card className="edit-attendance-card" loading={true}>
              <div style={{ padding: '40px' }}>Loading attendance data...</div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="edit-attendance-page">
        <div className="edit-attendance-header">
          <EditOutlined className="header-icon" />
          <div>
            <h1 className="header-title">Edit Attendance</h1>
            <p className="header-subtitle">Update member attendance check-in and check-out times</p>
          </div>
        </div>

        <div className="edit-attendance-container">
          <Card className="edit-attendance-card">
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

              <Form.Item
                label={
                  <span className="form-label">
                    <LoginOutlined className="label-icon" />
                    Check-In Time
                  </span>
                }
                required
              >
                <TimePicker
                  value={inTime}
                  onChange={(time) => setInTime(time)}
                  style={{ width: "100%" }}
                  size="large"
                  className="form-input"
                  format="HH:mm:ss"
                  required
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="form-label">
                    <LogoutOutlined className="label-icon" />
                    Check-Out Time
                  </span>
                }
                required
              >
                <TimePicker
                  value={outTime}
                  onChange={(time) => setOutTime(time)}
                  style={{ width: "100%" }}
                  size="large"
                  className="form-input"
                  format="HH:mm:ss"
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
                  {submitting ? 'Updating...' : 'Update Attendance'}
                </Button>
                <Button
                  type="default"
                  icon={<CloseOutlined />}
                  size="large"
                  className="cancel-button"
                  onClick={() => navigate('/Attendancetable')}
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