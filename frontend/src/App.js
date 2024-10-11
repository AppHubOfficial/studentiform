import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Page404 from './pages/Page404'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Page404 />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
