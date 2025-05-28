import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { useGetAttendanceByIdQuery, Attendance } from '../../../api/app_employee/apiAttendance';
import dayjs from 'dayjs';

interface AttendanceDetailsModalProps {
    attendanceId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const AttendanceDetailsModal: React.FC<AttendanceDetailsModalProps> = ({
    attendanceId,
    isOpen,
    onClose,
}) => {
    const { data: attendance, isLoading } = useGetAttendanceByIdQuery(attendanceId || '', {
        skip: !attendanceId
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return 'success';
            case 'ABSENT':
                return 'error';
            case 'LATE':
                return 'warning';
            case 'EARLY':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return 'Có mặt';
            case 'ABSENT':
                return 'Vắng mặt';
            case 'LATE':
                return 'Đi muộn';
            case 'EARLY':
                return 'Về sớm';
            default:
                return status;
        }
    };

    return (
        <Modal
            title="Chi tiết chấm công"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            {isLoading ? (
                <div>Đang tải...</div>
            ) : attendance ? (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Nhân viên">{attendance.employeeName}</Descriptions.Item>
                    <Descriptions.Item label="Giờ vào ca">
                        {attendance.checkInTime ? dayjs(attendance.checkInTime).format('DD/MM/YYYY HH:mm:ss') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giờ ra ca">
                        {attendance.checkOutTime ? dayjs(attendance.checkOutTime).format('DD/MM/YYYY HH:mm:ss') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(attendance.status)}>
                            {getStatusText(attendance.status)}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            ) : (
                <div>Không tìm thấy thông tin chấm công</div>
            )}
        </Modal>
    );
};

export default AttendanceDetailsModal; 