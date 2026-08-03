import { Alert, Snackbar } from '@mui/material'
import { useCallback, useMemo, useState, type PropsWithChildren } from 'react'
import { ToastContext } from './ToastContext'

interface ToastState {
  message: string
  severity: 'success' | 'error'
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showSuccess = useCallback(
    (message: string) => setToast({ message, severity: 'success' }),
    [],
  )
  const showError = useCallback((message: string) => setToast({ message, severity: 'error' }), [])
  const handleClose = useCallback(() => setToast(null), [])

  const value = useMemo(() => ({ showSuccess, showError }), [showSuccess, showError])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast != null}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ bottom: (theme) => theme.spacing(2), right: (theme) => theme.spacing(2) }}
      >
        {toast ? (
          <Alert
            onClose={handleClose}
            severity={toast.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  )
}
