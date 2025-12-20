import React, { useEffect } from 'react';
import { Result, Button } from 'antd';
import { CheckCircleOutlined, StarOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './RatingSubmitted.css';

export const RatingSubmitted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add confetti effect or animation trigger here if needed
  }, []);

  const handleBackToDashboard = () => {
    navigate('/MemberDashboard');
  };

  const handleRateAnother = () => {
    navigate('/Trainerrate');
  };

  const handleViewRatings = () => {
    navigate('/Trainerratetable');
  };

  return (
    <div className="rating-submitted-container">
      <div className="rating-submitted-content">
        <div className="success-icon-wrapper">
          <CheckCircleOutlined className="success-icon" />
          <div className="success-circle"></div>
          <div className="success-circle-2"></div>
        </div>

        <Result
          status="success"
          title={
            <div className="success-title">
              <h1>Rating Submitted Successfully!</h1>
              <p className="success-subtitle">
                Thank you for taking the time to rate your trainer. Your feedback helps us maintain quality service!
              </p>
            </div>
          }
          extra={
            <div className="action-buttons">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={handleBackToDashboard}
                className="primary-btn"
              >
                Back to Dashboard
              </Button>
              <Button
                size="large"
                icon={<StarOutlined />}
                onClick={handleRateAnother}
                className="secondary-btn"
              >
                Rate Another Trainer
              </Button>
            </div>
          }
        />

        <div className="info-cards">
          <div className="info-card">
            <StarOutlined className="info-icon" />
            <h3>Your Voice Matters</h3>
            <p>Your rating helps trainers improve and assists other members in choosing the right trainer.</p>
          </div>
          <div className="info-card">
            <CheckCircleOutlined className="info-icon" />
            <h3>Transparent Reviews</h3>
            <p>All ratings are reviewed to ensure authenticity and maintain our community standards.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingSubmitted;
