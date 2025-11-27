import React, { useState } from "react";
import { Button, DatePicker, Form, message, Select, Input, Card } from 'antd';
import { SaveOutlined, CloseOutlined, PlusOutlined, TagsOutlined, NumberOutlined, 
         ShoppingOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Layout } from 'antd';
import AdminSidebar from './components/AdminSidebar';
import './Equipment.css';

const { Content } = Layout;

const { TextArea } = Input;

export const Equipment = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(''); 
  const [qty, setQty] = useState(''); 
  const [date, setDate] = useState(null); 
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [charCount, setCharCount] = useState(0);

  const vendors = ["Big Bosa Gym Fitness Equipment", "Eser Marketing International", "GS Sports", "Mansa Fitness Equipment"]; 
  const equipmentNames = ["Barbell", "Bench", "Cable Machine", "Dumbell", "Exsercise Bike", "Lat Pulldown Machine", "Leg Press Machines", "Rowing Machine", "Stair Climber", "Treadmill"];  

  const validateName = (name) => {
    if (!name) {
      return 'E- Equipment Name is required.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !qty || !date || !vendor || !description) {
      message.error("Please fill in all required fields.");
      return;
    }

    const nameErrorMsg = validateName(name);
    if (nameErrorMsg) {
      setNameError(nameErrorMsg);
      message.error(nameErrorMsg);
      return;
    } else {
      setNameError('');
    }

    if (qty < 1 || qty > 100) {
      message.error('Quantity must be between 1 and 100');
      return;
    }

    try {
      setSubmitting(true);
      const formattedDate = date ? date.toISOString() : '';
      const body = {
        eName: name,
        qty: qty,
        vendor: vendor,
        description: description,
        date: formattedDate,
      };

      const res = await axios.post('http://localhost:5000/api/v1/equipment/create', body);
      console.log(res?.data?.data);
      message.success("Equipment registered successfully!");
      setTimeout(() => {
        navigate('/Equipmenttable');
      }, 1500);
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to register Equipment.");
      setSubmitting(false);
    }
  };

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/Equipmenttable" />
      <Layout style={{ marginLeft: 260 }}>
        <Content>
          <div className="equipment-page">
        <div className="equipment-container">
          <Card className="equipment-card">
            {/* Card Header */}
            <div className="card-header">
              <div className="header-icon-card">
                <PlusOutlined className="header-icon" />
              </div>
              <div className="header-text">
                <h1>Add New Equipment</h1>
                <p>Register new gym equipment and inventory</p>
              </div>
            </div>

            {/* Form */}
            <Form onSubmit={handleSubmit} className="equipment-form">
              {/* Equipment Name */}
              <Form.Item
                label={
                  <span className="form-label">
                    <TagsOutlined className="label-icon" />
                    Equipment Name
                  </span>
                }
                validateStatus={nameError ? 'error' : ''}
                help={nameError}
                className="form-item"
              >
                <Select
                  value={name}
                  onChange={(value) => setName(value)}
                  placeholder="Select equipment name"
                  size="large"
                  className="form-select"
                >
                  {equipmentNames.map((e, index) => (
                    <Select.Option key={index} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Quantity */}
              <Form.Item
                label={
                  <span className="form-label">
                    <NumberOutlined className="label-icon" />
                    Quantity
                  </span>
                }
                className="form-item"
              >
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="Enter quantity (1-100)"
                  size="large"
                  className="form-input"
                />
              </Form.Item>

              {/* Vendor */}
              <Form.Item
                label={
                  <span className="form-label">
                    <ShoppingOutlined className="label-icon" />
                    Vendor
                  </span>
                }
                className="form-item"
              >
                <Select
                  value={vendor}
                  onChange={(value) => setVendor(value)}
                  placeholder="Select vendor"
                  size="large"
                  className="form-select"
                >
                  {vendors.map((v, index) => (
                    <Select.Option key={index} value={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Purchase Date */}
              <Form.Item
                label={
                  <span className="form-label">
                    <CalendarOutlined className="label-icon" />
                    Purchase Date
                  </span>
                }
                className="form-item"
              >
                <DatePicker
                  onChange={(date) => setDate(date)}
                  placeholder="Select purchase date"
                  size="large"
                  className="form-datepicker"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* Description */}
              <Form.Item
                label={
                  <span className="form-label">
                    <FileTextOutlined className="label-icon" />
                    Description
                  </span>
                }
                className="form-item"
              >
                <div className="textarea-wrapper">
                  <TextArea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setCharCount(e.target.value.length);
                    }}
                    placeholder="Enter equipment description"
                    className="form-textarea"
                    maxLength={500}
                    rows={4}
                  />
                  <div className="char-counter">
                    {charCount}/500 characters
                  </div>
                </div>
              </Form.Item>

              {/* Action Buttons */}
              <div className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                  size="large"
                  className="submit-button"
                  onClick={handleSubmit}
                >
                  {submitting ? 'Submitting...' : 'Add Equipment'}
                </Button>
                <Button
                  type="default"
                  icon={<CloseOutlined />}
                  size="large"
                  className="cancel-button"
                  onClick={() => navigate('/Equipmenttable')}
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
