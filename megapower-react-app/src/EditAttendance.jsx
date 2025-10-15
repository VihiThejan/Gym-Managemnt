import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space, Form, DatePicker, TimePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

export const EditAttendance = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [memberid, setMemberId] = useState("");
  const [date, setDate] = useState(null);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/attendance/${id}`);
        const attendance = response.data.data;

        setMemberId(Number(attendance.Member_Id));
        setDate(attendance.Current_date ? moment(attendance.Current_date) : null);
        setInTime(attendance.In_time ? moment(attendance.In_time, 'HH:mm:ss') : null);
        setOutTime(attendance.Out_time ? moment(attendance.Out_time, 'HH:mm:ss') : null);
      } catch (error) {
        console.error(`Error fetching attendance data: ${error.message}`);
      }
    };
    fetchAttendance();
  }, [id]);

  const validateForm = () => {
    if (!memberid || !date || !inTime || !outTime) {
      message.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = date ? date.format('YYYY-MM-DD') : null;
    const formattedInTime = inTime ? inTime.format('HH:mm:ss') : null;
    const formattedOutTime = outTime ? outTime.format('HH:mm:ss') : null;

    const body = {
      Member_Id: Number(memberid),
      Current_date: formattedDate,
      In_time: formattedInTime,
      Out_time: formattedOutTime,
    };

    console.log("Sending update request with body:", body);

    try {
      const res = await axios.put(`http://localhost:5000/api/v1/attendance/update/${id}`, body);
      console.log("Response from server:", res.data);
      message.success("Attendance updated successfully.");
      navigate('/Attendancetable');
    } catch (Err) {
      console.error("Error updating attendance:", Err.response?.data || Err.message);
      message.error("Failed to update Attendance: " + (Err.response?.data?.message || Err.message));
    }
  };

  const handleReset = () => {
    setMemberId('');
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
      <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>
        Edit Attendance
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
          value={memberid}
          name="Id"
          onChange={(e) => setMemberId(e.target.value)}
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
        {formErrors.userid && <p style={{ color: "red" }}>{formErrors.userid}</p>}

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
            value={date}
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
          value={inTime}
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
          value={outTime}
          onChange={(time) => setOutTime(time)}
          minuteStep={15}
          secondStep={10}
          hourStep={1}
          format="HH:mm:ss"
          style={{ width: "100%", borderRadius: "5px", marginBottom: "20px" }}
        />
        {formErrors.outTime && <p style={{ color: "red" }}>{formErrors.outTime}</p>}

        <Form.Item style={{ textAlign: "left", marginTop: "0px" }}>
          <Space size="large">
            <Button type="primary" htmlType="submit"> Update </Button>
            <Button onClick={handleReset} type="default" htmlType="button" style={{ backgroundColor: "white", color: "black", border: "1px solid #d9d9d9" }}> Cancel </Button>
          </Space>
        </Form.Item>
      </form>
    </div>
  );
};