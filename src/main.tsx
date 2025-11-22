import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { QueryClient, QueryClientProvider} from "react-query";


const queryClient = new QueryClient({
  defaultOptions: {
    queries:{
      staleTime: 5 * 60 * 1000,      // 5 min: evita refetch constante
      gcTime: 30 * 60 * 1000,        // 30 min en caché
      refetchOnWindowFocus: false,   // ya lo tenías
      refetchOnReconnect: false,
      retry: 1,
        
      // refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <Auth0ProviderWithNavigate>
          <AppRoutes/>
        </Auth0ProviderWithNavigate>
      </QueryClientProvider>
      
    </Router>
   </StrictMode>,
)
