import React, { useState, useEffect } from "react";
import { Button, DatePicker, Space, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Payment = () => {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);

  // Ensure PayHere is available
  useEffect(() => {
    if (!window.payhere) {
      console.error("PayHere script not loaded!");
    }
  }, []);

  const handlePayHerePayment = () => {
    if (!window.payhere) {
      message.error("Payment gateway is not available. Please try again later.");
      return;
    }

    const payment = {
      sandbox: true, // Change to false in production
      merchant_id: "1229586", // Replace with your PayHere Merchant ID
      return_url: "http://localhost:3000/payment-success", // Success redirect
      cancel_url: "http://localhost:3000/payment-cancel", // Cancel redirect
      notify_url: "http://localhost:5000/api/v1/payment/notify", // Backend webhook

      order_id: `ORDER_${new Date().getTime()}`, // Unique order ID
      items: "Gym Membership", // Description
      amount: amount, // Payment amount
      currency: "LKR", // Currency
      first_name: "John",
      last_name: "Doe",
      email: "janithchanuka68@gmail.com",
      phone: "0710451944",
      address: "Colombo",
      city: "Colombo",
      country: "Sri Lanka",
    };

    window.payhere.onCompleted = function (orderId) {
      console.log("Payment completed. OrderID:", orderId);
      message.success("Payment Successful!");
      navigate("/Paymenttable");
    };

    window.payhere.onDismissed = function () {
      console.log("Payment dismissed");
      message.warning("Payment was canceled.");
    };

    window.payhere.onError = function (error) {
      console.log("Payment error:", error);
      message.error("Payment failed.");
    };

    window.payhere.startPayment(payment);
  };

  const validateForm = () => {
    if (!id || !packageId || !amount || !date) {
      message.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = date ? date.toISOString() : ""; // Fixed the undefined error

    const body = {
      memberId: id,
      packageId: packageId,
      amount: amount,
      date: formattedDate,
    };

    console.log("Sending payload:", body);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/payment/create",
        body
      );
      console.log(res?.data?.data);
      message.success("Payment registered successfully.");
      handlePayHerePayment(); // Call PayHere payment after successful registration
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to register Payment.");
    }
  };

  const handleDateChange = (date, dateString) => {
    console.log("Selected date:", dateString);
    setDate(date);
  };

  const packageOptions = [
    { value: "1", label: "Gold (id 1)" },
    { value: "2", label: "Silver (id 2)" },
    { value: "3", label: "Platinum (id 3)" },
  ];

  const handleReset = () => {
    setId("");
    setPackageId("");
    setAmount("");
    setDate(null);
  };

  return (
    <div
      className="auth-form-container"
      style={{
        width: "300px",
        margin: "auto",
        padding: "25px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "30px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        textAlign: "left",
      }}
    >
      <h2 style={{ color: "white", textAlign: "center", marginBottom: "25px" }}>
        Payment
      </h2>
      <form className="Payment-form" onSubmit={handleSubmit}>
        <label
          htmlFor="MemberId"
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
          name="MemberId"
          onChange={(e) => setId(e.target.value)}
          id="MemberId"
          placeholder="Member Id"
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        <label
          htmlFor="PackageId"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Package
        </label>
        <Select
          id="PackageId"
          placeholder="Select a package"
          value={packageId}
          onChange={(value) => setPackageId(value)}
          options={packageOptions}
          style={{
            width: "100%",
            marginBottom: "20px",
          }}
        />

        <label
          htmlFor="Amount"
          style={{
            fontWeight: "bold",
            color: "white",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Amount
        </label>
        <input
          value={amount}
          name="Amount"
          onChange={(e) => setAmount(e.target.value)}
          id="Amount"
          placeholder="Amount"
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

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
        <Space
          direction="vertical"
          style={{ width: "100%", marginBottom: "20px" }}
        >
          <DatePicker
            onChange={handleDateChange}
            style={{ width: "100%", borderRadius: "5px" }}
          />
        </Space>

        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <Space size="large">
            <Button type="primary" htmlType="submit">
              Submit & Pay
            </Button>
            <Button onClick={handleReset} type="default">
              Cancel
            </Button>
          </Space>
        </div>
      </form>
    </div>
  );
};
