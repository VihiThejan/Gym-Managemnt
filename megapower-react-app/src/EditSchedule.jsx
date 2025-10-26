import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DatePicker, Select, Input, Form, message, Card } from 'antd';
import { SaveOutlined, CloseOutlined, EditOutlined, UserOutlined, TeamOutlined,
         CalendarOutlined, ThunderboltOutlined, ToolOutlined, NumberOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import MainLayout from './components/Layout/MainLayout';
import './EditSchedule.css';

export const EditSchedule = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [staffId, setStaffId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [exercise, setExercise] = useState('');
  const [equipment, setEquipment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const fetchSchedule = async () => {
       try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5000/api/v1/schedule/${id}`);
          const schedule = response.data.data;
          
          setStaffId(Number(schedule.Staff_ID));
          setMemberId(Number(schedule.Member_ID));
          setExercise(schedule.EName);
          setEquipment(schedule.Equipment);
          setQuantity(Number(schedule.Quantity));
          setDate(schedule.Date_Time ? moment(schedule.Date_Time) : null);
          setLoading(false);
       } catch (error) {
          console.error(`Error fetching schedule data: ${error.message}`);
          message.error('Failed to load schedule data');
          setLoading(false);
       }
    };
    fetchSchedule();
 }, [id]);



 const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!staffId || !memberId || !exercise || !equipment || !quantity || !date) {
       message.error('Please fill in all fields');
       return;
    }

    if (quantity < 1 || quantity > 100) {
       message.error('Quantity must be between 1 and 100');
       return;
    }

    try {
       setSubmitting(true);
       const updatedSchedule = {
          Staff_ID: staffId,
          Member_ID: memberId,
          EName: exercise,
          Equipment: equipment,
          Quantity: quantity,
          Date_Time: date.toISOString(),
       };

       const response = await axios.put(
          `http://localhost:5000/api/v1/schedule/update/${id}`,
          updatedSchedule
       );

       if (response.status === 200) {
          message.success('Schedule updated successfully!');
          setTimeout(() => {
             navigate('/scheduletable');
          }, 1500);
       }
    } catch (error) {
       console.error('Error updating schedule:', error);
       message.error('Failed to update schedule. Please try again.');
       setSubmitting(false);
    }
 };

  return (
    <MainLayout>
      <div className="edit-schedule-page">
        {/* Header Section */}
        <div className="edit-schedule-header">
          <div className="header-content">
            <EditOutlined className="header-icon" />
            <div className="header-text">
              <h1>Edit Training Schedule</h1>
              <p>Update training session details and assignment</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="edit-schedule-content">
          <Card className="edit-schedule-card" loading={loading}>
            <Form onSubmit={handleSubmit} className="edit-schedule-form">
              {/* Staff ID */}
              <Form.Item>
                <label className="form-label">
                  <UserOutlined className="label-icon" />
                  Staff ID
                </label>
                <Input
                  type="number"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="Enter staff ID"
                  className="form-input"
                />
              </Form.Item>

              {/* Member ID */}
              <Form.Item>
                <label className="form-label">
                  <TeamOutlined className="label-icon" />
                  Member ID
                </label>
                <Input
                  type="number"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="Enter member ID"
                  className="form-input"
                />
              </Form.Item>

              {/* Exercise */}
              <Form.Item>
                <label className="form-label">
                  <ThunderboltOutlined className="label-icon" />
                  Exercise
                </label>
                <Select
                  value={exercise}
                  onChange={(value) => setExercise(value)}
                  placeholder="Select exercise"
                  className="form-select"
                >
                  <Select.Option value="Bench Press">Bench Press</Select.Option>
                  <Select.Option value="Band Pull-Aparts">Band Pull-Aparts</Select.Option>
                  <Select.Option value="Cycling">Cycling</Select.Option>
                  <Select.Option value="Dumbbell Flyes">Dumbbell Flyes</Select.Option>
                  <Select.Option value="Leg Press">Leg Press</Select.Option>
                  <Select.Option value="Pull-Ups">Pull-Ups</Select.Option>
                  <Select.Option value="Rowing">Rowing</Select.Option>
                  <Select.Option value="Stair Climbing">Stair Climbing</Select.Option>
                  <Select.Option value="Shoulder Press">Shoulder Press</Select.Option>
                  <Select.Option value="Triceps Pushdowns">Triceps Pushdowns</Select.Option>
                </Select>
              </Form.Item>

              {/* Equipment */}
              <Form.Item>
                <label className="form-label">
                  <ToolOutlined className="label-icon" />
                  Equipment
                </label>
                <Select
                  value={equipment}
                  onChange={(value) => setEquipment(value)}
                  placeholder="Select equipment"
                  className="form-select"
                >
                  <Select.Option value="Barbell">Barbell</Select.Option>
                  <Select.Option value="Bench">Bench</Select.Option>
                  <Select.Option value="Cable Machine">Cable Machine</Select.Option>
                  <Select.Option value="Dumbbells">Dumbbells</Select.Option>
                  <Select.Option value="Exercise Bike">Exercise Bike</Select.Option>
                  <Select.Option value="Lat Pulldown Machine">Lat Pulldown Machine</Select.Option>
                  <Select.Option value="Leg Press Machine">Leg Press Machine</Select.Option>
                  <Select.Option value="Rowing Machine">Rowing Machine</Select.Option>
                  <Select.Option value="Stair Climber">Stair Climber</Select.Option>
                  <Select.Option value="Treadmill">Treadmill</Select.Option>
                </Select>
              </Form.Item>

              {/* Quantity */}
              <Form.Item>
                <label className="form-label">
                  <NumberOutlined className="label-icon" />
                  Quantity
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity (1-100)"
                  className="form-input"
                />
              </Form.Item>

              {/* Date */}
              <Form.Item>
                <label className="form-label">
                  <CalendarOutlined className="label-icon" />
                  Date & Time
                </label>
                <DatePicker
                  showTime
                  value={date}
                  onChange={(date) => setDate(date)}
                  placeholder="Select date and time"
                  className="form-datepicker"
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>

              {/* Action Buttons */}
              <Form.Item className="form-actions">
                <div className="button-group">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<SaveOutlined />}
                    className="submit-button"
                    onClick={handleSubmit}
                  >
                    {submitting ? 'Updating...' : 'Update Schedule'}
                  </Button>
                  <Button
                    type="default"
                    icon={<CloseOutlined />}
                    className="cancel-button"
                    onClick={() => navigate('/scheduletable')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
