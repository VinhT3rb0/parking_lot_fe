import React from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { EmployeeShifts, useGetEmployeeShiftsQuery } from '../../../api/app_employee/apiEmployeeShifts';
import dayjs from 'dayjs';




interface EmployeeShiftsViewProps {
    employeeShifts: EmployeeShifts[] | undefined;
    isLoading: boolean;
    isModalVisible: boolean;
    editingMode: 'create' | 'edit';
    selectedShift: EmployeeShifts | null;
    form: any;
    onModalOpen: (mode: 'create' | 'edit', shift?: EmployeeShifts) => void;
    onModalClose: () => void;
    onSubmit: (values: any) => void;
    onDelete: (id: number) => void;
}

const EmployeeShiftsView: React.FC<EmployeeShiftsViewProps> = ({
    employeeShifts,
    isLoading,
    isModalVisible,
    editingMode,
    selectedShift,
    form,
    onModalOpen,
    onModalClose,
    onSubmit,
    onDelete,
}) => {
    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: 'employeeName',
            key: 'employeeName',
        },
        {
            title: 'Ca làm việc',
            dataIndex: 'shiftName',
            key: 'shiftName',
        },
        {
            title: 'Thời gian',
            dataIndex: 'shiftTime',
            key: 'shiftTime',
        },
        {
            title: 'Ngày làm việc',
            dataIndex: 'workDate',
            key: 'workDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Thứ',
            dataIndex: 'dayOfWeek',
            key: 'dayOfWeek',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: EmployeeShifts) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onModalOpen('edit', record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa ca làm việc này?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => onModalOpen('create')}
                >
                    Thêm ca làm việc
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={employeeShifts}
                loading={isLoading}
                rowKey="id"
            />

            <Modal
                title={editingMode === 'create' ? 'Thêm ca làm việc' : 'Sửa ca làm việc'}
                open={isModalVisible}
                onCancel={onModalClose}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                >
                    <Form.Item
                        name="employeeId"
                        label="Nhân viên"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                    >
                        <Select
                            placeholder="Chọn nhân viên"
                            options={employeeShifts?.map(shift => ({
                                label: shift.employeeName,
                                value: shift.employeeId,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="shiftId"
                        label="Ca làm việc"
                        rules={[{ required: true, message: 'Vui lòng chọn ca làm việc' }]}
                    >
                        <Select
                            placeholder="Chọn ca làm việc"
                            options={employeeShifts?.map(shift => ({
                                label: shift.shiftName,
                                value: shift.shiftId,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="workDate"
                        label="Ngày làm việc"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày làm việc' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item
                        name="isRecurring"
                        label="Lặp lại"
                        valuePropName="checked"
                    >
                        <Select
                            placeholder="Chọn trạng thái lặp lại"
                            options={[
                                { label: 'Có', value: true },
                                { label: 'Không', value: false },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            options={[
                                { label: 'Hoạt động', value: 'ACTIVE' },
                                { label: 'Không hoạt động', value: 'INACTIVE' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingMode === 'create' ? 'Thêm' : 'Cập nhật'}
                            </Button>
                            <Button onClick={onModalClose}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EmployeeShiftsView; 