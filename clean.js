const fs = require('fs');

function patch(path, search) {
    try {
        let content = fs.readFileSync(path, 'utf8');
        for (let s of search) {
            content = content.replace(s[0], s[1]);
        }
        fs.writeFileSync(path, content, 'utf8');
        console.log('Patched ' + path);
    } catch (e) {
        console.error('Error in ' + path, e.message);
    }
}

// 1. Navbar
patch('src/components/Navbar/Navbar.tsx', [
    [/(TeamOutlined, AuditOutlined), GiftOutlined/, '$1']
]);

// 2. ParkingRates
patch('src/components/ParkingRates.tsx', [
    [/const isPopular = plan.isPopular && index === firstPopularIndex;/g, '']
]);

// 3. UserInfo
patch('src/pages/UserInfo/UserInfo.tsx', [
    [/Layout, Form, Input, Button, List, Card, Avatar, Typography, Tabs, message, DatePicker, Tag, Spin/, 'Layout, Form, Input, Button, Card, Avatar, Typography, Tabs, message, DatePicker, Spin'],
    [/UserOutlined, LockOutlined, CarOutlined, LogoutOutlined/, 'UserOutlined, LogoutOutlined']
]);

// 4. auth/Login.tsx
patch('src/pages/auth/Login.tsx', [
    [/Form, Input, Button, Card, message, Image/, 'Form, Input, Button, message, Image']
]);

// 5. auth/Register.tsx
patch('src/pages/auth/Register.tsx', [
    [/Form, Input, Button, Card, message, Image/, 'Form, Input, Button, message, Image']
]);

// 6. customer/Contact.tsx
patch('src/pages/customer/Contact.tsx', [
    [/MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin/, 'MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin']
]);

// 7. customer/ParkingLots.tsx
patch('src/pages/customer/ParkingLots.tsx', [
    [/Card, Row, Col, Tag, Statistic, Button, Input, Rate, Progress, Skeleton, Empty/, 'Card, Row, Col, Tag, Button, Input, Progress, Skeleton, Empty'],
    [/EnvironmentOutlined, CarOutlined, DollarOutlined, ClockCircleOutlined, SearchOutlined/, 'EnvironmentOutlined, CarOutlined, ClockCircleOutlined, SearchOutlined'],
    [/const \{ Meta \} = Card;\r?\n/, '']
]);

// 8. customer/Services.tsx
patch('src/pages/customer/Services.tsx', [
    [/Car, Clock, Zap, Shield, Sparkles, Wrench, ArrowRight, Check/, 'Car, Clock, Zap, Shield, ArrowRight, Check']
]);

// 9. dashboard/Dashboard.tsx
patch('src/pages/dashboard/Dashboard.tsx', [
    [/interface ParkingLot \{[\s\S]*?\}[\s\S]*?interface RevenueData \{[\s\S]*?\}\r?\n/, '']
]);

// 10. OverviewTab
patch('src/pages/dashboard/components/OverviewTab.tsx', [
    [/DollarOutlined,\s*CarOutlined,\s*UserOutlined,\s*EnvironmentOutlined,/, 'DollarOutlined,\n    EnvironmentOutlined,']
]);

// 11. RevenueTab
patch('src/pages/dashboard/components/RevenueTab.tsx', [
    [/const \[selectedParking, setSelectedParking\] = useState<string>\('all'\);/, 'const [selectedParking] = useState<string>(\'all\');']
]);

// 12. EmployeeManage
patch('src/pages/employee-manage/EmployeeManage.tsx', [
    [/const \[selectedShift, setSelectedShift\] = useState<Shift \| null>\(null\);\r?\n/, ''],
    [/\[filters, initialView\]/, '[filters, initialView, refetchShifts]']
]);

// 13. EmployeeAttendanceTable
patch('src/pages/employee-manage/components/EmployeeAttendanceTable.tsx', [
    [/import \{ Attendance \} from \'\.\.\/\.\.\/\.\.\/api\/app_employee\/apiAttendance\';\r?\n/, '']
]);

// 14. EmployeeManageView
patch('src/pages/employee-manage/components/EmployeeManageView.tsx', [
    [/Modal, Form, Button, Tag, Space, Card/, 'Button, Tag, Space']
]);

// 15. EmployeeShiftsView
patch('src/pages/employee-manage/components/EmployeeShiftsView.tsx', [
    [/import React, \{ useState \} from \'react\';/, 'import React from \'react\';'],
    [/Button, Table, Tag, Input, Space/, 'Button, Table, Tag, Space'],
    [/import \{ Shift, Employee \} from \'..\/..\/..\/api\/app_employee\/apiEmployeeShifts\';\r?\n/, '']
]);

// 16. ViewEmployeeDetails
patch('src/pages/employee-manage/components/ViewEmployeeDetails.tsx', [
    [/const filteredAttendances = .*?;\r?\n/, '']
]);

// 17. InvoiceManage
patch('src/pages/invoice-manage/InvoiceManage.tsx', [
    [/Table, Tag, Space, Button, Input, Select, DatePicker, Card, Tooltip/, 'Table, Tag, Space, Button, Input, Select, DatePicker, Tooltip']
]);

// 18. ExpiringMembersTab
patch('src/pages/member-manage/components/ExpiringMembersTab.tsx', [
    [/Button, Tag, Space, message, Select/, 'Button, Tag, message, Select']
]);

// 19. MemberDetailModal
patch('src/pages/member-manage/components/MemberDetailModal.tsx', [
    [/EditOutlined, StopOutlined, CreditCardOutlined/, 'EditOutlined, CreditCardOutlined'],
    [/\[memberId, visible, form, memberDetail\.data\]/, '[memberId, visible, form, memberDetail.data, refetch]']
]);

// 20. PendingMembersTab
patch('src/pages/member-manage/components/PendingMembersTab.tsx', [
    [/const \[createInvoice\] = useCreateInvoiceMutation\(\);\r?\n/, '']
]);

// 21. ParkVehicleForm
patch('src/pages/park-vehicle/components/ParkVehicleForm.tsx', [
    [/const \{ Title \} = Typography;\r?\n/, '']
]);

// 22. ParkVehicleTab
patch('src/pages/park-vehicle/components/ParkVehicleTab.tsx', [
    [/const \{ data: parkingLots = \[\], isLoading, refetch \} =/, 'const { data: parkingLots = [], isLoading } =']
]);

// 23. CreateAndUpdateParkingLot
patch('src/pages/parking-manage/components/CreateAndUpdateParkingLot.tsx', [
    [/types\.replace\(\/\[\\\\\[\\\\\]\]\/g/g, "types.replace(/[\\[\\]]/g"]
]);

// 24. ParkingLotDetail
patch('src/pages/parking-manage/components/ParkingLotDetail.tsx', [
    [/,\s*useCreateParkingLotMutation,\s*useUpdateParkingLotMutation/g, ''],
    [/const handleOk = \(\) => \{\r?\n\s*setIsModalVisible\(false\);\r?\n\s*\};\r?\n/g, ''],
    [/types\.replace\(\/\[\\\\\[\\\\\]\]\/g/g, "types.replace(/[\\[\\]]/g"],
    [/values\.vehicleTypes\.replace\(\/\[\\\\\[\\\\\]\]\/g/g, "values.vehicleTypes.replace(/[\\[\\]]/g"]
]);

// 25. ParkingLotManageTab
patch('src/pages/parking-manage/components/ParkingLotManageTab.tsx', [
    [/types\.replace\(\/\[\\\\\[\\\\\]\]\/g/g, "types.replace(/[\\[\\]]/g"]
]);

// 26. ParkingPlanManageTab
patch('src/pages/parking-manage/components/ParkingPlanManageTab.tsx', [
    [/const \[deleteParkingPlan, \{ isLoading: isDeleting \}\] = useDeleteParkingPlanMutation\(\);/, 'const [deleteParkingPlan] = useDeleteParkingPlanMutation();']
]);

// 27. AttendanceDetailsModal
patch('src/pages/timekeeping/components/AttendanceDetailsModal.tsx', [
    [/import \{ Attendance \} from \'\.\.\/\.\.\/\.\.\/api\/app_employee\/apiAttendance\';\r?\n/, '']
]);

// 28. MemberRequestModal.tsx
patch('src/components/MemberRequestModal.tsx', [
    [/replace\(\/\[\\\\\[\\\\\]\]\/g/, "replace(/[\\[\\]]/g"],
    [/const parkingLots = Array\.isArray\(parkingLotsData\)/, "const parkingLots = React.useMemo(() => Array.isArray(parkingLotsData) ? parkingLotsData : (parkingLotsData as any)?.data || [], [parkingLotsData]);\n    // eslint-disable-next-line @typescript-eslint/no-unused-vars\n    const oldParkingLots = Array.isArray(parkingLotsData)"]
]);
