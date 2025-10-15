import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space, DatePicker, InputNumber, Form, message, Select, Input } from 'antd';
import axios from "axios";
import moment from "moment";

const { TextArea } = Input;

export const EditEquipment = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [qty, setQty] = useState(0);
    const [date, setDate] = useState(null);
    const [vendor, setVendor] = useState('');
    const [description, setDescription] = useState('');

    const vendors = ["Big Bosa Gym Fitness Equipment", "Eser Marketing International", "GS Sports", "Mansa Fitness Equipment"];
    const equipmentNames = ["Barbell", "Bench", "Cable Machine", "Dumbell", "Exercise Bike", "Lat Pulldown Machine", "Leg Press Machines", "Rowing Machine", "Stair Climber", "Treadmill"];

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/equipment/${id}`);
                const equipment = response.data.data;

                setName(equipment.EName);
                setQty(equipment.Qty);
                setVendor(equipment.Vendor);
                setDescription(equipment.Description);
                setDate(equipment.Date ? moment(equipment.Date) : null);
            } catch (error) {
                console.error(`Error fetching equipment data: ${error.message}`);
            }
        };
        fetchEquipment();
    }, [id]);

    const validateName = (name) => {
        if (!name) {
            return 'Equipment Name is required.';
        }
        return '';
    };

    const validateForm = () => {
        if (!name || !qty || !date || !vendor || !description) {
            message.error("Please fill in all required fields.");
            return false;
        }
        const nameErrorMsg = validateName(name);
        if (nameErrorMsg) {
            setNameError(nameErrorMsg);
            return false;
        } else {
            setNameError('');
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        const formattedDate = date ? date.toISOString() : null;
    
        const body = {
            EName: name,
            Qty: qty, 
            Vendor: vendor, 
            Description: description, 
            Date: formattedDate, 
        };
    
        console.log("Sending update request with body:", body); 
    
        try {
            const res = await axios.put(`http://localhost:5000/api/v1/equipment/update/${id}`, body);
            console.log("Response from server:", res.data); 
            message.success("Equipment updated successfully.");
            navigate('/Equipmenttable');
        } catch (Err) {
            console.error("Error updating equipment:", Err.response?.data || Err.message); 
            message.error("Failed to update Equipment: " + (Err.response?.data?.message || Err.message));
        }
    };

    const handleReset = () => {
        setName('');
        setQty(0);
        setVendor('');
        setDescription('');
        setDate(null);
        setNameError('');
    };

    const handleChangeQty = (value) => {
        setQty(value);
    };

    const handleVendorChange = (value) => {
        setVendor(value);
    };

    const handleNameChange = (value) => {
        setName(value);
    };

    return (
        <div className="auth-form-container" style={{ padding: "50px", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "15px", boxShadow: "10px 10px 12px rgba(0, 0, 0, 0.3)", maxWidth: "500px", margin: "auto", height: "600px" }}>
            <div style={{ textAlign: 'left', width: '100%' }}>
                <h2 style={{ textAlign: "center", marginBottom: "50px", marginTop: "0px", borderRadius: "50px", maxWidth: "100%", color: "white" }}> Edit Equipment</h2>
                <form className="Equipment-form" onSubmit={handleSubmit}>
                    <label htmlFor="name" style={{ color: "white", fontWeight: "bold", marginBottom: "4px", display: "block" }}>Equipment Name</label>
                    <Select value={name} onChange={handleNameChange} placeholder="Select an equipment name" style={{ width: '100%', marginBottom: "15px" }}>
                        {equipmentNames.map((e, index) => (
                            <Select.Option key={index} value={e}>{e}</Select.Option>
                        ))}
                    </Select>
                    {nameError && <p style={{ color: 'red', marginBottom: "20px" }}>{nameError}</p>}

                    <label htmlFor="Quantity" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Quantity</label>
                    <InputNumber min={1} max={100} value={qty} onChange={handleChangeQty} style={{ width: '100%', marginBottom: "15px" }} /><br />

                    <label htmlFor="vendor" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Vendor</label>
                    <Select value={vendor} onChange={handleVendorChange} placeholder="Select a vendor" style={{ width: '100%', marginBottom: "15px" }}>
                        {vendors.map((v, index) => (
                            <Select.Option key={index} value={v}>{v}</Select.Option>
                        ))}
                    </Select>

                    <label htmlFor="Description" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Description</label>
                    <TextArea value={description} name="Description" onChange={(e) => setDescription(e.target.value)} id="Description" placeholder="Description" style={{ width: '100%', marginBottom: "15px" }} /><br />

                    <label htmlFor="Date" style={{ color: "white", fontWeight: "bold", marginBottom: "5px", display: "block" }}>Date</label>
                    <Space direction="vertical" style={{ width: '100%', marginBottom: "40px" }}>
                        <DatePicker onChange={(date) => setDate(date)} style={{ width: '100%' }} value={date} />
                    </Space><br />

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
