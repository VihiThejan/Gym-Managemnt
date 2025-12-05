import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Button, Modal, Form, Input, Select, DatePicker, Table, Statistic, Row, Col, Tabs, message, Tag, Progress } from 'antd';
import {
  MenuUnfoldOutlined,
  UserOutlined,
  DollarOutlined,
  NotificationOutlined,
  CalendarOutlined,
  MessageOutlined,
  ScheduleOutlined,
  StarOutlined,
  TrophyOutlined,
  PlusOutlined,
  FireOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Logo from './components/Logo';
import './WorkoutTracker.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, #1a1f3a 0%, #2d1b4e 100%)',
};

const items = [
  { label: 'Dashboard', icon: <MenuUnfoldOutlined />, key: '1', path: '/MemberDashboard' },
  { label: 'My Profile', icon: <UserOutlined />, key: '2', path: '/MemberProfile' },
  { label: 'Payment', icon: <DollarOutlined />, key: '3', path: '/MemberPayment' },
  { label: 'Announcements', icon: <NotificationOutlined />, key: '4', path: '/MemberAnnouncements' },
  { label: 'My Attendance', icon: <CalendarOutlined />, key: '5', path: '/MemberAttendance' },
  { label: 'Appointments', icon: <ScheduleOutlined />, key: '7', path: '/MemberAppointment' },
  { label: 'Chat', icon: <MessageOutlined />, key: '8', path: '/chat' },
  { label: 'Rate Trainer', icon: <StarOutlined />, key: '9', path: '/Trainerrate' },
  { label: 'Workout Tracker', icon: <TrophyOutlined />, key: '10', path: '/WorkoutTracker' },
];

const exerciseCategories = [
  'Cardio',
  'Strength',
  'Flexibility',
  'HIIT',
  'CrossFit',
  'Yoga',
  'Pilates',
  'Swimming',
  'Cycling',
  'Running',
];

const exercises = {
  Cardio: ['Treadmill', 'Elliptical', 'Rowing Machine', 'Stair Climber', 'Jump Rope', 'Running', 'Cycling'],
  Strength: ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Pull-ups', 'Rows', 'Bicep Curls', 'Tricep Dips', 'Leg Press', 'Shoulder Press'],
  Flexibility: ['Stretching', 'Foam Rolling', 'Dynamic Stretching', 'Static Stretching'],
  HIIT: ['Burpees', 'Mountain Climbers', 'Box Jumps', 'Sprints', 'Battle Ropes'],
  CrossFit: ['WOD', 'AMRAP', 'EMOM', 'For Time'],
  Yoga: ['Vinyasa', 'Hatha', 'Power Yoga', 'Yin Yoga', 'Hot Yoga'],
  Pilates: ['Mat Pilates', 'Reformer', 'Core Work'],
  Swimming: ['Freestyle', 'Breaststroke', 'Backstroke', 'Butterfly'],
  Cycling: ['Spin Class', 'Outdoor Cycling', 'Stationary Bike'],
  Running: ['Treadmill', 'Outdoor Run', 'Intervals', 'Long Distance'],
};

export const WorkoutTracker = () => {
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalCalories: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleMenuClick = ({ key }) => {
    const selectedItem = items.find(item => item.key === key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const user = JSON.parse(loginData);
        const memberId = user.Member_Id;
        
        // Mock data for now - replace with actual API call
        const mockWorkouts = [
          {
            id: 1,
            date: '2025-12-03',
            category: 'Strength',
            exercise: 'Bench Press',
            sets: 4,
            reps: 10,
            weight: 80,
            duration: 45,
            calories: 250,
            notes: 'Felt strong today',
          },
          {
            id: 2,
            date: '2025-12-02',
            category: 'Cardio',
            exercise: 'Running',
            sets: 1,
            reps: null,
            weight: null,
            duration: 30,
            calories: 300,
            notes: '5K run',
          },
          {
            id: 3,
            date: '2025-12-01',
            category: 'Strength',
            exercise: 'Squat',
            sets: 5,
            reps: 8,
            weight: 100,
            duration: 50,
            calories: 280,
            notes: 'New PR!',
          },
        ];
        
        setWorkouts(mockWorkouts);
        calculateStats(mockWorkouts);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      message.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (workoutData) => {
    const now = dayjs();
    const weekAgo = now.subtract(7, 'day');
    const monthAgo = now.subtract(30, 'day');

    const thisWeek = workoutData.filter(w => dayjs(w.date).isAfter(weekAgo)).length;
    const thisMonth = workoutData.filter(w => dayjs(w.date).isAfter(monthAgo)).length;
    const totalCalories = workoutData.reduce((sum, w) => sum + (w.calories || 0), 0);

    setStats({
      totalWorkouts: workoutData.length,
      thisWeek,
      thisMonth,
      totalCalories,
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedCategory('');
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const loginData = localStorage.getItem('login');
      const user = JSON.parse(loginData);
      
      const workoutData = {
        ...values,
        memberId: user.Member_Id,
        date: values.date.format('YYYY-MM-DD'),
      };

      // TODO: Replace with actual API call
      // await axios.post('http://localhost:5000/api/v1/workout/create', workoutData);
      
      // Mock implementation
      const newWorkout = {
        id: workouts.length + 1,
        ...workoutData,
        date: workoutData.date,
      };
      
      setWorkouts([newWorkout, ...workouts]);
      calculateStats([newWorkout, ...workouts]);
      
      message.success('Workout logged successfully!');
      handleCancel();
    } catch (error) {
      console.error('Error logging workout:', error);
      message.error('Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const getPersonalRecords = () => {
    const records = {};
    workouts.forEach(workout => {
      const key = `${workout.category}-${workout.exercise}`;
      if (workout.weight) {
        if (!records[key] || workout.weight > records[key].weight) {
          records[key] = workout;
        }
      }
    });
    return Object.values(records);
  };

  const getChartData = () => {
    const last30Days = workouts
      .filter(w => dayjs(w.date).isAfter(dayjs().subtract(30, 'day')))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      labels: last30Days.map(w => dayjs(w.date).format('MMM DD')),
      datasets: [
        {
          label: 'Calories Burned',
          data: last30Days.map(w => w.calories || 0),
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const getWeightProgressData = () => {
    const strengthWorkouts = workouts
      .filter(w => w.category === 'Strength' && w.weight)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const exerciseData = {};
    strengthWorkouts.forEach(w => {
      if (!exerciseData[w.exercise]) {
        exerciseData[w.exercise] = [];
      }
      exerciseData[w.exercise].push({ date: w.date, weight: w.weight });
    });

    return exerciseData;
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="purple">{category}</Tag>,
    },
    {
      title: 'Exercise',
      dataIndex: 'exercise',
      key: 'exercise',
    },
    {
      title: 'Sets',
      dataIndex: 'sets',
      key: 'sets',
    },
    {
      title: 'Reps',
      dataIndex: 'reps',
      key: 'reps',
      render: (reps) => reps || '-',
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight) => weight ? `${weight} kg` : '-',
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
      render: (calories) => <Tag color="gold">{calories} cal</Tag>,
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Layout hasSider className="workout-tracker-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={250}
        style={siderStyle}
        className="dashboard-sider"
      >
        <div className="logo-container">
          <Logo size="small" showText={!collapsed} variant="white" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['10']}
          onClick={handleMenuClick}
          className="dashboard-menu"
        >
          {items.map(({ label, icon, key }) => (
            <Menu.Item key={key} icon={icon}>
              {label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout style={{ marginInlineStart: collapsed ? 80 : 250 }}>
        <Header className="workout-tracker-header">
          <div className="header-content">
            <div className="header-title">
              <TrophyOutlined className="header-icon" />
              <div>
                <h1 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                  Workout Tracker
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '14px' }}>
                  Track your progress and crush your goals
                </p>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={showModal}
              className="log-workout-btn"
            >
              Log Workout
            </Button>
          </div>
        </Header>

        <Content className="workout-tracker-content">
          {/* Stats Cards */}
          <Row gutter={[24, 24]} className="stats-row">
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card stat-card-1">
                <FireOutlined className="stat-icon" />
                <Statistic
                  title="Total Workouts"
                  value={stats.totalWorkouts}
                  valueStyle={{ color: 'white', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card stat-card-2">
                <ThunderboltOutlined className="stat-icon" />
                <Statistic
                  title="This Week"
                  value={stats.thisWeek}
                  valueStyle={{ color: 'white', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card stat-card-3">
                <RiseOutlined className="stat-icon" />
                <Statistic
                  title="This Month"
                  value={stats.thisMonth}
                  valueStyle={{ color: 'white', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card stat-card-4">
                <LineChartOutlined className="stat-icon" />
                <Statistic
                  title="Total Calories"
                  value={stats.totalCalories}
                  suffix="cal"
                  valueStyle={{ color: 'white', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Main Content Tabs */}
          <Card className="main-content-card">
            <Tabs defaultActiveKey="1" className="workout-tabs">
              <TabPane tab="Workout History" key="1">
                <Table
                  columns={columns}
                  dataSource={workouts}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              </TabPane>

              <TabPane tab="Progress Charts" key="2">
                <Row gutter={[24, 24]}>
                  <Col xs={24}>
                    <Card title="Calories Burned (Last 30 Days)" className="chart-card">
                      <div style={{ height: '300px' }}>
                        <Line data={getChartData()} options={chartOptions} />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Personal Records" key="3">
                <Row gutter={[16, 16]}>
                  {getPersonalRecords().map((record, index) => (
                    <Col xs={24} sm={12} lg={8} key={index}>
                      <Card className="pr-card">
                        <div className="pr-header">
                          <TrophyOutlined style={{ fontSize: '32px', color: '#ffd700' }} />
                          <Tag color="gold">PR</Tag>
                        </div>
                        <h3>{record.exercise}</h3>
                        <p className="pr-weight">{record.weight} kg</p>
                        <p className="pr-details">
                          {record.sets} sets × {record.reps} reps
                        </p>
                        <p className="pr-date">
                          {dayjs(record.date).format('MMM DD, YYYY')}
                        </p>
                      </Card>
                    </Col>
                  ))}
                  {getPersonalRecords().length === 0 && (
                    <Col span={24}>
                      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        <TrophyOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
                        <p>No personal records yet. Start logging workouts to track your PRs!</p>
                      </div>
                    </Col>
                  )}
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>

      {/* Log Workout Modal */}
      <Modal
        title="Log New Workout"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="workout-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="workout-form"
        >
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select workout date' }]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select
              placeholder="Select workout category"
              onChange={(value) => setSelectedCategory(value)}
            >
              {exerciseCategories.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Exercise"
            name="exercise"
            rules={[{ required: true, message: 'Please select exercise' }]}
          >
            <Select placeholder="Select exercise" disabled={!selectedCategory}>
              {selectedCategory && exercises[selectedCategory]?.map(ex => (
                <Select.Option key={ex} value={ex}>{ex}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Sets"
                name="sets"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input type="number" min={1} placeholder="Sets" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Reps" name="reps">
                <Input type="number" min={1} placeholder="Reps" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Weight (kg)" name="weight">
                <Input type="number" min={0} step={0.5} placeholder="Weight" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Duration (min)"
                name="duration"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input type="number" min={1} placeholder="Duration" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Calories Burned"
                name="calories"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input type="number" min={0} placeholder="Calories" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Notes" name="notes">
            <Input.TextArea rows={3} placeholder="Add any notes about your workout..." />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Log Workout
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default WorkoutTracker;
