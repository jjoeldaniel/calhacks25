import ReactDOM from 'react-dom/client'
import MeetingPage from "./Pages/MeetingPage.js"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import HomePage from './Pages/HomePage.tsx'
import JoinPage from './Pages/JoinPage.tsx'
import { PopupContextProvider } from './Contexts/PopupContext.tsx'
import MeetingLayout from './Pages/MeetingLayout.tsx'
import { UIContextProvider } from './Contexts/UIContext.tsx'
import { SocketProvider } from './Contexts/SocketContext.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      {
        path: "/",
        element: <HomePage/>
      },
      {
        path: "/join",
        element: <JoinPage/>
      },
    ]
  },
  {
    path: '/meeting',
    element: <MeetingLayout />,
    children: [
      {
        path: ':id',
        element: <MeetingPage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <QueryClientProvider client={queryClient}>
    <SocketProvider>
      <UIContextProvider>
        <PopupContextProvider>
          <RouterProvider router={router}/>
        </PopupContextProvider>
      </UIContextProvider>
    </SocketProvider>
  </QueryClientProvider>
)