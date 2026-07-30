import { GlobalStyles } from '@mui/material'

/**
 * MUI's CssBaseline already normalizes browser defaults (margins, box-sizing,
 * font smoothing, etc). This component only adds the handful of app-level
 * resets CssBaseline intentionally leaves out.
 */
export function GlobalReset() {
  return (
    <GlobalStyles
      styles={{
        'html, body, #root': {
          height: '100%',
        },
        '#root': {
          display: 'flex',
          flexDirection: 'column',
        },
        'img, picture, svg, video': {
          display: 'block',
          maxWidth: '100%',
        },
      }}
    />
  )
}
