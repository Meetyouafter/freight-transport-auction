import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@app/App'
import { enableMocking } from './mocks/enableMocking'

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
