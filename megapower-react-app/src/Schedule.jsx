import React, { useState } from "react";
import { Button, DatePicker, Select, Space, InputNumber, Input, Form, message } from 'antd';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export const Schedule = () => {
  const [staffId, setStaffId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [exercise, setExercise] = useState('');
  const [equipment, setEquipment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      message.error("Please select a valid date.");
      return;
    }

    const formattedDate = date instanceof Date ? date.toISOString() : new Date(date).toISOString();

    const body = {
      staffId:staffId,
      memberId:memberId,
      eName: exercise,
      equipment:equipment,
      quantity:quantity,
      date: formattedDate, 
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/schedule/create",
        body
      );
      console.log(res?.data?.data);
      message.success("Schedule Created successfully.");
      navigate("/Scheduletable");
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to create Schedule.");
    }
  };

  const handleReset = () => {
    setStaffId('');
    setMemberId('');
    setExercise('');
    setEquipment('');
    setQuantity(1);
    setDate(null);
  };

  return (
    <div className="auth-form-container" style={{ padding: "40px", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "35px", boxShadow: "10 10px 12px rgba(0, 0, 0, 0.3)", maxWidth: "700px", margin: "10px", height: "650px" }}>
      <div style={{ textAlign: 'left', width: '100%' }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px", marginTop: "0px", color: "white" }}>
          Schedule
        </h2>
        <form className="Schedule-form" onSubmit={handleSubmit}>

          <label htmlFor="staffId" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Staff ID</label>
          <Input
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            placeholder="Enter Staff ID"
            style={{ width: "100%", marginBottom: "15px", borderRadius: "5px", padding: "5px" }}
          />

          <label htmlFor="memberId" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Member ID</label>
          <Input
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="Enter Member ID"
            style={{ width: "100%", marginBottom: "15px", borderRadius: "5px", padding: "5px" }}
          />

          <label htmlFor="exercise" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Exercise</label>
          <Select
            placeholder="Select Exercise"
            value={exercise}
            onChange={(value) => setExercise(value)}
            style={{ width: "100%", marginBottom: "15px", borderRadius: "5px" }}
          >
            <Option value="Bench Press">Bench Press</Option>
            <Option value="Band Pull-Aparts">Band Pull-Aparts</Option>
            <Option value="Cycling">Cycling</Option>
            <Option value="Dumbbell Flyes">Dumbbell Flyes</Option>
            <Option value="Leg Press">Leg Press</Option>
            <Option value="Pull-Ups">Pull-Ups</Option>
            <Option value="Rowing">Rowing</Option>
            <Option value="Stair Climbing">Stair Climbing</Option>
            <Option value="Shoulder Press">Shoulder Press</Option>
            <Option value="Triceps Pushdowns">Triceps Pushdowns</Option>
          </Select>

          <label htmlFor="equipment" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Equipment</label>
          <Select
            placeholder="Select Equipment"
            value={equipment}
            onChange={(value) => setEquipment(value)}
            style={{ width: "100%", marginBottom: "15px", borderRadius: "5px" }}
          >
            <Option value="Barbell">Barbell</Option>
            <Option value="Bench">Bench</Option>
            <Option value="Cable Machine">Cable Machine</Option>
            <Option value="Dumbbells">Dumbbells</Option>
            <Option value="Exercise Bike">Exercise Bike</Option>
            <Option value="Lat Pulldown Machine">Lat Pulldown Machine</Option>
            <Option value="Leg Press Machine">Leg Press Machine</Option>
            <Option value="Rowing Machine">Rowing Machine</Option>
            <Option value="Stair Climber">Stair Climber</Option>
            <Option value="Treadmill">Treadmill</Option>
          </Select>

          <label htmlFor="quantity" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Quantity</label>
          <InputNumber
            min={1}
            max={100}
            value={quantity}
            onChange={(value) => setQuantity(value)}
            style={{ width: "100%", marginBottom: "15px", borderRadius: "5px" }}
          />

          <label htmlFor="date" style={{ color: "white", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Date</label>
          <DatePicker
            onChange={(date) => setDate(date?.toDate())} // Ensure it's a Date object
            style={{ width: "100%", marginBottom: "40px", borderRadius: "5px", padding: "8px" }}
          />

          <Form.Item style={{ textAlign: "left", marginTop: "0px" }}>
            <Space size="large">
              <Button type="primary" htmlType="submit">Submit</Button>
              <Button onClick={handleReset} type="default" htmlType="button" style={{ backgroundColor: "white", color: "black", border: "1px solid #d9d9d9" }}>Cancel</Button>
            </Space>
          </Form.Item>

        </form>
      </div>
    </div>
  );
};
