import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChatPage, Dashboard, Home, SignInPage, SignUpPage } from './pages/index.js'
import RootLayout from './layouts/RootLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'



// Import your publishable key


const router =createBrowserRouter([
  {
    element:<RootLayout />,
    children:[
      {
        path:"/",
        element:<Home />
      },
      {
        path:"/sign-in",
        element:<SignInPage />
      },
      {
        path:"/sign-up",
        element:<SignUpPage />
      },
      // due to the navbar also being needed we added this as a sub of the first element
      {
        element:<DashboardLayout />,
        children:[
          {
            path:"/dashboard",
            element:<Dashboard />
          },
          {
            path:"/dashboard/chats/:id",
            element:<ChatPage />
          },
        ]
      }
    ]
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>,
)
