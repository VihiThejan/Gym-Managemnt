import React, { useState, useEffect } from "react";
import { Button, DatePicker, Select, message, Card, Input, Form } from "antd";
import { 
  DollarOutlined, 
  UserOutlined, 
  GiftOutlined, 
  CalendarOutlined,
  CreditCardOutlined 
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from './components/Layout/MainLayout';
import './Payment.css';

export const Payment = () => {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Fetch member list
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await axios.get("http://localhost:5000/api/v1/member/list");
      const memberData = response?.data?.data || [];
      
      // Format members for Select dropdown
      const formattedMembers = memberData.map(member => ({
        value: member.Member_Id,
        label: `${member.FName} (ID: ${member.Member_Id})`,
        email: member.Email,
        contact: member.Contact
      }));
      
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error("Failed to load members list");
    } finally {
      setLoadingMembers(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    const formattedDate = date ? date.toISOString() : "";

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
      handlePayHerePayment();
    } catch (Err) {
      console.log(Err.message);
      message.error("Failed to register Payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const packageOptions = [
    { value: "1", label: "Basic - Rs. 5,000/month" },
    { value: "2", label: "Standard - Rs. 8,000/month" },
    { value: "3", label: "Premium - Rs. 12,000/month" },
  ];

  const handleReset = () => {
    setId("");
    setPackageId("");
    setAmount("");
    setDate(null);
  };

  return (
    <MainLayout>
      <div className="payment-page">
        <div className="payment-header">
          <div className="header-content">
            <div className="header-icon">
              <CreditCardOutlined />
            </div>
            <div className="header-text">
              <h1>Process Payment</h1>
              <p>Complete your membership payment</p>
            </div>
          </div>
        </div>

        <div className="payment-content">
          <Card className="payment-card">
            <Form onFinish={handleSubmit} layout="vertical">
              <Form.Item>
                <label className="form-label">
                  <UserOutlined className="label-icon" />
                  Select Member
                </label>
                <Select
                  placeholder="Select a member"
                  value={id}
                  onChange={(value) => setId(value)}
                  options={members}
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  loading={loadingMembers}
                  className="member-select"
                />
              </Form.Item>

              <Form.Item>
                <label className="form-label">
                  <GiftOutlined className="label-icon" />
                  Membership Package
                </label>
                <Select
                  placeholder="Select membership package"
                  value={packageId}
                  onChange={(value) => setPackageId(value)}
                  options={packageOptions}
                  size="large"
                  className="package-select"
                />
              </Form.Item>

              <Form.Item>
                <label className="form-label">
                  <DollarOutlined className="label-icon" />
                  Amount (LKR)
                </label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  size="large"
                  prefix="Rs."
                  type="number"
                />
              </Form.Item>

              <Form.Item>
                <label className="form-label">
                  <CalendarOutlined className="label-icon" />
                  Payment Date
                </label>
                <DatePicker
                  onChange={(date) => setDate(date)}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Select payment date"
                />
              </Form.Item>

              <Form.Item className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  disabled={submitting}
                  icon={<CreditCardOutlined />}
                  className="submit-button"
                >
                  {submitting ? 'Processing...' : 'Submit & Pay'}
                </Button>
                <Button
                  onClick={handleReset}
                  size="large"
                  className="cancel-button"
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <div className="payment-info">
            <Card className="info-card">
              <h3>Payment Information</h3>
              <ul>
                <li>💳 Secure payment gateway powered by PayHere</li>
                <li>✅ Your payment details are encrypted and secure</li>
                <li>📧 Receipt will be sent to your registered email</li>
                <li>🔄 Membership activates immediately after payment</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
