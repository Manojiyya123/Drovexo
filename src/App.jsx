import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Signup from './pages/Signup';
import RiderSignup from './pages/RiderSignup';
import CustomerDashboard from './pages/customer/Dashboard';
import CreateOrder from './pages/customer/CreateOrder';
import OrderHistory from './pages/customer/OrderHistory';
import RiderDashboard from './pages/rider/Dashboard';
import RiderMyDrops from './pages/rider/MyDrops';
import RiderEarnings from './pages/rider/Earnings';
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
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/rider-signup" element={<RiderSignup />} />

        {/* Customer */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/order/new" element={<CreateOrder />} />
        <Route path="/customer/orders" element={<OrderHistory />} />

        {/* Rider */}
        <Route path="/rider" element={<RiderDashboard />} />
        <Route path="/rider/drops" element={<RiderMyDrops />} />
        <Route path="/rider/earnings" element={<RiderEarnings />} />

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
