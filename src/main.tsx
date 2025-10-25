import ReactDOM from 'react-dom/client'
import MeetingPage from "./Pages/MeetingPage.js"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Not Found</div>,
    children: [
      
      {
        path: "meeting/:id",
        element: <MeetingPage/> 
      }

    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
  </QueryClientProvider>
)