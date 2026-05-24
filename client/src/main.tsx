// main.tsx - Application entry point
// Mounts the React app into the #root div defined in index.html.
// StrictMode enables additional runtime warnings during development.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://5b4e5e683f0d055e995c2733153969b7@o4511442764169216.ingest.us.sentry.io/4511442766987264",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
)
