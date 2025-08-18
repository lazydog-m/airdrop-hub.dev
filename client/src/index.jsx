import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LoadingProvider } from './contexts/LoadingContext'
import { NofiticationProvider } from './contexts/NotificationContext'
import { CollapseProvider } from './contexts/CollapseContext'
import { Toaster } from "@/components/ui/sonner"
import { SpinnerProvider } from './contexts/SpinnerContext.jsx'
import { MessageProvider } from './contexts/MessageContext.jsx'
import { SocketProvider } from './contexts/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <SocketProvider>
      <MessageProvider>
        <LoadingProvider>
          <SpinnerProvider>
            <NofiticationProvider>
              <CollapseProvider>
                <BrowserRouter>
                  <Toaster />
                  <App />
                </BrowserRouter>
              </CollapseProvider>
            </NofiticationProvider>
          </SpinnerProvider>
        </LoadingProvider>
      </MessageProvider>
    </SocketProvider>
  </HelmetProvider>
)
