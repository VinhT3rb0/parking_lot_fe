import React from 'react';
import { Typography, Tabs } from 'antd';
import ParkVehicleTab from './ParkVehicleTab';
import RetrieveVehicleTab from './RetrieveVehicleTab';
import './ParkVehicle.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const ParkVehicleForm: React.FC = () => {
    return (
        <div className="park-vehicle-page">
            <Tabs defaultActiveKey="1">
                <TabPane tab="Gửi xe" key="1">
                    <ParkVehicleTab />
                </TabPane>
                <TabPane tab="Lấy xe" key="2">
                    <RetrieveVehicleTab />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ParkVehicleForm; 