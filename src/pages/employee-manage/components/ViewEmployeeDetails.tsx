import React from 'react';
import { Modal, Descriptions, Tag, Typography, Tabs, Divider } from 'antd';
import { Employee } from '../../../api/app_employee/apiEmployee';
import { EmployeeShifts } from '../../../api/app_employee/apiEmployeeShifts';
import { Attendance } from '../../../api/app_employee/apiAttendance';
import dayjs from 'dayjs';
import EmployeeShiftsTable from './EmployeeShiftsTable';
import EmployeeAttendanceTable from './EmployeeAttendanceTable';

interface ViewEmployeeDetailsProps {
    isModalVisible: boolean;
    selectedEmployee: Employee | null;
    employeeShifts: EmployeeShifts[] | undefined;
    employeeAttendances: Attendance[] | undefined;
    onClose: () => void;
    onEdit: (employee: Employee) => void;
}

const ViewEmployeeDetails: React.FC<ViewEmployeeDetailsProps> = ({
    isModalVisible,
    selectedEmployee,
    employeeShifts,
    employeeAttendances,
    onClose,
    onEdit,
}) => {
    if (!selectedEmployee) return null;

    const filteredShifts = employeeShifts?.filter(
        shift => Number(shift.employeeId) === Number(selectedEmployee.id)
    );

    const filteredAttendances = employeeAttendances?.filter(
        attendance => Number(attendance.employeeId) === Number(selectedEmployee.id)
    );

    const items = [
        {
            key: '1',
            label: 'Lịch làm việc',
            children: <EmployeeShiftsTable shifts={filteredShifts} />,
        },
        {
            key: '2',
            label: 'Lịch sử chấm công',
            children: <EmployeeAttendanceTable
                employeeId={selectedEmployee.id}
            />,
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

            <Typography.Title level={5}>Thông tin chi tiết</Typography.Title>
            <Tabs defaultActiveKey="1" items={items} />
        </Modal>
    );
};

export default ViewEmployeeDetails; 