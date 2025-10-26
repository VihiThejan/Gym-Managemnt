import React, { useState } from "react";
import { Button, Space, Form, Rate, Input, message } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const { TextArea } = Input;

export const Trainerrate = () => {
  const [id, setId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/Trainerratetable');
  };

  const validateForm = () => {
    if (!id || !staffId || !rating || !comment) {
      message.error("Please fill in all required fields.");
      return false;
    }
    return true; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const body = {
      staffId: staffId,
      memberId: id,
      rating: rating,
      comment: comment,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/trainerrate/create', body);
      console.log(res?.data?.data);
      message.success("Trainer rating submitted successfully.");
      navigate('/Trainerratetable');
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to submit trainer rating.");
    }
  };

  const handleReset = () => {
    setId("");
    setStaffId("");
    setRating(0);
    setComment("");
  };

  return (
    <div
      className="auth-form-container"
      style={{
        padding: "40px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        maxWidth: "550px",
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
      <h2 style={{ color: "white", textAlign: "center", marginBottom: "40px" }}>
        Ratings
      </h2>
      <form
        className="Trainerrate-form"
        onSubmit={handleSubmit}
        style={{ textAlign: "left" }}
      >
        <label
          htmlFor="memberId"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Member ID
        </label>
        <input
          value={id}
          name="memberId"
          onChange={(e) => setId(e.target.value)}
          id="memberId"
          placeholder="Enter Member ID"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
        />

        <label
          htmlFor="staffId"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Staff ID
        </label>
        <input
          value={staffId}
          name="staffId"
          onChange={(e) => setStaffId(e.target.value)}
          id="staffId"
          placeholder="Enter Staff ID"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
        />

        <label
          htmlFor="rating"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Rating
        </label>
        <Rate
          value={rating}
          onChange={setRating}
          style={{
            marginBottom: "20px",
            backgroundColor: "#999999"
          }}
          className="custom-rate"
        />

        <label
          htmlFor="comment"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Comment
        </label>
        <TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Write your comment here..."
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
        />

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
  );
};
