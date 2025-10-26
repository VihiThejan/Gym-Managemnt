import React, { useState, useEffect } from "react";
import { Button, Form, Rate, Input, message, Card, Select } from "antd";
import { 
  StarOutlined, 
  UserOutlined, 
  TeamOutlined, 
  CommentOutlined,
  CheckCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import MainLayout from './components/Layout/MainLayout';
import './Trainerrate.css';

const { TextArea } = Input;

export const Trainerrate = () => {
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
    try {
      setLoadingMembers(true);
      const res = await axios.get('http://localhost:5000/api/v1/member/list');
      setMembers(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error('Failed to load members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const res = await axios.get('http://localhost:5000/api/v1/staffmember/list');
      setStaff(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      message.error('Failed to load staff');
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const body = {
        staffId: values.staffId,
        memberId: values.memberId,
        rating: values.rating,
        comment: values.comment,
      };

      await axios.post('http://localhost:5000/api/v1/trainerrate/create', body);
      message.success("Trainer rating submitted successfully!");
      setTimeout(() => {
        navigate('/Trainerratetable');
      }, 1000);
    } catch (error) {
      console.error('Error submitting rating:', error);
      message.error("Failed to submit trainer rating.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
  };

  return (
    <MainLayout>
      <div className="trainerrate-container">
        <div className="trainerrate-content">
          <Card className="trainerrate-card">
            <div className="card-header">
              <div className="header-icon">
                <StarOutlined />
              </div>
              <h1 className="header-title">Rate Trainer</h1>
              <p className="header-subtitle">Share your feedback and rate trainer performance</p>
            </div>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="trainerrate-form"
            >
              <div className="form-row">
                <Form.Item
                  label="Select Member"
                  name="memberId"
                  rules={[{ required: true, message: 'Please select a member' }]}
                  className="form-item"
                >
                  <Select
                    placeholder="Choose member"
                    size="large"
                    showSearch
                    loading={loadingMembers}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    suffixIcon={<UserOutlined />}
                  >
                    {members.map((member) => {
                      const memberId = member.Member_Id || member.Member_ID || member.member_id || member.id;
                      const memberName = member.FName || member.Name || member.name || member.MemberName || 'Unknown';
                      return (
                        <Select.Option key={memberId} value={memberId} label={`${memberId} - ${memberName}`}>
                          {memberId} - {memberName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Select Staff/Trainer"
                  name="staffId"
                  rules={[{ required: true, message: 'Please select a staff member' }]}
                  className="form-item"
                >
                  <Select
                    placeholder="Choose staff/trainer"
                    size="large"
                    showSearch
                    loading={loadingStaff}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    suffixIcon={<TeamOutlined />}
                  >
                    {staff.map((staffMember) => {
                      const staffId = staffMember.Staff_ID || staffMember.Staff_Id || staffMember.staff_id || staffMember.id;
                      const staffName = staffMember.FName || staffMember.Name || staffMember.name || staffMember.StaffName || 'Unknown';
                      return (
                        <Select.Option key={staffId} value={staffId} label={`${staffId} - ${staffName}`}>
                          {staffId} - {staffName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                label="Rating"
                name="rating"
                rules={[{ required: true, message: 'Please provide a rating' }]}
                className="rating-item"
              >
                <Rate className="custom-rate" />
              </Form.Item>

              <Form.Item
                label="Comment"
                name="comment"
                rules={[
                  { required: true, message: 'Please provide a comment' },
                  { min: 10, message: 'Comment must be at least 10 characters' }
                ]}
                className="form-item"
              >
                <TextArea
                  rows={5}
                  placeholder="Share your experience and feedback about the trainer..."
                  prefix={<CommentOutlined />}
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item className="form-actions">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<CheckCircleOutlined />}
                  loading={loading}
                  className="submit-button"
                >
                  Submit Rating
                </Button>
                <Button 
                  onClick={handleClear}
                  className="clear-button"
                >
                  Clear
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card className="info-card">
            <div className="info-header">
              <TrophyOutlined className="info-icon" />
              <h3>Rating Guidelines</h3>
            </div>
            <div className="info-content">
              <div className="info-item">
                <StarOutlined className="item-icon" />
                <div>
                  <h4>Be Honest</h4>
                  <p>Provide honest feedback to help trainers improve</p>
                </div>
              </div>
              <div className="info-item">
                <UserOutlined className="item-icon" />
                <div>
                  <h4>Be Specific</h4>
                  <p>Mention specific aspects of training that stood out</p>
                </div>
              </div>
              <div className="info-item">
                <TeamOutlined className="item-icon" />
                <div>
                  <h4>Be Constructive</h4>
                  <p>Focus on constructive feedback for improvement</p>
                </div>
              </div>
              <div className="info-item">
                <CommentOutlined className="item-icon" />
                <div>
                  <h4>Be Detailed</h4>
                  <p>Include details about your training experience</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
