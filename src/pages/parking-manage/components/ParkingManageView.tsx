import React from 'react';
import { Tabs } from 'antd';
import ParkingLotManageTab from './ParkingLotManageTab';
import ShiftManageTab from './ShiftManageTab';
import ParkingHistoryTab from './ParkingHistoryTab';

const ParkingManageView: React.FC = () => {
    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        key: '1',
                        label: 'Quản lý bãi đỗ',
                        children: <ParkingLotManageTab />,
                    },
                    {
                        key: '2',
                        label: 'Quản lý ca làm việc',
                        children: <ShiftManageTab />,
                    },
                    {
                        key: '3',
                        label: 'Lịch sử gửi xe',
                        children: <ParkingHistoryTab />,
                    },
                ]}
            />
        </div>
    );
};

export default ParkingManageView;