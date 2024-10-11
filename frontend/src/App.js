import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './component/Homepage.jsx';
import FormExStudenti from './component/Form-exstudenti.jsx';
import FormInsegnanti from './component/Form-Insegnanti.jsx';
import FormLogin from './component/Login.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/form-insegnanti",
    element: <FormInsegnanti />,
  },
  {
    path: "/form-exstudenti",
    element: <FormExStudenti />,
  },
  {
    path: "/login",
    element: <FormLogin />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
