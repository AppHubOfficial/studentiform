import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MyForm from './component/Form-exstudenti.jsx';
import Homepage from './component/Homepage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/form-exstudenti",
    element: <MyForm />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
