import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import "./App.css";
import App from "./App.jsx";
import Suc from "./Suc.jsx";
import Alert from "./Alert.jsx";
import Place from "./Place.jsx";
import Problem from "./Pract.jsx";
import Chat from "./Chat.jsx";
import Im from "./Im.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/Im/:id/:sno",
    element:<Im/>,
  },
  {
    path:"/Chat/:id/:sno",
    element:<Chat></Chat>,
  },
  {
    path: "/Suc/:id/:sno",
    element: <Suc />,
  },
  {
    path:"/Place/:id/:sno",
    element:<Place/>,
  },
  {
    path:"/alert/:id/:sno",
    element:<Alert></Alert>,
  },
  {
    path:"/Problem/:id/:sno",
    element:<Problem></Problem>,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
