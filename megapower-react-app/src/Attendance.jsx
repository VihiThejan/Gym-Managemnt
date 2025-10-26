import React, { useState } from "react";
import { Button, Space, Form, DatePicker, TimePicker, message } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Attendance = () => {
  const [id, setId] = useState("");
  const [date, setDate] = useState(null);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/Attendancetable');
  };

  const validateForm = () => {
    const errors = {};

    if (!id) errors.id = "User Id is required.";
    if (!date) errors.date = "Date is required.";
    if (!inTime) errors.inTime = "In Time is required.";
    if (!outTime) errors.outTime = "Out Time is required.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      message.error("Please fill in all fields.");
      return;
    }
  
    const body = {
      memberId: parseInt(id), // Ensure member ID is an integer
      currentDate: date ? date.format("YYYY-MM-DD") : null, // Convert DatePicker value to string
      inTime: inTime ? inTime.format("HH:mm:ss") : null, // Convert TimePicker value to string
      outTime: outTime ? outTime.format("HH:mm:ss") : null, // Convert TimePicker value to string
    };
  
    try {
      const res = await axios.post("http://localhost:5000/api/v1/attendance/create", body);
      console.log(res?.data?.data);
      message.success("Attendance Created successfully.");
      navigate("/Attendancetable");
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to register Attendance.");
    }
  };
  
  const handleReset = () => {
    setId('');
    setDate(null);
    setInTime(null);
    setOutTime(null);
    setFormErrors({});
  };

  return (
    <div
      className="auth-form-container"
      style={{
        padding: "50px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack} 
          style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}
        >
          Back
        </Button>
      </div>
      <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>
        Attendance
      </h2>
      <form
        className="Attendance-form"
        onSubmit={handleSubmit}
        style={{ textAlign: "left" }}
      >
      
        <label
          htmlFor="Id"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Member Id
        </label>
        <input
          value={id}
          name="Id"
          onChange={(e) => setId(e.target.value)}
          id="Id"
          placeholder="Id"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        />
        {formErrors.id && <p style={{ color: "red" }}>{formErrors.id}</p>}

        
        <label
          htmlFor="Date"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Date
        </label>
        <Space direction="vertical" style={{ width: "100%", marginBottom: "20px" }}>
          <DatePicker
            onChange={(date) => setDate(date)}
            style={{ width: "100%", borderRadius: "5px" }}
          />
        </Space>
        {formErrors.date && <p style={{ color: "red" }}>{formErrors.date}</p>}

        
        <label
          htmlFor="InTime"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          In Time
        </label>
        <TimePicker
          onChange={(time) => setInTime(time)}
          minuteStep={15}
          secondStep={10}
          hourStep={1}
          format="HH:mm:ss"
          style={{ width: "100%", borderRadius: "5px", marginBottom: "20px" }}
        />
        {formErrors.inTime && <p style={{ color: "red" }}>{formErrors.inTime}</p>}

        
        <label
          htmlFor="OutTime"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Out Time
        </label>
        <TimePicker
          onChange={(time) => setOutTime(time)}
          minuteStep={15}
          secondStep={10}
          hourStep={1}
          format="HH:mm:ss"
          style={{ width: "100%", borderRadius: "5px", marginBottom: "20px" }}
        />
        {formErrors.outTime && <p style={{ color: "red" }}>{formErrors.outTime}</p>}

        
        <Form.Item style={{ textAlign: "left", marginTop: "20px" }}>
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
  );
};
