import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message as antMessage } from "antd";
import axios from "axios";

export const ForgotPassword = () => {

  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [otp, setOtp] = useState("");
  
  
  
  const sendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      antMessage.error("Please enter a valid phone number.");
      return;
    }
    
    
        antMessage.info(phoneNumber)
        axios.post('http://localhost:5000/api/v1/auth/forgetpw', {contact: phoneNumber})
        .then(async (data) => {
            console.log(data);
            if (data?.data?.code === 400) {
                alert(data?.data?.message);
            } else if (data?.data?.code === 200) {
              antMessage.success('OTP sent')
            }
        })
        .catch(err => {
            console.error(err.message);
        });
   
  };


  
  const verifyOtp = () => {
    if (!otp) {
      antMessage.error("Please enter the OTP sent to your phone.");
      return;
    }
    localStorage.setItem('contact', phoneNumber);
    axios.post('http://localhost:5000/api/v1/auth/verify', {contact: phoneNumber, otp: otp})
    .then(async (data) => {
        console.log(data);
        if (data?.data?.code === 400) {
            alert(data?.data?.message);
        } else if (data?.data?.code === 200 && data?.data?.data !=null) {
          antMessage.success('OTP verified')
          navigate('/Resetpw');
        }
    })
    .catch(err => {
        console.error(err.message);
    });
   
  };

  return (
    <div className="auth-form-container" style={{ textAlign: 'Center', width: '250px', backgroundColor: "rgba(0, 0, 0, 0.5)",  margin: 'auto' }}>
      <h2 style={{ textAlign: "center", color: "#fff" }}>Phone Authentication</h2>
      <Form layout="vertical">
        <div id="recaptcha-container"></div>

        
        <Form.Item 
          label={<span style={{ color: "#fff" }}>Mobile Number</span>} 
          required
        >
          <PhoneInput
            country={"lk"} 
            value={phoneNumber}
            onChange={(phone) => setPhoneNumber(phone)}
            inputStyle={{
              width: "100%",
              backgroundColor: "#333",
              color: "#fff",
              border: "1px solid #555",
            }}
            buttonStyle={{
              backgroundColor: "#333",
              border: "1px solid #555",
            }}
            placeholder="Enter phone number"
          />
        </Form.Item>

        
        <Form.Item>
          <Button 
            type="primary" 
            onClick={sendOtp} 
            block 
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
          >
            Send OTP
          </Button>
        </Form.Item>

        
        <Form.Item 
          label={<span style={{ color: "#fff" }}>OTP</span>} 
          required
        >
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #555" }}
          />
        </Form.Item>

        
        <Form.Item>
          <Button 
            type="primary" 
            onClick={verifyOtp} 
            block 
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Verify OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
