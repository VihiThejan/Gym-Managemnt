import React, { useState } from "react";
import { Button, Space, DatePicker, InputNumber, Form, message, Select, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const { TextArea } = Input;

export const Equipment = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(''); 
  const [qty, setQty] = useState(0); 
  const [date, setDate] = useState(null); 
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');

  const vendors = ["Big Bosa Gym Fitness Equipment", "Eser Marketing International", "GS Sports", "Mansa Fitness Equipment"]; 
  const equipmentNames = ["Barbell", "Bench", "Cable Machine", "Dumbell", "Exsercise Bike", "Lat Pulldown Machine", "Leg Press Machines", "Rowing Machine", "Stair Climber", "Treadmill"];  

  const validateName = (name) => {
    if (!name) {
      return 'E- Equipment Name is required.';
    }
    return '';
  };

  const validateForm = () => {
    if (!name || !qty || !date || !vendor || !description) {
      message.error("Please fill in all required fields.");
      return false;
    }

    const nameErrorMsg = validateName(name);
    if (nameErrorMsg) {
      setNameError(nameErrorMsg);
      return false;
    } else {
      setNameError('');
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = date ? date.toISOString() : '';
    const body = {
      eName: name,
      qty: qty,
      vendor: vendor,
      description: description,
      date: formattedDate,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/equipment/create', body);
      console.log(res?.data?.data);
      message.success("Equipment registered successfully.");
      navigate('/Equipmenttable');
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to register Equipment.");
    }
  };

  const handleReset = () => {
    setName('');
    setQty(0);
    setVendor('');
    setDescription('');
    setDate(null);
    setNameError(''); 
  };

  const handleChangeQty = (value) => {
    setQty(value);
    console.log('changed', value);
  };

  const handleVendorChange = (value) => {
    setVendor(value);
  };

  const handleNameChange = (value) => {
    setName(value);
  };

  return (
    <div className="auth-form-container" style={{ padding: "50px", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "15px", boxShadow: "10 10px 12px rgba(0, 0, 0, 0.3)", maxWidth: "500px", margin: "auto", height: "600px" }}>
      <div style={{ textAlign: 'left', width: '100%' }}>
        <h2 style={{ textAlign: "center", marginBottom: "50px",marginTop: "0px", borderRadius: "50px", maxWidth: "100%", color: "white" }}>
          Equipment</h2>
        <form className="Equipment-form" onSubmit={handleSubmit}>

          <label htmlFor="name" style={{ color: "white", fontWeight: "bold", marginBottom: "4px", display: "block" }}>Equipment Name</label>
          <Select
            value={name}
            onChange={handleNameChange}
            placeholder="Select an equipment name"
            style={{ width: '100%', marginBottom: "15px" }}
          >
            {equipmentNames.map((e, index) => (
              <Select.Option key={index} value={e}>
                {e}
              </Select.Option>
            ))}
          </Select>
          {nameError && <p style={{ color: 'red', marginBottom: "20px" }}>{nameError}</p>}

          <label htmlFor="Quantity" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Quantity</label>
          <InputNumber
            min={1}
            max={100}
            value={qty}
            onChange={handleChangeQty}
            style={{ width: '100%', marginBottom: "15px" }}
          /><br />

          <label htmlFor="vendor" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Vendor</label>
          <Select
            value={vendor}
            onChange={handleVendorChange}
            placeholder="Select a vendor"
            style={{ width: '100%', marginBottom: "15px" }}
          >
            {vendors.map((v, index) => (
              <Select.Option key={index} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>

          <label htmlFor="Description" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Description</label>
          <TextArea
            value={description}
            name="Description"
            onChange={(e) => setDescription(e.target.value)}
            id="Description"
            placeholder="Description"
            style={{ width: '100%', marginBottom: "15px" }}
          /><br />

          <label htmlFor="Date" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Date</label>
          <Space direction="vertical" style={{ width: '100%', marginBottom: "40px" }}>
            <DatePicker onChange={(date) => setDate(date)} style={{ width: '100%' }} />
          </Space><br />

          <Form.Item style={{ textAlign: "left", marginTop: "0px" }}>
            <Space size="large">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                onClick={handleReset} 
                type="default"
                htmlType="button"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #d9d9d9",
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>

        </form>
      </div>
    </div>
  );
};
