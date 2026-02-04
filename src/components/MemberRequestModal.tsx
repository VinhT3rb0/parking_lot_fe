import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Select, DatePicker } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, CarOutlined, HomeOutlined, NumberOutlined, GiftOutlined } from '@ant-design/icons';
import { useGetAllParkingLotsQuery } from '../api/app_parkinglot/apiParkinglot';
import { useRegisterMemberMutation } from '../api/app_member/apiMember';
import { useGetCurrentUserQuery } from '../api/app_home/apiAuth';
import { useGetParkingPlansByLotIdQuery } from '../api/app_parkingPlan/apiParkingPlan'; // Import query
import dayjs from 'dayjs';

const { Option } = Select;

interface MemberRequestModalProps {
    visible: boolean;
    onCancel: () => void;
    initialPlan?: string;
    initialPlanId?: number;
    initialParkingLotId?: number;
}

const MemberRequestModal: React.FC<MemberRequestModalProps> = ({ visible, onCancel, initialPlan, initialPlanId, initialParkingLotId }) => {
    const [form] = Form.useForm();
    const { data: parkingLotsData } = useGetAllParkingLotsQuery({});
    const [selectedLotId, setSelectedLotId] = useState<number | undefined>(initialParkingLotId); // Track selected lot

    // Fetch plans based on selected lot. Skip if no lot selected.
    const { data: parkingPlans = [] } = useGetParkingPlansByLotIdQuery(selectedLotId!, {
        skip: !selectedLotId
    });

    const [registerMember, { isLoading }] = useRegisterMemberMutation();
    const { data: userData } = useGetCurrentUserQuery();

    const parkingLots = Array.isArray(parkingLotsData) ? parkingLotsData : (parkingLotsData as any)?.data || [];
    const [lotVehicleOptions, setLotVehicleOptions] = useState<string[]>([]);

    useEffect(() => {
        if (selectedLotId && parkingLots.length > 0) {
            const lot = parkingLots.find((l: any) => l.id === selectedLotId);
            if (lot && lot.vehicleTypes) {
                // Parse vehicleTypes string (e.g. "[Car, Moto]" or "Car, Moto") into options
                let types = lot.vehicleTypes;
                if (typeof types === 'string') {
                    types = types.replace(/[\[\]]/g, '').split(',');
                }
                if (Array.isArray(types)) {
                    setLotVehicleOptions(types.map((t: string) => t.trim()));
                }
            } else {
                setLotVehicleOptions([]);
            }
        } else {
            setLotVehicleOptions([]);
        }
    }, [selectedLotId, parkingLots]);

    useEffect(() => {
        if (visible && userData?.data) {
            form.resetFields();

            const user = userData.data;
            // Pre-fill form with user data if available
            form.setFieldsValue({
                fullname: user.fullname || '',
                phoneNumber: user.phoneNumber || '',
                email: user.email || '',
                dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
                parkingLotId: initialParkingLotId || undefined,
                planId: initialPlanId || undefined // Pre-select plan if passed
            });
            if (initialParkingLotId) {
                setSelectedLotId(initialParkingLotId);
            }
        }
    }, [visible, userData, form, initialParkingLotId, initialPlanId]);

    const handleLotChange = (value: number) => {
        setSelectedLotId(value);
        form.setFieldsValue({
            planId: undefined,
            vehicleType: undefined
        }); // Reset plan and vehicle type when lot changes
    };

    const onFinish = async (values: any) => {
        if (!userData?.data?.id) {
            message.error('Vui lòng đăng nhập để thực hiện chức năng này!');
            return;
        }

        try {
            const payload = {
                parkingLotId: values.parkingLotId,
                planId: values.planId, // Use selected plan ID from form
                licensePlate: values.licensePlate,
                vehicleType: values.vehicleType,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
                address: values.address,
                phoneNumber: values.phoneNumber,
                email: values.email,
                fullname: values.fullname,
                roomNumber: values.roomNumber
            };

            await registerMember({
                userId: userData.data.id,
                data: payload
            }).unwrap();

            message.success('Gửi yêu cầu đăng ký thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
            onCancel();
        } catch (error) {
            console.error(error);
            message.error('Gửi yêu cầu thất bại. Vui lòng thử lại!');
        }
    };

    return (
        <Modal
            title={
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Đăng Ký Gói Thành Viên</h3>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            destroyOnClose
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="mt-4"
                initialValues={{
                    planId: initialPlanId
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="fullname"
                        label="Họ và Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" />
                    </Form.Item>

                    <Form.Item
                        name="dateOfBirth"
                        label="Ngày Sinh"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label="Số Điện Thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                    >
                        <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0901234567" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="example@email.com" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa Chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        className="md:col-span-2"
                    >
                        <Input prefix={<HomeOutlined className="text-gray-400" />} placeholder="123 Nguyễn Huệ, Phường Bến Nghé, Quận 1" />
                    </Form.Item>

                    <Form.Item
                        name="parkingLotId"
                        label="Bãi Đỗ Xe"
                        rules={[{ required: true, message: 'Vui lòng chọn bãi đỗ xe!' }]}
                    >
                        <Select placeholder="Chọn bãi đỗ xe" onChange={handleLotChange}>
                            {parkingLots.map((lot: any) => (
                                <Option key={lot.id} value={lot.id}>{lot.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="planId"
                        label="Gói Dịch Vụ"
                        rules={[{ required: true, message: 'Vui lòng chọn gói dịch vụ!' }]}
                    >
                        <Select
                            placeholder="Chọn gói dịch vụ"
                            disabled={!selectedLotId}
                            suffixIcon={<GiftOutlined className="text-gray-400" />}
                        >
                            {(Array.isArray((parkingPlans as any)?.data) ? (parkingPlans as any).data : []).map((plan: any) => (
                                <Option key={plan.id} value={plan.id}>
                                    {plan.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price)}
                                    {plan.priceUnit === 'DAY' ? '/Ngày' : (plan.priceUnit === 'MONTH' ? '/Tháng' : '/Năm')}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="roomNumber"
                        label="Số Phòng (nếu có)"
                        rules={[{ required: true, message: 'Vui lòng nhập số phòng!' }]}
                    >
                        <Input prefix={<NumberOutlined className="text-gray-400" />} placeholder="C101" />
                    </Form.Item>

                    <Form.Item
                        name="vehicleType"
                        label="Loại Xe"
                        rules={[{ required: true, message: 'Vui lòng chọn loại xe!' }]}
                    >
                        <Select
                            placeholder="Chọn loại xe"
                            suffixIcon={<CarOutlined className="text-gray-400" />}
                            disabled={!selectedLotId}
                        >
                            {lotVehicleOptions.map((type) => (
                                <Option key={type} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="licensePlate"
                        label="Biển Số Xe"
                        rules={[{ required: true, message: 'Vui lòng nhập biển số xe!' }]}
                    >
                        <Input placeholder="59A-12345" />
                    </Form.Item>
                </div>

                <Form.Item className="mb-0 text-center">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        size="large"
                        className="bg-orange-500 hover:bg-orange-600 font-bold border-none h-12 shadow-lg min-w-[200px]"
                    >
                        GỬI YÊU CẦU ĐĂNG KÝ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MemberRequestModal;
