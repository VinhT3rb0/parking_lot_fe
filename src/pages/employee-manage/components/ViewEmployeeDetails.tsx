import React from 'react';
import { Modal, Descriptions, Tag, Typography, Table, Divider } from 'antd';
import { Employee } from '../../../api/app_employee/apiEmployee';
import { EmployeeShifts } from '../../../api/app_employee/apiEmployeeShifts';
import dayjs from 'dayjs';

interface ViewEmployeeDetailsProps {
    isModalVisible: boolean;
    selectedEmployee: Employee | null;
    employeeShifts: EmployeeShifts[] | undefined;
    onClose: () => void;
    onEdit: (employee: Employee) => void;
}

const ViewEmployeeDetails: React.FC<ViewEmployeeDetailsProps> = ({
    isModalVisible,
    selectedEmployee,
    employeeShifts,
    onClose,
    onEdit,
}) => {
    if (!selectedEmployee) return null;

    const filteredShifts = employeeShifts?.filter(
        shift => Number(shift.employeeId) === Number(selectedEmployee.id)
    );

    const shiftColumns = [
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
            render: (status: string) => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
                    {status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            ),
        },
    ];

    return (
        <Modal
            title="Thông tin nhân viên"
            open={isModalVisible}
            onCancel={onClose}
            footer={[
                <button
                    key="edit"
                    className="ant-btn ant-btn-primary px-4 py-2"
                    onClick={() => onEdit(selectedEmployee)}
                >
                    Sửa thông tin
                </button>,
                <button
                    key="close"
                    className="ant-btn"
                    onClick={onClose}
                >
                    Đóng
                </button>
            ]}
            width={900}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Họ và tên" span={2}>
                    {selectedEmployee.userResponse.fullname}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {selectedEmployee.userResponse.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {selectedEmployee.userResponse.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                    {dayjs(selectedEmployee.userResponse.dateOfBirth).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày gia nhập">
                    {dayjs(selectedEmployee.joinDate).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={selectedEmployee.status === 'ACTIVE' ? 'green' : 'red'}>
                        {selectedEmployee.status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Typography.Title level={5}>Lịch làm việc</Typography.Title>
            <Table
                columns={shiftColumns}
                dataSource={filteredShifts}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ y: 300 }}
            />
        </Modal>
    );
};

export default ViewEmployeeDetails; 