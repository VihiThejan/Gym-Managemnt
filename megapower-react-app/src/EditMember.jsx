import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, Select, DatePicker, message, Form, Input, Card } from 'antd';
import { SaveOutlined, CloseOutlined, EditOutlined, UserOutlined, HomeOutlined, 
         CalendarOutlined, MailOutlined, PhoneOutlined, GiftOutlined, 
         ColumnHeightOutlined, DashboardOutlined, LockOutlined, ManOutlined } from '@ant-design/icons';
import MainLayout from './components/Layout/MainLayout';
import './EditMember.css';

export const EditMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mobile, setMobile] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [packages, setPackages] = useState('Gold');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchMember = async () => {
       try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5000/api/v1/member/${id}`);
          const member = response.data.data;

          setName(member.FName);
          setDate(member.DOB ? moment(member.DOB) : null);
          setGender(member.Gender);
          setEmail(member.Email);
          setAddress(member.Address);
          setMobile(member.Contact);
          setPackages(member.Package);
          setWeight(Number(member.Weight));
          setHeight(Number(member.Height));
          setMobile(member.UName);
          setPass(member.Password);
          setLoading(false);
       } catch (error) {
          console.error(`Error fetching member data: ${error.message}`);
          message.error('Failed to load member data');
          setLoading(false);
       }
    };
    fetchMember();
 }, [id]);

  const validateMobile = (mobile) => {
    const cleanedMobile = mobile.replace(/\D/g, '');
    return cleanedMobile.length >= 11;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async () => {
    if (!name || !address || !email || !mobile || !date || !height || !weight) {
      message.error("Please fill in all required fields.");
      return;
    }

    if (!validateMobile(mobile)) {
      message.error("Invalid mobile number. It should be at least 10 digits long, including the country code.");
      return;
    }

    if (!validateEmail(email)) {
      message.error("Invalid email format.");
      return;
    }

    if (height <= 0 || height > 10) {
      message.error("Height should be between 0 and 10 feet.");
      return;
    }

    if (weight <= 0 || weight > 200) {
      message.error("Weight should be between 1 and 200 kg.");
      return;
    }
    
    try {
      setSubmitting(true);

      const formattedDate = date ? date.toISOString() : null;

      const body = {
        FName: name,
        DOB: formattedDate,
        Gender: gender,
        Email: email,
        Address: address,
        Contact: mobile,
        Package: packages,
        Weight: weight,
        Height: height,
        UName: mobile,
      };

      await axios.put(`http://localhost:5000/api/v1/member/update/${id}`, body);
      message.success("Member updated successfully!");
      
      setTimeout(() => {
        navigate('/MemberTable');
      }, 1500);
    } catch (Err) {
      console.error("Error updating member:", Err.response?.data || Err.message);
      message.error("Failed to update Member: " + (Err.response?.data?.message || Err.message));
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout showSidebar={true} showNavigation={false}>
        <div className="edit-member-page">
          <div className="edit-member-container">
            <Card className="edit-member-card" loading={true}>
              <div style={{ padding: '40px' }}>Loading member data...</div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showSidebar={true} showNavigation={false}>
      <div className="edit-member-page">
        <div className="edit-member-container">
          <Card className="edit-member-card">
            <div className="card-header">
              <div className="header-icon-card">
                <EditOutlined className="header-icon" />
              </div>
              <div>
                <h1 className="card-title">Edit Member</h1>
                <p className="card-subtitle">Update member information and subscription details</p>
              </div>
            </div>

            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label={
                  <span className="form-label">
                    <UserOutlined className="label-icon" />
                    Full Name
                  </span>
                }
                required
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  size="large"
                  className="form-input"
                  required
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="form-label">
                    <HomeOutlined className="label-icon" />
                    Address
                  </span>
                }
                required
              >
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                  size="large"
                  className="form-input"
                  required
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="form-label">
                    <CalendarOutlined className="label-icon" />
                    Date of Birth
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
                    <ManOutlined className="label-icon" />
                    Gender
                  </span>
                }
                required
              >
                <Radio.Group 
                  onChange={(e) => setGender(e.target.value)} 
                  value={gender}
                  className="gender-radio-group"
                  size="large"
                >
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label={
                  <span className="form-label">
                    <MailOutlined className="label-icon" />
                    Email
                  </span>
                }
                required
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  size="large"
                  className="form-input"
                  required
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="form-label">
                    <PhoneOutlined className="label-icon" />
                    Mobile Number
                  </span>
                }
                required
                validateStatus={mobile && !validateMobile(mobile) ? 'error' : ''}
                help={mobile && !validateMobile(mobile) ? 'Mobile number must be at least 10 digits' : ''}
              >
                <PhoneInput
                  country={'lk'}
                  value={mobile}
                  onChange={(phone) => setMobile(phone)}
                  inputClass="phone-input-field"
                  containerClass="phone-input-container"
                  buttonClass="phone-input-button"
                  required
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="form-label">
                    <GiftOutlined className="label-icon" />
                    Membership Package
                  </span>
                }
                required
              >
                <Select
                  value={packages}
                  onChange={(value) => setPackages(value)}
                  size="large"
                  className="form-select"
                  required
                  options={[
                    { value: 'Gold', label: 'Gold (3 months fee)' },
                    { value: 'Platinum', label: 'Platinum (6 months, 10% off)' },
                    { value: 'Diamond', label: 'Diamond (12 months, 10% off + free membership)' },
                  ]}
                />
              </Form.Item>

              <div className="form-row">
                <Form.Item
                  label={
                    <span className="form-label">
                      <ColumnHeightOutlined className="label-icon" />
                      Height (feet)
                    </span>
                  }
                  required
                  className="form-row-item"
                >
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="0.00"
                    min={0}
                    max={10}
                    step="0.01"
                    size="large"
                    className="form-input"
                    required
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="form-label">
                      <DashboardOutlined className="label-icon" />
                      Weight (kg)
                    </span>
                  }
                  required
                  className="form-row-item"
                >
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                    min={1}
                    max={200}
                    size="large"
                    className="form-input"
                    required
                  />
                </Form.Item>
              </div>

              <div className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  className="submit-button"
                  loading={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Member'}
                </Button>
                <Button
                  type="default"
                  icon={<CloseOutlined />}
                  size="large"
                  className="cancel-button"
                  onClick={() => navigate('/MemberTable')}
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