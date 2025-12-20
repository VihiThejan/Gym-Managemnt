import React, { useState, useEffect } from "react";
import { Button, Table, Input, Tag, message, Modal, Form, Select, DatePicker, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { 
  TeamOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  IdcardOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  LockOutlined
} from "@ant-design/icons";
import moment from "moment";
import { Layout } from 'antd';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import './staffTable.css';

const { Content } = Layout;

const StaffTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/staffmember/list");
      setData(res?.data?.data);
      setFilteredData(res?.data?.data);
    } catch (error) {
      message.error('Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Staff_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.FName || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Email || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Job_Role || '').toLowerCase().includes(value.toLowerCase()) ||
        String(item.Contact_No || '').toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleEdit = (staffid) => {
    navigate(`/staff/${staffid}`);
  };

  const handleDelete = (staffid, staffName) => {
    Modal.confirm({
      title: 'Delete Staff Member',
      content: `Are you sure you want to delete ${staffName}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/v1/staffmember/delete/${staffid}`);
          message.success('Staff member deleted successfully');
          fetchData();
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to delete staff member';
          if (error.response?.status === 400) {
            const details = error.response?.data?.details;
            let detailMsg = errorMessage;
            if (details) {
              if (details.appointments > 0) {
                detailMsg += ` (${details.appointments} appointment${details.appointments > 1 ? 's' : ''})`;
              }
              if (details.schedules > 0) {
                detailMsg += ` (${details.schedules} schedule${details.schedules > 1 ? 's' : ''})`;
              }
            }
            message.error(detailMsg, 5);
          } else {
            message.error(errorMessage);
          }
        }
      }
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setMobile('');
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please enter password'));
    }
    const minLength = 6;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (value.length < minLength) {
      return Promise.reject(new Error(`Password must be at least ${minLength} characters long`));
    }
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(new Error('Password must contain uppercase, lowercase, number, and special character'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const formattedDate = values.dob ? values.dob.toISOString() : '';
    const body = {
      FName: values.name,
      dob: formattedDate,
      address: values.address,
      gender: values.gender,
      contactNo: mobile,
      email: values.email,
      jobRole: values.jobRole,
      password: values.password
    };

    try {
      await axios.post('http://localhost:5000/api/v1/staffmember/create', body);
      message.success('Staff member added successfully!');
      handleCancel();
      fetchData();
    } catch (error) {
      message.error('Failed to add staff member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Staff ID",
      dataIndex: "Staff_ID",
      key: "staffid",
      fixed: "left",
      width: 120,
      render: (id) => (
        <Tag color="purple" className="id-tag">
          <IdcardOutlined /> {id}
        </Tag>
      ),
    },
    {
      title: "Name",
      dataIndex: "FName",
      key: "fname",
      width: 180,
      render: (name) => (
        <span className="name-cell">
          <UserOutlined /> {name}
        </span>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "DOB",
      key: "dob",
      width: 150,
      render: (date) => (
        <span className="date-cell">
          <CalendarOutlined /> {moment(date).format("YYYY-MM-DD")}
        </span>
      ),
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "gender",
      width: 120,
      render: (gender) => (
        <Tag color={gender === 'Male' ? 'blue' : 'pink'} className="gender-tag">
          {gender === 'Male' ? <ManOutlined /> : <WomanOutlined />} {gender}
        </Tag>
      ),
    },
    {
      title: "Contact",
      dataIndex: "Contact_No",
      key: "contact",
      width: 160,
      render: (contact) => (
        <span className="contact-cell">
          <PhoneOutlined /> {contact}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      width: 220,
      render: (email) => (
        <span className="email-cell">
          <MailOutlined /> {email}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "address",
      width: 250,
      render: (address) => (
        <span className="address-cell">
          <EnvironmentOutlined /> {address}
        </span>
      ),
    },
    {
      title: "Job Role",
      dataIndex: "Job_Role",
      key: "job_role",
      width: 130,
      render: (role) => (
        <Tag color="geekblue" className="role-tag">
          <TeamOutlined /> {role}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.Staff_ID)}
            className="edit-button"
          >
            Edit
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.Staff_ID, record.FName)}
            className="delete-button"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/staffTable" />
      <Layout style={{ marginLeft: 260 }}>
        <Content className="dashboard-content">
      <div className="staff-table-container">
        <div className="table-header">
          <div className="header-left">
            <TeamOutlined className="header-icon" />
            <h1 className="table-title">Staff Management</h1>
          </div>

          <div className="header-actions">
            <Input
              placeholder="Search by ID, name, email, role or contact..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined className="search-icon" />}
              allowClear
              className="search-input"
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={showModal}
              className="add-button"
            >
              Add New Staff
            </Button>
          </div>
        </div>

        <div className="table-wrapper">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="Staff_ID"
            loading={loading}
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} staff members`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            className="staff-table"
          />
        </div>

        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserOutlined style={{ color: '#667eea' }} />
              <span>Add New Staff Member</span>
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ gender: 'Male', jobRole: 'Trainer' }}
            style={{ marginTop: '24px' }}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter full name' },
                { pattern: /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/, message: 'Full name must contain first and last name with uppercase starting letters' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter full name (e.g., John Doe)" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="example@gmail.com" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[
                { required: true, message: 'Please enter mobile number' },
                {
                  validator: (_, value) => {
                    const cleanedMobile = mobile.replace(/\D/g, '');
                    return cleanedMobile.length >= 11 ? Promise.resolve() : Promise.reject(new Error('Invalid mobile number'));
                  }
                }
              ]}
            >
              <PhoneInput
                country={'lk'}
                value={mobile}
                onChange={(phone) => setMobile(phone)}
                inputStyle={{
                  width: '100%',
                  height: '40px',
                  fontSize: '14px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[
                { required: true, message: 'Please enter address' },
                { min: 10, message: 'Address must be at least 10 characters' },
                {
                  validator: (_, value) => {
                    if (value && /[a-zA-Z]/.test(value) && /\d/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Address must contain both letters and numbers'));
                  }
                }
              ]}
            >
              <Input 
                prefix={<EnvironmentOutlined />} 
                placeholder="Enter full address" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[{ required: true, message: 'Please select date of birth' }]}
            >
              <DatePicker 
                placeholder="Select date of birth" 
                size="large"
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Radio.Group size="large">
                <Radio.Button value="Male">
                  <ManOutlined /> Male
                </Radio.Button>
                <Radio.Button value="Female">
                  <WomanOutlined /> Female
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="jobRole"
              label="Job Role"
              rules={[{ required: true, message: 'Please select job role' }]}
            >
              <Select 
                placeholder="Select job role" 
                size="large"
                options={[
                  { value: 'Trainer', label: 'Trainer' },
                  { value: 'Cashier', label: 'Cashier' }
                ]}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ validator: validatePassword }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter password" 
                size="large"
              />
            </Form.Item>

            <div style={{ fontSize: '12px', color: '#999', marginTop: '-16px', marginBottom: '16px' }}>
              <LockOutlined /> Must include uppercase, lowercase, number, and special character
            </div>

            <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel} size="large">
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={submitting}
                  icon={<PlusOutlined />}
                  size="large"
                >
                  Add Staff Member
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffTable;