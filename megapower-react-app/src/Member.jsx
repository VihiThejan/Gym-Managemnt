import React, { useState, useEffect } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Radio, InputNumber, Select, DatePicker, message, Input, Form, Layout, Card } from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  ManOutlined, 
  WomanOutlined,
  MailOutlined, 
  PhoneOutlined, 
  GiftOutlined, 
  ColumnHeightOutlined, 
  DashboardOutlined, 
  LockOutlined, 
  CheckCircleOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import moment from "moment";
import AdminSidebar from "./components/AdminSidebar";
import './Member.css';
import './Dashboard.css';

const { Content } = Layout;

export const Member = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchMemberData(id);
    }
  }, [id]);

  const fetchMemberData = async (memberId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/v1/member/get/${memberId}`);
      const memberData = response?.data?.data;
      
      if (memberData) {
        form.setFieldsValue({
          name: memberData.FName,
          email: memberData.Email,
          address: memberData.Address,
          dob: memberData.DOB ? moment(memberData.DOB) : null,
          gender: memberData.Gender,
          package: memberData.Package,
          height: memberData.Height,
          weight: memberData.Weight,
        });
        setMobile(memberData.Contact || '');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
      message.error('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value && !isEditMode) {
      return Promise.reject(new Error('Please enter password'));
    }
    if (value) {
      const minLength = 6;
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (value.length < minLength) {
        return Promise.reject(new Error(`Password must be at least ${minLength} characters long`));
      }
      if (!hasUppercase) {
        return Promise.reject(new Error('Password must contain at least one uppercase letter'));
      }
      if (!hasLowercase) {
        return Promise.reject(new Error('Password must contain at least one lowercase letter'));
      }
      if (!hasNumber) {
        return Promise.reject(new Error('Password must contain at least one number'));
      }
      if (!hasSpecialChar) {
        return Promise.reject(new Error('Password must contain at least one special character'));
      }
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const formattedDate = values.dob ? values.dob.toISOString() : '';
    const body = {
      fName: values.name,
      dob: formattedDate,
      gender: values.gender,
      email: values.email,
      address: values.address,
      contact: mobile,
      package: values.package,
      weight: values.weight,
      height: values.height,
      password: values.password,
    };

    try {
      if (isEditMode) {
        // Update existing member
        await axios.put(`http://localhost:5000/api/v1/member/edit/${id}`, body);
        message.success("Member updated successfully!");
      } else {
        // Create new member
        await axios.post('http://localhost:5000/api/v1/member/create', body);
        message.success("Member created successfully!");
      }
      
      setTimeout(() => {
        navigate('/MemberTable');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} member. Please try again.`;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/MemberTable" />
      <Layout style={{ marginLeft: 260 }}>
        <Content className="dashboard-content">
          <div className="member-form-container">
            <div className="form-header-section">
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/MemberTable')}
                className="back-button"
              >
                Back to Members
              </Button>
              <div className="header-title-section">
                <UserAddOutlined className="header-icon-large" />
                <div>
                  <h1 className="page-title">{isEditMode ? 'Edit Member' : 'Add New Member'}</h1>
                  <p className="page-subtitle">{isEditMode ? 'Update member information' : 'Create a new member account'}</p>
                </div>
              </div>
            </div>

            <Card className="member-form-card">
              <div className="form-wrapper">{showSuccess && (
                <div className="success-alert">
                  <CheckCircleOutlined />
                  <span>Member {isEditMode ? 'updated' : 'created'} successfully!</span>
                </div>
              )}

              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="member-form"
                requiredMark={false}
                initialValues={{ gender: 'Male', package: 'Basic' }}
              >
                <Form.Item
                  name="name"
                  label={<span className="input-label"><UserOutlined />Full Name</span>}
                  rules={[
                    { required: true, message: 'Please enter full name' },
                    { pattern: /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/, message: 'Full name must contain first and last name with uppercase starting letters' }
                  ]}
                >
                  <Input placeholder="Enter full name (e.g., John Doe)" className="form-input" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<span className="input-label"><MailOutlined />Email</span>}
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="example@gmail.com" className="form-input" />
                </Form.Item>

                <Form.Item
                  name="mobile"
                  label={<span className="input-label"><PhoneOutlined />Mobile Number</span>}
                  rules={[
                    { required: true, message: 'Please enter mobile number' },
                    { validator: (_, value) => {
                        const cleanedMobile = mobile.replace(/\D/g, '');
                        return cleanedMobile.length >= 11 ? Promise.resolve() : Promise.reject(new Error('Invalid mobile number'));
                      }
                    }
                  ]}
                >
                  <div className="phone-input-container">
                    <PhoneInput country={'lk'} value={mobile} onChange={(phone) => setMobile(phone)} containerClass="react-tel-input" />
                  </div>
                </Form.Item>

                <Form.Item
                  name="address"
                  label={<span className="input-label"><HomeOutlined />Address</span>}
                  rules={[
                    { required: true, message: 'Please enter address' },
                    { min: 10, message: 'Address must be at least 10 characters' }
                  ]}
                >
                  <Input placeholder="Enter full address" className="form-input" />
                </Form.Item>

                <Form.Item
                  name="dob"
                  label={<span className="input-label"><CalendarOutlined />Date of Birth</span>}
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker placeholder="Select date of birth" className="form-input" style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label={<span className="input-label"><UserOutlined />Gender</span>}
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Radio.Group className="gender-radio">
                    <Radio.Button value="Male"><ManOutlined /> Male</Radio.Button>
                    <Radio.Button value="Female"><WomanOutlined /> Female</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="package"
                  label={<span className="input-label"><GiftOutlined />Membership Package</span>}
                  rules={[{ required: true, message: 'Please select package' }]}
                >
                  <Select placeholder="Select package" className="form-input" options={[{ value: 'Basic', label: 'Basic' }, { value: 'Standard', label: 'Standard' }, { value: 'Premium', label: 'Premium' }]} />
                </Form.Item>

                <Form.Item
                  name="height"
                  label={<span className="input-label"><ColumnHeightOutlined />Height (cm)</span>}
                  rules={[{ required: true, message: 'Please enter height' }]}
                >
                  <InputNumber placeholder="Enter height in cm" className="form-input" style={{ width: '100%' }} min={100} max={250} />
                </Form.Item>

                <Form.Item
                  name="weight"
                  label={<span className="input-label"><DashboardOutlined />Weight (kg)</span>}
                  rules={[{ required: true, message: 'Please enter weight' }]}
                >
                  <InputNumber placeholder="Enter weight in kg" className="form-input" style={{ width: '100%' }} min={30} max={300} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<span className="input-label"><LockOutlined />Password {isEditMode && <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#888' }}>(Leave blank to keep current password)</span>}</span>}
                  rules={[{ validator: validatePassword }]}
                >
                  <Input.Password placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"} className="password-input" />
                </Form.Item>

                {!isEditMode && (
                  <div className="password-requirements">
                    <LockOutlined />
                    <span>Must include uppercase, lowercase, number, and special character</span>
                  </div>
                )}

                <Form.Item className="form-actions">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading} 
                    icon={<SaveOutlined />}
                    size="large"
                    className="submit-button"
                  >
                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Member' : 'Create Member')}
                  </Button>
                  <Button 
                    onClick={() => navigate('/MemberTable')} 
                    size="large"
                    className="cancel-button"
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </div>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
