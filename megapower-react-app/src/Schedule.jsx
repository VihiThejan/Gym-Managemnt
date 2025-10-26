import React, { useState, useEffect } from "react";
import { Button, DatePicker, Select, InputNumber, Input, Form, message, Card } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  TeamOutlined, 
  ThunderboltOutlined,
  ToolOutlined,
  NumberOutlined 
} from '@ant-design/icons';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from './components/Layout/MainLayout';
import './Schedule.css';

const { Option } = Select;

export const Schedule = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
    fetchStaff();
  }, []);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/member/list");
      const memberData = response?.data?.data || [];
      console.log("Members data:", memberData); // Debug log
      setMembers(memberData);
    } catch (error) {
      console.error("Error fetching members:", error);
      message.error("Failed to load members list");
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchStaff = async () => {
    setLoadingStaff(true);
    try {
      const response = await axios.get("http://localhost:5000/api/v1/staffmember/list");
      const staffData = response?.data?.data || [];
      console.log("Staff data:", staffData); // Debug log
      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching staff:", error);
      message.error("Failed to load staff list");
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const formattedDate = values.date ? values.date.toISOString() : null;

    const body = {
      staffId: values.staffId,
      memberId: values.memberId,
      eName: values.exercise,
      equipment: values.equipment,
      quantity: values.quantity,
      date: formattedDate, 
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/schedule/create",
        body
      );
      console.log(res?.data?.data);
      message.success("Schedule created successfully!");
      setTimeout(() => {
        navigate("/Scheduletable");
      }, 1000);
    } catch (error) {
      console.log(error.message);
      message.error("Failed to create schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
  };

  return (
    <MainLayout>
      <div className="schedule-page">
        <div className="schedule-container">
          <Card className="schedule-card">
            <div className="card-header">
              <div className="header-icon">
                <CalendarOutlined />
              </div>
              <h2>Create Training Schedule</h2>
              <p>Plan workout sessions for members</p>
            </div>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="schedule-form"
              requiredMark={false}
            >
              <div className="form-row">
                <Form.Item
                  name="staffId"
                  label={
                    <span className="form-label">
                      <TeamOutlined className="label-icon" />
                      Select Staff
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select a staff member' }]}
                >
                  <Select
                    placeholder="Select staff member"
                    size="large"
                    showSearch
                    loading={loadingStaff}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={staff.map(s => ({
                      value: s.Staff_ID || s.Staff_Id || s.staff_id || s.id,
                      label: `${s.Staff_ID || s.Staff_Id || s.staff_id || s.id} - ${s.FName || s.Name || s.name || s.StaffName || 'N/A'}`,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="memberId"
                  label={
                    <span className="form-label">
                      <UserOutlined className="label-icon" />
                      Select Member
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select a member' }]}
                >
                  <Select
                    placeholder="Select member"
                    size="large"
                    showSearch
                    loading={loadingMembers}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={members.map(m => ({
                      value: m.Member_ID || m.Member_Id || m.member_id || m.id,
                      label: `${m.Member_ID || m.Member_Id || m.member_id || m.id} - ${m.FName || m.Name || m.name || m.MemberName || 'N/A'}`,
                    }))}
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  name="exercise"
                  label={
                    <span className="form-label">
                      <ThunderboltOutlined className="label-icon" />
                      Exercise
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select an exercise' }]}
                >
                  <Select
                    placeholder="Select exercise type"
                    size="large"
                    showSearch
                    optionFilterProp="children"
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

                <Form.Item
                  name="equipment"
                  label={
                    <span className="form-label">
                      <ToolOutlined className="label-icon" />
                      Equipment
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select equipment' }]}
                >
                  <Select
                    placeholder="Select equipment"
                    size="large"
                    showSearch
                    optionFilterProp="children"
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
              </div>

              <div className="form-row">
                <Form.Item
                  name="quantity"
                  label={
                    <span className="form-label">
                      <NumberOutlined className="label-icon" />
                      Sets/Reps
                    </span>
                  }
                  rules={[{ required: true, message: 'Please enter quantity' }]}
                  initialValue={1}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    placeholder="Enter quantity"
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item
                  name="date"
                  label={
                    <span className="form-label">
                      <CalendarOutlined className="label-icon" />
                      Schedule Date
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select a date' }]}
                >
                  <DatePicker
                    placeholder="Select schedule date"
                    size="large"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </div>

              <Form.Item className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="submit-button"
                  icon={<CalendarOutlined />}
                >
                  {loading ? 'Creating Schedule...' : 'Create Schedule'}
                </Button>
                <Button
                  onClick={handleClear}
                  className="cancel-button"
                >
                  Clear Form
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card className="info-card">
            <h3>
              <ThunderboltOutlined /> Training Schedule Information
            </h3>
            <div className="info-content">
              <div className="info-item">
                <TeamOutlined className="info-icon" />
                <div>
                  <h4>Staff Assignment</h4>
                  <p>Assign qualified trainers to supervise workout sessions</p>
                </div>
              </div>
              <div className="info-item">
                <UserOutlined className="info-icon" />
                <div>
                  <h4>Member Tracking</h4>
                  <p>Monitor individual member progress and workout plans</p>
                </div>
              </div>
              <div className="info-item">
                <ToolOutlined className="info-icon" />
                <div>
                  <h4>Equipment Management</h4>
                  <p>Ensure proper equipment allocation and availability</p>
                </div>
              </div>
              <div className="info-item">
                <CalendarOutlined className="info-icon" />
                <div>
                  <h4>Schedule Planning</h4>
                  <p>Organize training sessions efficiently for optimal results</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
