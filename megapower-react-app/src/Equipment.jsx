import React, { useState } from "react";
import { Button, DatePicker, Form, message, Select, Input, Card } from 'antd';
import { SaveOutlined, CloseOutlined, PlusOutlined, TagsOutlined, NumberOutlined, 
         ShoppingOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import MainLayout from './components/Layout/MainLayout';
import './Equipment.css';

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
    <MainLayout>
      <div className="equipment-page">
        {/* Header Section */}
        <div className="equipment-header">
          <div className="header-content">
            <PlusOutlined className="header-icon" />
            <div className="header-text">
              <h1>Add New Equipment</h1>
              <p>Register new gym equipment and inventory</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="equipment-content">
          <Card className="equipment-card">
            <Form onSubmit={handleSubmit} className="equipment-form">
              {/* Equipment Name */}
              <Form.Item validateStatus={nameError ? 'error' : ''} help={nameError}>
                <label className="form-label">
                  <TagsOutlined className="label-icon" />
                  Equipment Name
                </label>
                <Select
                  value={name}
                  onChange={(value) => setName(value)}
                  placeholder="Select equipment name"
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
              <Form.Item>
                <label className="form-label">
                  <NumberOutlined className="label-icon" />
                  Quantity
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="Enter quantity (1-100)"
                  className="form-input"
                />
              </Form.Item>

              {/* Vendor */}
              <Form.Item>
                <label className="form-label">
                  <ShoppingOutlined className="label-icon" />
                  Vendor
                </label>
                <Select
                  value={vendor}
                  onChange={(value) => setVendor(value)}
                  placeholder="Select vendor"
                  className="form-select"
                >
                  {vendors.map((v, index) => (
                    <Select.Option key={index} value={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Description */}
              <Form.Item>
                <label className="form-label">
                  <FileTextOutlined className="label-icon" />
                  Description
                </label>
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

              {/* Purchase Date */}
              <Form.Item>
                <label className="form-label">
                  <CalendarOutlined className="label-icon" />
                  Purchase Date
                </label>
                <DatePicker
                  onChange={(date) => setDate(date)}
                  placeholder="Select purchase date"
                  className="form-datepicker"
                  style={{ width: '100%' }}
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
                    {submitting ? 'Submitting...' : 'Add Equipment'}
                  </Button>
                  <Button
                    type="default"
                    icon={<CloseOutlined />}
                    className="cancel-button"
                    onClick={() => navigate('/Equipmenttable')}
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
