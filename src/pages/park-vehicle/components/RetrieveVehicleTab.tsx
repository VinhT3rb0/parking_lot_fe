import React, { useState } from 'react';
import { Card, Typography, Space, Button, Input, message } from 'antd';
import { useCreateParkingExitMutation, useGetAllParkingEntriesQuery } from '../../../api/app_parking/apiParking';

const { Text } = Typography;

const RetrieveVehicleTab: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [createParkingExit] = useCreateParkingExitMutation();
    const { refetch } = useGetAllParkingEntriesQuery();

    const handleRetrieve = async () => {
        if (!code) {
            message.error("Vui lòng nhập mã xe");
            return;
        }

        try {
            const res = await createParkingExit({ code });
            if (res.error) {
                message.error("Có lỗi xảy ra khi lấy xe");
            } else {
                message.success("Lấy xe thành công!");
                setCode('');
                refetch();
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi lấy xe");
        }
    };

    return (
        <div className="retrieve-vehicle-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <Card title="Lấy xe">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Nhập mã xe:</Text>
                        <Input
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            placeholder="Nhập mã xe"
                            style={{ marginTop: '8px' }}
                        />
                    </div>
                    <Button type="primary" onClick={handleRetrieve} block>
                        Lấy xe
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default RetrieveVehicleTab; 