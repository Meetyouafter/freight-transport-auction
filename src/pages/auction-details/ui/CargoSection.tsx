import { Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import type { AuctionShowResponse } from '@entities/auction'
import { RestrictedField } from '@shared/ui'

const DOC_LABELS: Record<string, string> = { tir: 'TIR', cmr: 'CMR', t1: 'T1', med: 'Мед. книжка' }
const LOADING_LABELS: Record<string, string> = {
  side: 'Боковая',
  top: 'Верхняя',
  rear: 'Задняя',
  full: 'Полная',
}

interface CargoSectionProps {
  cargo: AuctionShowResponse['cargo']
  cargoName: string | null
  cargoWeight: string | null
  cargoVolume: string | null
  showPrice: boolean
}

export function CargoSection({
  cargo,
  cargoName,
  cargoWeight,
  cargoVolume,
  showPrice,
}: CargoSectionProps) {
  const activeDocs = Object.entries(cargo.docs).filter(([, value]) => value)
  const activeLoadingTypes = Object.entries(cargo.loading_types).filter(([, value]) => value)

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 4 }}>
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Груз и требования к ТС
      </Typography>

      <Stack spacing={1.5}>
        <Typography variant="body1">
          {cargoName ?? 'Груз'}
          {cargoWeight && ` · ${cargoWeight} т`}
          {cargoVolume && ` · ${cargoVolume} м³`}
          {` · ${cargo.body_type}`}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Chip
            size="small"
            variant="outlined"
            label={cargo.is_international ? 'Международная перевозка' : 'Перевозка по РФ'}
          />
          {cargo.containered && <Chip size="small" variant="outlined" label="Контейнер" />}
          {cargo.adr != null && (
            <Chip size="small" variant="outlined" label={`ADR: ${cargo.adr}`} />
          )}
          {(cargo.temp_from != null || cargo.temp_to != null) && (
            <Chip
              size="small"
              variant="outlined"
              label={`Температурный режим: ${cargo.temp_from ?? '—'}…${cargo.temp_to ?? '—'} °C`}
            />
          )}
          {cargo.distance != null && (
            <Chip size="small" variant="outlined" label={`Расстояние: ${cargo.distance} км`} />
          )}
          <Chip size="small" variant="outlined" label={`ТС: ${cargo.truck_count}`} />
        </Stack>

        {(activeDocs.length > 0 || activeLoadingTypes.length > 0 || cargo.car) && <Divider />}

        {activeDocs.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Документы: {activeDocs.map(([key]) => DOC_LABELS[key]).join(', ')}
          </Typography>
        )}
        {activeLoadingTypes.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Загрузка: {activeLoadingTypes.map(([key]) => LOADING_LABELS[key]).join(', ')}
          </Typography>
        )}
        {cargo.car && (
          <Typography variant="body2" color="text.secondary">
            ТС: {cargo.car.type}
            {cargo.car.weight != null && ` · до ${cargo.car.weight} т`}
            {cargo.car.volume != null && ` · ${cargo.car.volume} м³`}
            {cargo.car.length != null &&
              cargo.car.width != null &&
              cargo.car.height != null &&
              ` · ${cargo.car.length}×${cargo.car.width}×${cargo.car.height} м`}
          </Typography>
        )}

        <Divider />

        {showPrice ? (
          <Typography variant="body2" color="text.secondary">
            Заявленная стоимость груза: {cargo.price} ₽
          </Typography>
        ) : (
          <RestrictedField reason="Стоимость груза скрыта организатором" />
        )}
      </Stack>
    </Paper>
  )
}
