# Drovexo

**Live Demo**: [https://drovexo-kmk.vercel.app/](https://drovexo-kmk.vercel.app/)

Drovexo is a modern web-based platform designed for comprehensive logistics and rider fleet management. It features a robust Admin Dashboard equipped with operational tools for real-time tracking, stateful rider management (including biometric and status vetting), financial reporting.

## Project Structure & Pages

The application is structured into four distinct user flows:

### Public Pages
- **Home (`/`)**: Landing page introducing Drovexo services.
- **Login (`/login`)**: Authentication portal for all user roles.
- **Customer Signup (`/signup`)**: Registration page for new customers.
- **Rider Signup (`/rider-signup`)**: Specialized registration pipeline for prospective riders.

### Customer Portal
- **Dashboard (`/customer`)**: Overview of the customer's active and past orders.
- **Create Order (`/customer/order/new`)**: Interface to place new delivery and logistics requests.
- **Order History (`/customer/orders`)**: Detailed history of all past deliveries.

### Rider Portal
- **Dashboard (`/rider`)**: The primary interface for riders to manage active deliveries.
- **My Drops (`/rider/drops`)**: View a history of completed drop-offs.
- **Earnings (`/rider/earnings`)**: Financial overview for monitoring payouts and rider earnings.

### Admin Dashboard (Operational Suite)
- **Dashboard (`/admin`)**: High-level operational oversight and key metrics.
- **Customers (`/admin/customers`)**: Interface to manage customer profiles.
- **Riders (`/admin/riders`)**: State management and vetting interface for the rider fleet.
- **Orders (`/admin/orders`)**: Centralized dispatch and management of all logistics orders.
- **Revenue Report (`/admin/report`)**: Financial reporting with interactive data visualization.
- **Specific Rider Profiles (`/admin/rider-profile/:name`)**: Detailed performance metrics for individual riders.
- **Rider Drop History (`/admin/rider-drops/:name`)**: Deep dive into a specific rider's drop logs.
- **Customer Parcel History (`/admin/customer-parcels/:name`)**: Review all active and past parcels for specific customers.

## Key Features

- **Admin Dashboard**: Centralized operational suite for managing fleet activities.
- **Rider Fleet Management**: Stateful management for onboarding, biometric checking, and status tracking.
- **Real-Time Data Visualization**: Interactive charts for financial reporting and operational analytics.
- **Responsive UI**: A polished, adaptable interface catering to both administrators and end-users.

## Planned Features / Future Work

- **Geospatial Tracking**: Map integrations for monitoring delivery routing and logistics.
- **Advanced Logistics Dispatch**: Full dispatch capabilities tied into the live routing.

## Tech Stack

This project is built with a modern frontend stack:
- **[React](https://react.dev/)**: Core UI library.
- **[Vite](https://vitejs.dev/)**: Extremely fast frontend tooling.
- **[Supabase](https://supabase.com/)**: Backend-as-a-Service integration for auth, database, and storage.
- **[Recharts](https://recharts.org/)**: For composable and responsive charting.
- **[Lucide React](https://lucide.dev/)**: For clean, modern iconography.

*(Note: [Leaflet](https://leafletjs.com/) and React-Leaflet dependencies are installed and will be utilized for the future map integrations).*

## Getting Started

To run the project locally, ensure you have Node.js installed, then follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Manojiyya123/Drovexo.git
   cd drovexo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env` and fill in your Supabase variables.

4. Start the development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
