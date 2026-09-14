import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminRiders from './pages/admin/Riders';
import RevenueReport from './pages/admin/RevenueReport';
import AdminRiderDrops from './pages/admin/RiderDrops';
import AdminCustomerParcels from './pages/admin/CustomerParcels';
import RiderProfile from './pages/admin/RiderProfile';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Core Logic */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AdminLogin />} />

        {/* Admin Flow */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/riders" element={<AdminRiders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/report" element={<RevenueReport />} />
        <Route path="/admin/rider-profile/:riderName" element={<RiderProfile />} />
        <Route path="/admin/rider-drops/:riderName" element={<AdminRiderDrops />} />
        <Route path="/admin/customer-parcels/:customerName" element={<AdminCustomerParcels />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
