import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select, message } from 'antd';
import { CreateParkingLotRequest, UpdateParkingLotRequest, useCreateParkingLotMutation, useUpdateParkingLotMutation } from '../../../api/app_parkinglot/apiParkinglot';
import { useGetCurrentUserQuery } from '../../../api/app_home/apiAuth';

const { Option } = Select;

interface CreateAndUpdateParkingProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: CreateParkingLotRequest | UpdateParkingLotRequest) => Promise<void>;
    initialValues?: any;
    isEditing: boolean;
}

const CreateAndUpdateParking: React.FC<CreateAndUpdateParkingProps> = ({
    visible,
    onClose,
    onSubmit,
    initialValues,
    isEditing
}) => {
    const [form] = Form.useForm();
    const [createParkingLot] = useCreateParkingLotMutation();
    const [updateParkingLot] = useUpdateParkingLotMutation();
    const { data: userData } = useGetCurrentUserQuery();
    console.log(userData?.data?.id);
    useEffect(() => {
        if (visible) {
            if (isEditing && initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    vehicleTypes: initialValues.vehicleTypes
                        .replace(/[\[\]]/g, '')
                        .split(',')
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    status: 'ACTIVE',
                    isCovered: false
                });
            }
        }
    }, [visible, isEditing, initialValues, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                ownerId: userData?.data?.id,
                vehicleTypes: Array.isArray(values.vehicleTypes)
                    ? values.vehicleTypes.join(',')
                    : values.vehicleTypes
            };

            await onSubmit(formattedValues);
            form.resetFields();
        } catch (error) {
            console.error('Submission failed:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    return (
        <Modal
            title={isEditing ? 'Chỉnh sửa bãi đỗ' : 'Thêm bãi đỗ'}
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            onOk={handleOk}
            okText={isEditing ? 'Cập nhật' : 'Thêm'}
            cancelText="Hủy"
            width={700}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên bãi đỗ"
                    rules={[{ required: true, message: 'Vui lòng nhập tên bãi đỗ!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="capacity"
                    label="Sức chứa"
                    rules={[
                        { required: true, message: 'Vui lòng nhập sức chứa!' },
                        { type: 'number', min: 1, message: 'Sức chứa phải lớn hơn 0!' }
                    ]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                {isEditing && (
                    <Form.Item
                        name="availableSlots"
                        label="Chỗ trống"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số chỗ trống!' },
                            { type: 'number', min: 0, message: 'Số chỗ trống không được âm!' }
                        ]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                )}

                <Form.Item
                    name="operatingHours"
                    label="Giờ hoạt động"
                    rules={[{ required: true, message: 'Vui lòng nhập giờ hoạt động!' }]}
                >
                    <Select>
                        <Option value="24/7">24/7</Option>
                        <Option value="06:00-22:00">06:00-22:00</Option>
                        <Option value="07:00-22:00">07:00-22:00</Option>
                        <Option value="08:00-23:00">08:00-23:00</Option>
                        <Option value="09:00-24:00">09:00-24:00</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="hourlyRate"
                    label="Giá theo giờ (VNĐ)"
                    rules={[{ required: true, message: 'Vui lòng nhập giá theo giờ!' }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        addonAfter="VNĐ"
                    />
                </Form.Item>

                <Form.Item
                    name="dailyRate"
                    label="Giá theo ngày (VNĐ)"
                    rules={[{ required: true, message: 'Vui lòng nhập giá theo ngày!' }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        addonAfter="VNĐ"
                    />
                </Form.Item>

                <Form.Item
                    name="vehicleTypes"
                    label="Loại xe"
                    rules={[{ required: true, message: 'Vui lòng nhập các loại xe!' }]}
                >
                    <Select mode="tags" style={{ width: '100%' }}>
                        <Option value="Xe máy">Xe máy</Option>
                        <Option value="Ô tô">Ô tô</Option>
                        <Option value="Xe tải">Xe tải</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="isCovered"
                    label="Có mái che"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select>
                        <Option value="ACTIVE">Hoạt động</Option>
                        <Option value="INACTIVE">Ngừng hoạt động</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateAndUpdateParking;