import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // or 'react-router' if you are on v7
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';

// 1. Define your router configuration
const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
]);

// 2. Pass the router to the RouterProvider in your main App component
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;