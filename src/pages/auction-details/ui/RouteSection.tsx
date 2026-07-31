import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined'
import CallIcon from '@mui/icons-material/CallOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import { Stack, Typography } from '@mui/material'
import { OPERATION_TYPE_LABELS, type RoutePoint } from '@entities/auction'
import { formatDateWindow } from '@shared/lib/format/formatDate'
import { IconText, RestrictedField, SectionCard } from '@shared/ui'

const INTERMEDIATE_POINT_LABEL = 'Промежуточная точка'

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
    <SectionCard title="Маршрут">
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

              <IconText icon={<CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}>
                {formatDateWindow(point.start_date, point.end_date)}
              </IconText>

              {hideAddressAndContacts ? (
                <RestrictedField reason="Адрес и контакты станут доступны после подтверждения сделки" />
              ) : (
                <>
                  {point.location.loading_address && (
                    <IconText
                      icon={<PlaceOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
                    >
                      {point.location.loading_address}
                    </IconText>
                  )}
                  {point.contact.name && (
                    <IconText
                      icon={<PersonOutlineIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
                    >
                      {point.contact.name}
                    </IconText>
                  )}
                  {point.contact.phone && (
                    <IconText icon={<CallIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}>
                      {point.contact.phone}
                    </IconText>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  )
}
