import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DatePicker, Select, Space, InputNumber, Input, Form, message } from 'antd';
import axios from "axios";
import moment from "moment";



const { Option } = Select;

export const EditSchedule = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [staffId, setStaffId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [exercise, setExercise] = useState('');
  const [equipment, setEquipment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(null);


  useEffect(() => {
    const fetchSchedule = async () => {
       try {
          const response = await axios.get(`http://localhost:5000/api/v1/schedule/${id}`);
          const schedule = response.data.data;
          
          setStaffId(Number(schedule.Staff_ID));
          setMemberId(Number(schedule.Member_ID));
          setExercise(schedule.EName);
          setEquipment(schedule.Equipment);
          setQuantity(Number(schedule.Quantity));
          setDate(schedule.Date_Time ? moment(schedule.Date_Time) : null);


       } catch (error) {
          console.error(`Error fetching schedule data: ${error.message}`);
       }
    };
    fetchSchedule();
 }, [id]);



 const validateForm = () => {
    if (!staffId || !memberId || !exercise || !equipment || !quantity || !date) {
      message.error("All fields are required.");
      return false;
    }
  
    if (isNaN(staffId) || isNaN(memberId)) {
      message.error("Staff ID and Member ID must be valid numbers.");
      return false;
    }
  
    return true;
  };
  



 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = date ? date.toISOString() : null;

    const body = {

       Staff_ID: staffId,
       Member_ID: memberId,
       EName: exercise,
       Equipment: equipment,
       Quantity: quantity,
       Date_Time: formattedDate,
    };

    console.log("Sending update request with body:", body);

    try {
       const res = await axios.put(`http://localhost:5000/api/v1/schedule/update/${id}`, body);
       console.log("Response from server:", res.data);
       message.success("Schedule updated successfully.");
       navigate('/Scheduletable');
    } catch (Err) {
       console.error("Error updating schedule:", Err.response?.data || Err.message);
       message.error("Failed to update Schedule: " + (Err.response?.data?.message || Err.message));
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
          Edit Schedule
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
            onChange={(date) => setDate(date?.toDate())} 
            style={{ width: "100%", marginBottom: "40px", borderRadius: "5px", padding: "8px" }}
          />

                <Form.Item style={{ textAlign: "left", marginTop: "0px" }}>
                  <Space size="large">
                       <Button type="primary" htmlType="submit"> Update </Button>
                       <Button onClick={handleReset} type="default" htmlType="button" style={{ backgroundColor: "white", color: "black", border: "1px solid #d9d9d9" }}> Cancel </Button>
                   </Space>
                </Form.Item>

        </form>
      </div>
    </div>
  );
};
