import React from 'react';
import { Modal, Descriptions, Tag, Image, Space, Typography } from 'antd';
import { ParkingEntryResponse } from '../../../api/app_parking/apiParking';
import dayjs from 'dayjs';

const { Text } = Typography;

interface ParkingHistoryDetailProps {
    visible: boolean;
    onClose: () => void;
    parkingEntry: ParkingEntryResponse | null;
}

const ParkingHistoryDetail: React.FC<ParkingHistoryDetailProps> = ({
    visible,
    onClose,
    parkingEntry
}) => {
    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
    };

    return (
        <Modal
            title="Chi tiết phiên gửi xe"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {parkingEntry && (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Mã xe" span={2}>
                            {parkingEntry.code}
                        </Descriptions.Item>
                        <Descriptions.Item label="Biển số xe" span={2}>
                            {parkingEntry.licensePlate}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian vào">
                            {formatDateTime(parkingEntry.entryTime)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian ra">
                            {formatDateTime(parkingEntry.exitTime)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={parkingEntry.status === 'ACTIVE' ? 'green' : 'blue'}>
                                {parkingEntry.status === 'ACTIVE' ? 'Đang gửi' : 'Đã lấy'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Chi phí">
                            {parkingEntry.totalCost ? `${parkingEntry.totalCost.toLocaleString()} VNĐ` : '-'}
                        </Descriptions.Item>
                    </Descriptions>
                    <div className='flex'>

                        <div>
                            <Text strong>Ảnh lúc vào:</Text>
                            <Image
                                src={parkingEntry.licensePlateImageEntry}
                                alt="Ảnh lúc vào"
                                style={{ maxWidth: '100%', marginTop: 8 }}
                            />
                        </div>
                        {parkingEntry.status !== 'ACTIVE' && parkingEntry.licensePlateImageExit && (
                            <div className='ml-6'>
                                <Text strong>Ảnh lúc ra:</Text>
                                <Image
                                    src={parkingEntry.licensePlateImageExit}
                                    alt="Ảnh lúc ra"
                                    style={{ maxWidth: '100%', marginTop: 8 }}
                                />
                            </div>
                        )}
                    </div>
                </Space>
            )}
        </Modal>
    );
};

export default ParkingHistoryDetail; 