import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGetAllShiftsQuery, useCreateShiftMutation, useUpdateShiftMutation, useDeleteShiftMutation, Shift, TimeOfDay } from '../../../api/app_employee/apiShifts';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;

const ShiftManageTab: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [searchName, setSearchName] = useState('');

    const { data: shifts, isLoading, refetch } = useGetAllShiftsQuery(searchName);
    const [createShift] = useCreateShiftMutation();
    const [updateShift] = useUpdateShiftMutation();
    const [deleteShift] = useDeleteShiftMutation();

    const columns: ColumnsType<Shift> = [
        {
            title: 'Tên ca',
            dataIndex: 'shiftName',
            key: 'shiftName',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (time: string) => time || '-',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (time: string) => time || '-',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setSelectedShift(null);
        setIsEdit(false);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Shift) => {
        setSelectedShift(record);
        setIsEdit(true);
        form.setFieldsValue({
            ...record,
            startTime: dayjs(record.startTime, 'HH:mm'),
            endTime: dayjs(record.endTime, 'HH:mm'),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (record: Shift) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa ca làm việc này?',
            onOk: async () => {
                try {
                    await deleteShift(record.id.toString()).unwrap();
                    message.success('Xóa ca làm việc thành công!');
                    refetch();
                } catch (error) {
                    message.error('Có lỗi xảy ra khi xóa ca làm việc!');
                }
            },
        });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                startTime: values.startTime.format('HH:mm'),
                endTime: values.endTime.format('HH:mm'),
            };

            if (isEdit && selectedShift) {
                await updateShift({
                    id: selectedShift.id.toString(),
                    data: formattedValues,
                }).unwrap();
                message.success('Cập nhật ca làm việc thành công!');
            } else {
                await createShift(formattedValues).unwrap();
                message.success('Thêm ca làm việc thành công!');
            }
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm ca làm việc
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={shifts}
                rowKey="id"
                loading={isLoading}
            />

            <Modal
                title={isEdit ? 'Chỉnh sửa ca làm việc' : 'Thêm ca làm việc'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText={isEdit ? 'Cập nhật' : 'Thêm'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="shiftName"
                        label="Tên ca"
                        rules={[{ required: true, message: 'Vui lòng nhập tên ca!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="startTime"
                        label="Thời gian bắt đầu"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                    >
                        <DatePicker picker="time" format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="endTime"
                        label="Thời gian kết thúc"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
                    >
                        <DatePicker picker="time" format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Option value="ACTIVE">Đang hoạt động</Option>
                            <Option value="COMPLETED">Đã kết thúc</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ShiftManageTab;
