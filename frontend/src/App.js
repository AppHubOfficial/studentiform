import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Page404 />,
    children: [
      {
        path: "/",
        element: <Home />, 
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/chatroom",
        element: <ChatRoom />,
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
