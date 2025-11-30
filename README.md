# Smart Supply - Frontend 🍽️📦

User interface for **Smart Supply**, a comprehensive restaurant and inventory management system. This application handles everything from inventory and suppliers to order taking and sales analysis, featuring specific roles for waiters, chefs, captains, and administrators.

## 🚀 Tech Stack

Built with a modern, typed stack:

* **Core:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) (Radix UI)
* **Icons:** Lucide React
* **Charts:** Recharts (for Dashboard and KPIs)
* **Authentication:** Auth0
* **Routing:** React Router Dom

## ✨ Key Features

* **Interactive Dashboard:** Visualization of KPIs, sales, top recipes, and low stock alerts.
* **Inventory Management:** CRUD for products, ingredients, and shrinkage tracking.
* **Smart Recipes:** Creation of recipes linked to inventory for automatic cost calculation.
* **User Roles:**
    * 👨‍🍳 **Chef:** Kitchen Display System for orders (`ChefOrdersPage`).
    * 🤵 **Waiter:** Order taking and table management (`WaiterOrdersPage`).
    * 👮 **Captain:** Operations supervision.
    * 🛠️ **Admin:** Full access to settings and users.
* **AI Supplier Management:** `LowStockSupplierAI` module for restocking suggestions.
* **Point of Sale (POS):** Shopping cart, cash sessions (opening/closing), and payments.

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <REPOSITORY_URL>
    cd smart-supply-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory based on the following example:

    ```env
    VITE_API_URL=http://localhost:4000/api  # Or your backend URL
    VITE_AUTH0_DOMAIN=your-domain.auth0.com
    VITE_AUTH0_CLIENT_ID=your-client-id
    VITE_AUTH0_AUDIENCE=your-api-audience
    ```

4.  **Run in development:**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

* `/src/api`: Backend connections (Axios/Fetch).
* `/src/auth`: Auth0 configuration and route protection.
* `/src/components`: Reusable components (UI, Tables, Charts).
* `/src/forms`: Complex forms (Recipes, Products, Suppliers).
* `/src/pages`: Main views organized by functionality.
* `/src/types`: Shared TypeScript type definitions.

---
