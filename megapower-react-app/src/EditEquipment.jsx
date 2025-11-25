import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, DatePicker, Form, message, Select, Input, Card } from 'antd';
import { SaveOutlined, CloseOutlined, EditOutlined, CalendarOutlined, ShoppingOutlined, 
         TagsOutlined, NumberOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import MainLayout from './components/Layout/MainLayout';
import './EditEquipment.css';

const { TextArea } = Input;

export const EditEquipment = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [qty, setQty] = useState(0);
    const [date, setDate] = useState(null);
    const [vendor, setVendor] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const vendors = ["Big Bosa Gym Fitness Equipment", "Eser Marketing International", "GS Sports", "Mansa Fitness Equipment"];
    const equipmentNames = ["Barbell", "Bench", "Cable Machine", "Dumbell", "Exercise Bike", "Lat Pulldown Machine", "Leg Press Machines", "Rowing Machine", "Stair Climber", "Treadmill"];

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/v1/equipment/${id}`);
                const equipment = response.data.data;

                setName(equipment.EName);
                setQty(equipment.Qty);
                setVendor(equipment.Vendor);
                setDescription(equipment.Description);
                setDate(equipment.Date ? moment(equipment.Date) : null);
                setLoading(false);
            } catch (error) {
                console.error(`Error fetching equipment data: ${error.message}`);
                message.error('Failed to load equipment data');
                setLoading(false);
            }
        };
        fetchEquipment();
    }, [id]);

    const handleSubmit = async () => {
        if (!name || !qty || !date || !vendor || !description) {
            message.error("Please fill in all required fields.");
            return;
        }
        
        try {
            setSubmitting(true);

            const formattedDate = date ? date.toISOString() : null;
        
            const body = {
                EName: name,
                Qty: qty, 
                Vendor: vendor, 
                Description: description, 
                Date: formattedDate, 
            };
        
            await axios.put(`http://localhost:5000/api/v1/equipment/update/${id}`, body);
            message.success("Equipment updated successfully!");
            
            setTimeout(() => {
                navigate('/Equipmenttable');
            }, 1500);
        } catch (Err) {
            console.error("Error updating equipment:", Err.response?.data || Err.message); 
            message.error("Failed to update Equipment: " + (Err.response?.data?.message || Err.message));
            setSubmitting(false);
        }
    };

    return (
        <MainLayout showSidebar={true} showNavigation={false}>
            <div className="edit-equipment-page">
                <div className="edit-equipment-content">
                    <Card className="edit-equipment-card" loading={loading}>
                        <div className="card-header">
                            <div className="header-icon-card">
                                <EditOutlined className="header-icon" />
                            </div>
                            <div className="header-text">
                                <h2 className="card-title">Edit Equipment</h2>
                                <p className="card-subtitle">Update gym equipment details and inventory information</p>
                            </div>
                        </div>

                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                label={
                                    <span className="form-label">
                                        <TagsOutlined className="label-icon" />
                                        Equipment Name
                                    </span>
                                }
                                required
                            >
                                <Select 
                                    value={name} 
                                    onChange={(value) => setName(value)} 
                                    placeholder="Select equipment name"
                                    size="large"
                                    className="form-select"
                                    required
                                >
                                    {equipmentNames.map((e, index) => (
                                        <Select.Option key={index} value={e}>{e}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="form-label">
                                        <NumberOutlined className="label-icon" />
                                        Quantity
                                    </span>
                                }
                                required
                            >
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    placeholder="Enter quantity"
                                    size="large"
                                    className="form-input"
                                    required
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="form-label">
                                        <ShoppingOutlined className="label-icon" />
                                        Vendor
                                    </span>
                                }
                                required
                            >
                                <Select 
                                    value={vendor} 
                                    onChange={(value) => setVendor(value)} 
                                    placeholder="Select vendor"
                                    size="large"
                                    className="form-select"
                                    required
                                >
                                    {vendors.map((v, index) => (
                                        <Select.Option key={index} value={v}>{v}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="form-label">
                                        <FileTextOutlined className="label-icon" />
                                        Description
                                    </span>
                                }
                                required
                            >
                                <TextArea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter equipment description"
                                    rows={4}
                                    maxLength={500}
                                    showCount
                                    className="form-textarea"
                                    required
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="form-label">
                                        <CalendarOutlined className="label-icon" />
                                        Purchase Date
                                    </span>
                                }
                                required
                            >
                                <DatePicker
                                    value={date}
                                    onChange={(date) => setDate(date)}
                                    style={{ width: "100%" }}
                                    size="large"
                                    className="form-input"
                                    format="YYYY-MM-DD"
                                    required
                                />
                            </Form.Item>

                            <div className="form-actions">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    size="large"
                                    className="submit-button"
                                    loading={submitting}
                                >
                                    {submitting ? 'Updating...' : 'Update Equipment'}
                                </Button>
                                <Button
                                    type="default"
                                    icon={<CloseOutlined />}
                                    size="large"
                                    className="cancel-button"
                                    onClick={() => navigate('/Equipmenttable')}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};
