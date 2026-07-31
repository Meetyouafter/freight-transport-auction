import { Button, type ButtonProps } from '@mui/material'
import type { ElementType } from 'react'

export function AppButton<C extends ElementType = 'button'>({
  variant = 'contained',
  ...props
}: ButtonProps<C, { component?: C }>) {
  return <Button variant={variant} {...props} />
}
