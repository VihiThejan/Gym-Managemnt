import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Button, Typography, Descriptions, Badge, Card, Result, Space, Timeline, Divider 
} from 'antd';
import { 
  CheckCircleOutlined, DashboardOutlined, HomeOutlined, 
  DollarOutlined, CalendarOutlined, CreditCardOutlined,
  FileTextOutlined, GiftOutlined, TrophyOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './PaymentSuccess.css';

const { Title, Paragraph, Text } = Typography;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confetti, setConfetti] = useState(true);
  
  // Get payment details from navigation state
  const paymentDetails = location.state || {
    selectedPackage: 'Gold',
    amount: 12000,
    paymentMethod: 'Stripe',
    date: new Date().toISOString(),
    transactionId: `TXN${Date.now()}`
  };

  useEffect(() => {
    // If no payment details, redirect to payment page
    if (!location.state) {
      console.warn('No payment details found, using default values');
    }

    // Auto-hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const getPackageIcon = (packageName) => {
    switch(packageName?.toLowerCase()) {
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '🎁';
    }
  };

  const getPackageColor = (packageName) => {
    switch(packageName?.toLowerCase()) {
      case 'gold':
        return '#ffd700';
      case 'silver':
        return '#c0c0c0';
      case 'bronze':
        return '#cd7f32';
      default:
        return '#667eea';
    }
  };

  return (
    <div className="payment-success-container">
      {confetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#667eea', '#52c41a', '#ffd700', '#ff4d4f', '#1890ff'][Math.floor(Math.random() * 5)]
            }} />
          ))}
        </div>
      )}

      <div className="success-content-wrapper">
        <Card className="success-main-card">
          {/* Success Icon and Title */}
          <div className="success-header">
            <div className="success-icon-wrapper">
              <div className="success-icon-circle">
                <CheckCircleOutlined className="success-check-icon" />
              </div>
              <div className="success-pulse-ring"></div>
              <div className="success-pulse-ring-delayed"></div>
            </div>
            
            <Title level={1} className="success-main-title">
              Payment Successful!
            </Title>
            
            <Paragraph className="success-subtitle">
              🎉 Congratulations! Your payment has been processed successfully.
            </Paragraph>
          </div>

          <Divider />

          {/* Transaction Summary */}
          <div className="transaction-summary">
            <div className="amount-display">
              <Text className="amount-label">Amount Paid</Text>
              <Title level={2} className="amount-value">
                Rs. {paymentDetails.amount?.toLocaleString()}
              </Title>
            </div>

            <Descriptions 
              bordered 
              column={1} 
              className="payment-details"
              labelStyle={{ fontWeight: 600, fontSize: '15px', background: '#fafafa' }}
              contentStyle={{ fontSize: '15px' }}
            >
              <Descriptions.Item 
                label={<><GiftOutlined /> Package</>}
              >
                <Space>
                  <span style={{ fontSize: '20px' }}>{getPackageIcon(paymentDetails.selectedPackage)}</span>
                  <strong>{paymentDetails.selectedPackage} Package</strong>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item 
                label={<><CreditCardOutlined /> Payment Method</>}
              >
                {paymentDetails.paymentMethod || 'Stripe Card Payment'}
              </Descriptions.Item>

              <Descriptions.Item 
                label={<><CalendarOutlined /> Transaction Date</>}
              >
                {moment(paymentDetails.date).format('MMMM DD, YYYY [at] hh:mm A')}
              </Descriptions.Item>

              <Descriptions.Item 
                label={<><FileTextOutlined /> Transaction ID</>}
              >
                <Text code copyable>{paymentDetails.transactionId}</Text>
              </Descriptions.Item>

              <Descriptions.Item 
                label={<><CheckCircleOutlined /> Status</>}
              >
                <Badge 
                  status="success" 
                  text={<strong style={{ color: '#52c41a', fontSize: '15px' }}>Completed</strong>} 
                />
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* Next Steps Timeline */}
          <div className="next-steps-section">
            <Title level={4} className="section-title">
              <TrophyOutlined /> What's Next?
            </Title>
            
            <Timeline
              className="next-steps-timeline"
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <strong>Membership Activated</strong>
                      <br />
                      <Text type="secondary">
                        Your {paymentDetails.selectedPackage} membership is now active and ready to use
                      </Text>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <strong>Email Confirmation</strong>
                      <br />
                      <Text type="secondary">
                        A receipt has been sent to your registered email address
                      </Text>
                    </div>
                  ),
                },
                {
                  color: 'purple',
                  children: (
                    <div>
                      <strong>Visit the Gym</strong>
                      <br />
                      <Text type="secondary">
                        Show your membership ID at reception and start your fitness journey
                      </Text>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div>
                      <strong>Enjoy Premium Benefits</strong>
                      <br />
                      <Text type="secondary">
                        Access all facilities and features included in your package
                      </Text>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <Divider />

          {/* Action Buttons */}
          <div className="success-actions">
            <Button
              type="primary"
              size="large"
              icon={<DashboardOutlined />}
              onClick={() => navigate('/MemberDashboard')}
              className="primary-action-btn"
            >
              Go to Dashboard
            </Button>
            
            <Button
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/MemberDashboard')}
              className="secondary-action-btn"
            >
              Back to Home
            </Button>

            <Button
              size="large"
              icon={<DollarOutlined />}
              onClick={() => navigate('/MemberPayment')}
              className="secondary-action-btn"
            >
              Make Another Payment
            </Button>
          </div>

          {/* Footer Note */}
          <div className="success-footer-note">
            <Text type="secondary" className="footer-text">
              💡 <strong>Need Help?</strong> Contact our support team at support@megapowergym.com or call +94 77 123 4567
            </Text>
          </div>
        </Card>

        {/* Additional Info Cards */}
        <div className="info-cards-grid">
          <Card className="info-card" hoverable>
            <div className="info-card-content">
              <div className="info-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <TrophyOutlined />
              </div>
              <Title level={5}>Track Progress</Title>
              <Text type="secondary">Monitor your fitness journey and achievements</Text>
            </div>
          </Card>

          <Card className="info-card" hoverable>
            <div className="info-card-content">
              <div className="info-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <CalendarOutlined />
              </div>
              <Title level={5}>Book Sessions</Title>
              <Text type="secondary">Schedule personal training sessions anytime</Text>
            </div>
          </Card>

          <Card className="info-card" hoverable>
            <div className="info-card-content">
              <div className="info-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <FileTextOutlined />
              </div>
              <Title level={5}>Payment History</Title>
              <Text type="secondary">View all your transactions and receipts</Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
