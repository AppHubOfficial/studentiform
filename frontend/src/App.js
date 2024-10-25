import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';

import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Page404 from './pages/Page404.jsx';
import Profilo from './pages/Profilo.jsx';
import Impostazioni from './pages/Impostazioni.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/profilo",
    element: <Profilo />,
  },
  {
    path: "/impostazioni",
    element: <Impostazioni />,
  },
  {
    path: "*",
    element: <Page404 />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
