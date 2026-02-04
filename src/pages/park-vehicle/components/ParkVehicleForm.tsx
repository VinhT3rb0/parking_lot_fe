import React from 'react';
import { Typography, Tabs } from 'antd';
import ParkVehicleTab from './ParkVehicleTab';
import RetrieveVehicleTab from './RetrieveVehicleTab';
import './ParkVehicle.css';

const { Title } = Typography;

const ParkVehicleForm: React.FC = () => {
    const items = [
        {
            key: '1',
            label: 'Gửi xe',
            children: <ParkVehicleTab />,
        },
        {
            key: '2',
            label: 'Lấy xe',
            children: <RetrieveVehicleTab />,
        },
    ];

    return (
        <div className="park-vehicle-page">
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
};

export default ParkVehicleForm; 