import React from 'react';
import { Table, Tag } from 'antd';
import { EmployeeShifts } from '../../../api/app_employee/apiEmployeeShifts';
import dayjs from 'dayjs';

interface EmployeeShiftsTableProps {
    shifts: EmployeeShifts[] | undefined;
}

const EmployeeShiftsTable: React.FC<EmployeeShiftsTableProps> = ({ shifts }) => {
    const columns = [
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
            title: 'Bãi xe',
            dataIndex: 'parkingLotName',
            key: 'parkingLotName',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const getStatusColor = (status: string) => {
                    switch (status) {
                        case 'IN_PROGRESS':
                            return 'processing';
                        case 'COMPLETED':
                            return 'success';
                        case 'ABSENT':
                            return 'error';
                        case 'SCHEDULED':
                            return 'default';
                        default:
                            return 'default';
                    }
                };

                const getStatusText = (status: string) => {
                    switch (status) {
                        case 'IN_PROGRESS':
                            return 'Đang làm việc';
                        case 'COMPLETED':
                            return 'Hoàn thành';
                        case 'ABSENT':
                            return 'Vắng mặt';
                        case 'SCHEDULED':
                            return 'Đã lên lịch';
                        default:
                            return status;
                    }
                };

                return (
                    <Tag color={getStatusColor(status)}>
                        {getStatusText(status)}
                    </Tag>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={shifts}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ y: 300 }}
        />
    );
};

export default EmployeeShiftsTable; 