import { StrictMode } from 'react' // Keep this import
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext.jsx'
// Ensure this variable is correctly picked up by Vite
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("VITE_CLERK_PUBLISHABLE_KEY loaded:", PUBLISHABLE_KEY);
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key from Clerk. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.");
}

if (!PUBLISHABLE_KEY) {
  // Good check, keeps you informed if the key is missing
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  // Wrap your entire application with StrictMode for best practices

    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ClerkProvider>
 // NO COMMA HERE
)