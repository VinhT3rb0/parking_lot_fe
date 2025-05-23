import React, { useMemo, useState } from 'react';
import { List, Typography, Tag, Input, Space, Modal, Image, Button, DatePicker } from 'antd';
import { CarOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useGetAllParkingEntriesQuery, useGetSessionByLicensePlateQuery, useGetAllParkingEntriesActiveQuery, useGetParkingEntriesByDatetimeQuery, ParkingEntryResponse } from '../../../api/app_parking/apiParking';
import { useGetAllParkingLotsQuery } from '../../../api/app_parkinglot/apiParkinglot';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const ParkingHistoryTab: React.FC = () => {
    const [searchPlate, setSearchPlate] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<ParkingEntryResponse | null>(null);
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

    const { data: parkingHistory, isLoading } = useGetAllParkingEntriesQuery();
    const { data: activeParkingHistory, isLoading: isActiveLoading } = useGetAllParkingEntriesActiveQuery();
    const { data: filteredEntry, isLoading: isSearching } = useGetSessionByLicensePlateQuery(searchPlate, {
        skip: !searchPlate
    });
    const { data: dateFilteredEntries, isLoading: isDateFiltering } = useGetParkingEntriesByDatetimeQuery(
        dateRange ? {
            dateStart: dateRange[0].format('YYYY-MM-DDTHH:mm:ss'),
            dateEnd: dateRange[1].format('YYYY-MM-DDTHH:mm:ss')
        } : { dateStart: '', dateEnd: '' },
        { skip: !dateRange }
    );
    const { data: parkingLots } = useGetAllParkingLotsQuery({});

    const parkingLotMap = useMemo(() => {
        if (!parkingLots) return new Map();
        return new Map(parkingLots.map(lot => [lot.id, lot.name]));
    }, [parkingLots]);

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
    };

    const displayData = useMemo(() => {
        if (searchPlate) {
            return filteredEntry ? [filteredEntry] : [];
        }
        if (dateRange) {
            return dateFilteredEntries || [];
        }
        return showActiveOnly ? activeParkingHistory : parkingHistory;
    }, [searchPlate, filteredEntry, dateRange, dateFilteredEntries, showActiveOnly, activeParkingHistory, parkingHistory]);

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Space wrap>
                <Search
                    placeholder="Nhập biển số xe để tìm kiếm"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={setSearchPlate}
                    style={{ width: 300 }}
                />
                <RangePicker
                    showTime
                    format="DD/MM/YYYY HH:mm:ss"
                    onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                    style={{ width: 400 }}
                />
                <Button
                    type={showActiveOnly ? "primary" : "default"}
                    icon={<FilterOutlined />}
                    onClick={() => setShowActiveOnly(!showActiveOnly)}
                >
                    {showActiveOnly ? 'Đang gửi' : 'Tất cả'}
                </Button>
            </Space>
            <List
                itemLayout="horizontal"
                dataSource={displayData}
                loading={isLoading || isSearching || isActiveLoading || isDateFiltering}
                style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
                renderItem={(item) => (
                    <List.Item onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer' }}>
                        <List.Item.Meta
                            avatar={<CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Text strong>Biển số xe: {item.licensePlate}</Text>
                                    <Tag color={item.status === 'ACTIVE' ? 'green' : 'blue'}>
                                        {item.status === 'ACTIVE' ? 'Đang gửi' : 'Đã lấy'}
                                    </Tag>
                                </div>
                            }
                            description={
                                <div>
                                    <div>Mã xe: {item.code}</div>
                                    <div>Bãi gửi: {parkingLotMap.get(item.lotId) || 'Đang tải...'}</div>
                                    <div>Vào: {formatDateTime(item.entryTime)}</div>
                                    <div>Ra: {formatDateTime(item.exitTime)}</div>
                                    {item.totalCost && <div>Chi phí: {item.totalCost.toLocaleString()} VNĐ</div>}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
            <Modal
                title="Hình ảnh xe"
                open={!!selectedItem}
                onCancel={() => setSelectedItem(null)}
                footer={null}
                width={500}
            >
                <Space direction="vertical" style={{ width: '100%', maxHeight: '60vh', overflow: 'auto' }} align="center">
                    <div>
                        <Text strong>Ảnh lúc vào:</Text>
                        <Image
                            src={selectedItem?.licensePlateImageEntry}
                            alt="Ảnh lúc vào"
                            style={{ maxWidth: '100%', marginTop: 8 }}
                        />
                    </div>
                    {selectedItem?.status !== 'ACTIVE' && selectedItem?.licensePlateImageExit && (
                        <div>
                            <Text strong>Ảnh lúc ra:</Text>
                            <Image
                                src={selectedItem.licensePlateImageExit}
                                alt="Ảnh lúc ra"
                                style={{ maxWidth: '100%', marginTop: 8 }}
                            />
                        </div>
                    )}
                </Space>
            </Modal>
        </Space>
    );
};

export default ParkingHistoryTab; 