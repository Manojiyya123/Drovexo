# Drovexo

Drovexo is a modern web-based platform designed for comprehensive logistics and rider fleet management. It features a robust Admin Dashboard equipped with operational tools for real-time tracking, stateful rider management (including biometric and status vetting), financial reporting, and advanced logistics dispatch capabilities.

## Key Features

- **Admin Dashboard**: Centralized operational suite for managing fleet activities and dispatching tasks.
- **Rider Fleet Management**: Stateful management for onboarding, biometric checking, and status tracking.
- **Real-Time Data Visualization**: Interactive charts for financial reporting and operational analytics.
- **Geospatial Tracking**: Map integrations for monitoring delivery routing and logistics.
- **Responsive UI**: A polished, adaptable interface catering to both administrators and end-users.

## Tech Stack

This project is built with a modern frontend stack:
- **[React](https://react.dev/)**: Core UI library.
- **[Vite](https://vitejs.dev/)**: Extremely fast frontend tooling.
- **[Leaflet](https://leafletjs.com/) & React-Leaflet**: For robust, interactive maps.
- **[Supabase](https://supabase.com/)**: Backend-as-a-Service integration for auth, database, and storage.
- **[Recharts](https://recharts.org/)**: For composable and responsive charting.
- **[Lucide React](https://lucide.dev/)**: For clean, modern iconography.

## Getting Started

To run the project locally, ensure you have Node.js installed, then follow these steps:

1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
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

5. Build for production:
   ```bash
   npm run build
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
