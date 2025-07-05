import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardPage from './pages/Dashboard';
import LoginSignup from './pages/LoginSignUp';
import CompanyDetails from './pages/CompanyDetails';

let allRoutes=createBrowserRouter(
  [
    {
      path: '/admin/dashboard',
      element:<AuthProvider><ProtectedRoute><DashboardPage /></ProtectedRoute></AuthProvider>
    },
  {
      path: '/admin/login',
      element:<AuthProvider><LoginSignup/></AuthProvider>
    },
    {
      path:"/admin/company/:id/:name",
      element:<AuthProvider><CompanyDetails/></AuthProvider>
    }
  ]
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={allRoutes}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
