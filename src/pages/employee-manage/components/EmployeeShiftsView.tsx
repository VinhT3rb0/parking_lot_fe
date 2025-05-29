import { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { EmployeeShifts } from '../../../api/app_employee/apiEmployeeShifts';
import { Shift, useGetAllShiftsQuery } from '../../../api/app_employee/apiShifts';
import { Employee, useGetAllEmployeesQuery } from '../../../api/app_employee/apiEmployee';
import { useGetAllParkingLotsQuery } from '../../../api/app_parkinglot/apiParkinglot';
import dayjs from 'dayjs';

interface EmployeeShiftsViewProps {
    isLoading: boolean;
    isModalVisible: boolean;
    editingMode: 'create' | 'edit';
    form: any;
    onModalOpen: (mode: 'create' | 'edit', shift?: EmployeeShifts) => void;
    onModalClose: () => void;
    onSubmit: (values: any) => Promise<EmployeeShifts>;
    onDelete: (id: number) => void;
    onDateChange: (date: string) => void;
    onShiftChange: (shiftId: number | null) => void;
    selectedDate: string;
    selectedShiftId: number | null;
    dataSource: EmployeeShifts[];
}

const EmployeeShiftsView: React.FC<EmployeeShiftsViewProps> = ({
    isLoading,
    isModalVisible,
    editingMode,
    form,
    onModalOpen,
    onModalClose,
    onSubmit,
    onDelete,
    onDateChange,
    onShiftChange,
    selectedDate,
    selectedShiftId,
    dataSource,
}) => {
    const { data: shifts, isLoading: isLoadingShifts } = useGetAllShiftsQuery('');
    const { data: employees, isLoading: isLoadingEmployees } = useGetAllEmployeesQuery('');
    const { data: parkingLots, isLoading: isLoadingParkingLots } = useGetAllParkingLotsQuery({});

    const handleResetFilters = () => {
        onDateChange('');
        onShiftChange(null);
    };

    const handleSubmit = async (values: any) => {
        try {
            await onSubmit(values);
            onModalClose();
        } catch (error: any) {
            if (error?.data?.message?.includes('Employee shift already exists')) {
                message.error('Nhân viên đã có ca làm việc này trong ngày');
            } else if (error?.data?.message) {
                message.error(error.data.message);
            } else {
                message.error('Có lỗi xảy ra khi xử lý ca làm việc');
            }
        }
    };

    const handleEdit = async (record: EmployeeShifts) => {
        try {
            onModalOpen('edit', record);
        } catch (error) {
            message.error('Có lỗi xảy ra khi mở form sửa');
        }
    };

    const handleDelete = async (record: EmployeeShifts) => {
        try {
            await onDelete(record.id);
            message.success('Xóa ca làm việc thành công');
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa ca làm việc');
        }
    };

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
            title: 'Bãi xe phân công',
            dataIndex: 'parkingLotName',
            key: 'parkingLotName',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: EmployeeShifts) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa ca làm việc này?"
                        onConfirm={() => handleDelete(record)}
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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
                <Space>
                    <DatePicker
                        value={selectedDate ? dayjs(selectedDate) : null}
                        onChange={(date) => onDateChange(date?.format('YYYY-MM-DD') || '')}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                    />
                    <Select
                        style={{ width: 200 }}
                        placeholder="Chọn ca làm việc"
                        value={selectedShiftId}
                        onChange={onShiftChange}
                        allowClear
                        options={shifts?.map(shift => ({
                            label: shift.shiftName,
                            value: shift.id,
                            description: `${shift.startTime} - ${shift.endTime}`,
                        }))}
                    />
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleResetFilters}
                    >
                        Bỏ lọc
                    </Button>
                </Space>
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
                dataSource={dataSource || []}
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
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="employeeId"
                        label="Nhân viên"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                    >
                        <Select
                            placeholder="Chọn nhân viên"
                            loading={isLoadingEmployees}
                            options={employees?.map(employee => ({
                                label: employee.userResponse.fullname,
                                value: employee.id,
                                description: employee.userResponse.email,
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
                            loading={isLoadingShifts}
                            options={shifts?.map(shift => ({
                                label: shift.shiftName,
                                value: shift.id,
                                description: `${shift.startTime} - ${shift.endTime}`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="parkingLotId"
                        label="Bãi đỗ xe"
                        rules={[{ required: true, message: 'Vui lòng chọn bãi đỗ xe' }]}
                    >
                        <Select
                            placeholder="Chọn bãi đỗ xe"
                            loading={isLoadingParkingLots}
                            options={parkingLots?.map(parkingLot => ({
                                label: parkingLot.name,
                                value: parkingLot.id,
                                description: parkingLot.address,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="workDate"
                        label="Ngày làm việc"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày làm việc' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày làm việc"
                        />
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