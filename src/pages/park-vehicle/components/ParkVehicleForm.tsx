import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, message, Typography, Space, Row, Col } from 'antd';
import { CarOutlined, NumberOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import './ParkVehicle.css';

const { Option } = Select;
const { Title } = Typography;

const ParkVehicleForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [parkingLots, setParkingLots] = useState([
        { id: 1, name: 'Bãi A - Tầng 1' },
        { id: 2, name: 'Bãi B - Tầng 2' },
        { id: 3, name: 'Bãi C - Tầng 3' }
    ]);

    const vehicleTypes = [
        { value: 'car', label: 'Ô tô' },
        { value: 'motorcycle', label: 'Xe máy' },
        { value: 'bicycle', label: 'Xe đạp' }
    ];

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Form values:', values);

        // Giả lập API call
        setTimeout(() => {
            message.success('Gửi xe thành công!');
            form.resetFields();
            setLoading(false);
        }, 1000);
    };

    return (
        <Card className="park-vehicle-card">
            <Title level={4}>Thông tin gửi xe</Title>
            <Form
                form={form}
                name="parkVehicle"
                onFinish={onFinish}
                layout="vertical"
                requiredMark={false}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="vehicleType"
                            label="Loại phương tiện"
                            rules={[{ required: true, message: 'Vui lòng chọn loại phương tiện!' }]}
                        >
                            <Select placeholder="Chọn loại phương tiện">
                                {vehicleTypes.map(type => (
                                    <Option key={type.value} value={type.value}>{type.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="licensePlate"
                            label="Biển số xe"
                            rules={[{ required: true, message: 'Vui lòng nhập biển số xe!' }]}
                        >
                            <Input prefix={<NumberOutlined />} placeholder="Nhập biển số xe" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="ownerName"
                            label="Tên chủ xe"
                            rules={[{ required: true, message: 'Vui lòng nhập tên chủ xe!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Nhập tên chủ xe" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="parkingLotId"
                    label="Bãi đỗ xe"
                    rules={[{ required: true, message: 'Vui lòng chọn bãi đỗ xe!' }]}
                >
                    <Select placeholder="Chọn bãi đỗ xe">
                        {parkingLots.map(lot => (
                            <Option key={lot.id} value={lot.id}>{lot.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="notes"
                    label="Ghi chú"
                >
                    <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} icon={<CarOutlined />} block>
                        Gửi xe
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ParkVehicleForm; 