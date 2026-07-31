import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined'
import CallIcon from '@mui/icons-material/CallOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { Paper, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { OPERATION_TYPE_LABELS, type RoutePoint } from '@entities/auction'
import { RestrictedField } from '@shared/ui'

const INTERMEDIATE_POINT_LABEL = 'Промежуточная точка'

function formatWindow(start: string, end: string) {
  const from = dayjs(start)
  const to = dayjs(end)

  if (from.isSame(to, 'day')) {
    return `${from.format('DD.MM.YYYY')}, ${from.format('HH:mm')}–${to.format('HH:mm')}`
  }

  return `${from.format('DD.MM.YYYY HH:mm')} – ${to.format('DD.MM.YYYY HH:mm')}`
}

function pointLabel(point: RoutePoint, index: number, total: number) {
  if (index > 0 && index < total - 1) return INTERMEDIATE_POINT_LABEL

  return OPERATION_TYPE_LABELS[point.op_type]
}

interface RouteSectionProps {
  points: RoutePoint[]
  hideAddressAndContacts: boolean
}

export function RouteSection({ points, hideAddressAndContacts }: RouteSectionProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 4 }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Маршрут
      </Typography>

      <Stack spacing={2.5}>
        {points.map((point, index) => (
          <Stack key={point.row_num} direction="row" spacing={1.5}>
            <PlaceOutlinedIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.25 }} />
            <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {pointLabel(point, index, points.length)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  · {point.location.city_full_name || point.location.city_name}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatWindow(point.start_date, point.end_date)}
                </Typography>
              </Stack>

              {hideAddressAndContacts ? (
                <RestrictedField reason="Адрес и контакты станут доступны после подтверждения сделки" />
              ) : (
                <>
                  {point.location.loading_address && (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <PlaceOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      <Typography variant="body2" color="text.secondary">
                        {point.location.loading_address}
                      </Typography>
                    </Stack>
                  )}
                  {point.contact.name && (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <PersonOutlineIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      <Typography variant="body2" color="text.secondary">
                        {point.contact.name}
                      </Typography>
                    </Stack>
                  )}
                  {point.contact.phone && (
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <CallIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      <Typography variant="body2" color="text.secondary">
                        {point.contact.phone}
                      </Typography>
                    </Stack>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Paper>
  )
}
