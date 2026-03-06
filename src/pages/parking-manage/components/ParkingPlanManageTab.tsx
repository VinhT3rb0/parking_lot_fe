import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Select, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    useGetAllParkingPlansQuery,
    useCreateParkingPlanMutation,
    useUpdateParkingPlanMutation,
    useDeleteParkingPlanMutation,
    ParkingPlan
} from '../../../api/app_parkingPlan/apiParkingPlan';

interface ParkingPlanManageTabProps {
    parkingLotId: number;
}

const ParkingPlanManageTab: React.FC<ParkingPlanManageTabProps> = ({ parkingLotId }) => {
    const { data: parkingPlans = [], isLoading, refetch } = useGetAllParkingPlansQuery({ parkingLotId });
    const [createParkingPlan, { isLoading: isCreating }] = useCreateParkingPlanMutation();
    const [updateParkingPlan, { isLoading: isUpdating }] = useUpdateParkingPlanMutation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [deleteParkingPlan] = useDeleteParkingPlanMutation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPlan, setEditingPlan] = useState<ParkingPlan | null>(null);
    const [form] = Form.useForm();

    const lotPlans = Array.isArray(parkingPlans) ? parkingPlans : (parkingPlans as any)?.data || [];

    const handleAdd = () => {
        setEditingPlan(null);
        form.resetFields();
        form.setFieldsValue({
            parkingLotId: parkingLotId,
            priceUnit: 'MONTH',
            isActive: true
        });
        setIsModalVisible(true);
    };

    const handleEdit = (record: ParkingPlan) => {
        setEditingPlan(record);
        form.setFieldsValue({
            ...record,
            priceUnit: record.priceUnit,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteParkingPlan(id).unwrap();
            message.success('Xóa gói thành công!');
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = { ...values, parkingLotId: parkingLotId };

            if (editingPlan) {
                await updateParkingPlan({ id: editingPlan.id, data: payload }).unwrap();
                message.success('Cập nhật gói thành công!');
            } else {
                await createParkingPlan(payload).unwrap();
                message.success('Thêm gói mới thành công!');
            }
            setIsModalVisible(false);
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    const columns = [
        {
            title: 'Tên gói',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (val: number, record: any) => `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)} / ${record.priceUnit}`,
        },
        {
            title: 'Loại gói',
            dataIndex: 'planType',
            key: 'planType',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Phổ biến',
            dataIndex: 'isPopular',
            key: 'isPopular',
            render: (val: boolean) => val ? 'Có' : 'Không',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: ParkingPlan) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="mt-4">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="mb-4">
                Thêm gói mới
            </Button>
            <Table
                dataSource={lotPlans}
                columns={columns}
                rowKey="id"
                loading={isLoading}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title={editingPlan ? "Cập nhật gói" : "Thêm gói mới"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={isCreating || isUpdating}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên gói" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="parkingLotId" hidden>
                        <InputNumber />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="price" label="Giá (VND)" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="priceUnit" label="Chu kỳ" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="DAY">Ngày</Select.Option>
                                <Select.Option value="MONTH">Tháng</Select.Option>
                                <Select.Option value="YEAR">Năm</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="planType" label="Loại gói (VD: STANDARD, PREMIUM)" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                    </div>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                        <Form.Item name="isUnlimitedParking" valuePropName="checked" label="Đỗ xe không giới hạn">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="hasFixedSpot" valuePropName="checked" label="Chỗ cố định">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="hasValetService" valuePropName="checked" label="Valet Parking">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="hasCarWash" valuePropName="checked" label="Rửa xe miễn phí">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="hasCoveredParking" valuePropName="checked" label="Có mái che">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="hasSecurity247" valuePropName="checked" label="An ninh 24/7">
                            <Switch />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Form.Item name="isPopular" valuePropName="checked" label="Gói Phổ biến">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="isActive" valuePropName="checked" label="Đang hoạt động">
                            <Switch />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ParkingPlanManageTab;
