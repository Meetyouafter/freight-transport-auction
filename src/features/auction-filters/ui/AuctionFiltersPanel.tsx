import { zodResolver } from '@hookform/resolvers/zod'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
  Autocomplete,
  Badge,
  Box,
  Collapse,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { CITIES, type City } from '@entities/city'
import { surfaceTokens } from '@shared/theme/tokens'
import { AppButton } from '@shared/ui'
import { useFiltersPanelStore } from '../model/filtersPanelStore'
import { mapFiltersToRequest } from '../model/mapFiltersToRequest'
import {
  AUCTION_STATUS_OPTIONS,
  AUC_TYPE_OPTIONS,
  BODY_TYPE_OPTIONS,
  STATUS_OPTIONS,
} from '../model/options'
import {
  auctionFiltersFormSchema,
  defaultAuctionFiltersFormValues,
  type AuctionFiltersFormValues,
} from '../model/schema'
import { DateFilterField } from './DateFilterField'
import { MultiSelectFilterField } from './MultiSelectFilterField'
import { SwitchFilterField } from './SwitchFilterField'

interface AuctionFiltersPanelProps {
  values: AuctionFiltersFormValues
  onApply: (values: AuctionFiltersFormValues) => void
  onReset: () => void
}

export function AuctionFiltersPanel({ values, onApply, onReset }: AuctionFiltersPanelProps) {
  const { register, control, handleSubmit, reset } = useForm<AuctionFiltersFormValues>({
    resolver: zodResolver(auctionFiltersFormSchema),
    values,
  })
  const submit = handleSubmit(onApply)
  const { isOpen: open, toggle } = useFiltersPanelStore()
  const hasActiveFilters = Object.values(mapFiltersToRequest(values)).some(
    (value) => value !== undefined,
  )

  const handleReset = () => {
    reset(defaultAuctionFiltersFormValues)
    onReset()
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Stack
          direction="row"
          spacing={1}
          onClick={toggle}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggle()
            }
          }}
          sx={{
            alignItems: 'center',
            width: 'fit-content',
            cursor: 'pointer',
            userSelect: 'none',
            px: 1.5,
            py: 0.75,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            transition: 'background-color 0.15s ease, border-color 0.15s ease',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'primary.main',
            },
          }}
        >
          <Badge color="primary" variant="dot" invisible={!hasActiveFilters}>
            <FilterListIcon color="primary" fontSize="small" />
          </Badge>
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
            Фильтры
          </Typography>
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </Stack>
      </Box>

      <Collapse in={open} unmountOnExit>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: { xs: 0, sm: 2 },
            mt: 2,
            mx: { xs: -2, sm: 0 },
            bgcolor: 'transparent',
            boxShadow: surfaceTokens.cardShadow,
          }}
        >
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Номер груза" size="small" fullWidth {...register('cargo_num')} />
              <TextField label="Заказчик" size="small" fullWidth {...register('customer')} />
            </Stack>

            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="auc_type"
                control={control}
                render={({ field }) => (
                  <MultiSelectFilterField
                    label="Тип аукциона"
                    options={AUC_TYPE_OPTIONS}
                    value={AUC_TYPE_OPTIONS.filter((option) => field.value.includes(option.value))}
                    onChange={(selected) => {
                      field.onChange(selected.map((option) => option.value))
                      void submit()
                    }}
                  />
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <MultiSelectFilterField
                    label="Статус торгов"
                    options={STATUS_OPTIONS}
                    value={STATUS_OPTIONS.filter((option) => field.value.includes(option.value))}
                    onChange={(selected) => {
                      field.onChange(selected.map((option) => option.value))
                      void submit()
                    }}
                  />
                )}
              />
              <Controller
                name="statuses"
                control={control}
                render={({ field }) => (
                  <MultiSelectFilterField
                    label="Статус аукциона"
                    options={AUCTION_STATUS_OPTIONS}
                    value={AUCTION_STATUS_OPTIONS.filter((option) =>
                      field.value.includes(option.value),
                    )}
                    onChange={(selected) => {
                      field.onChange(selected.map((option) => option.value))
                      void submit()
                    }}
                  />
                )}
              />
              <Controller
                name="body_types"
                control={control}
                render={({ field }) => (
                  <MultiSelectFilterField
                    label="Тип кузова"
                    options={BODY_TYPE_OPTIONS}
                    value={BODY_TYPE_OPTIONS.filter((option) => field.value.includes(option.value))}
                    onChange={(selected) => {
                      field.onChange(selected.map((option) => option.value))
                      void submit()
                    }}
                  />
                )}
              />
            </Stack>

            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="load_city"
                control={control}
                render={({ field }) => (
                  <Autocomplete<City>
                    fullWidth
                    size="small"
                    options={CITIES}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.gcId === value.gcId}
                    value={field.value}
                    onChange={(_, selected) => {
                      field.onChange(selected)
                      void submit()
                    }}
                    renderInput={(params) => <TextField {...params} label="Город погрузки" />}
                  />
                )}
              />
              <Controller
                name="unload_city"
                control={control}
                render={({ field }) => (
                  <Autocomplete<City>
                    fullWidth
                    size="small"
                    options={CITIES}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.gcId === value.gcId}
                    value={field.value}
                    onChange={(_, selected) => {
                      field.onChange(selected)
                      void submit()
                    }}
                    renderInput={(params) => <TextField {...params} label="Город выгрузки" />}
                  />
                )}
              />
            </Stack>

            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="load_date_from"
                control={control}
                render={({ field }) => (
                  <DateFilterField
                    label="Дата погрузки от"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      void submit()
                    }}
                  />
                )}
              />
              <Controller
                name="load_date_to"
                control={control}
                render={({ field }) => (
                  <DateFilterField
                    label="Дата погрузки до"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      void submit()
                    }}
                  />
                )}
              />
            </Stack>

            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Цена от"
                type="number"
                size="small"
                fullWidth
                {...register('price_from')}
              />
              <TextField
                label="Цена до"
                type="number"
                size="small"
                fullWidth
                {...register('price_to')}
              />
            </Stack>

            <Divider />

            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <Controller
                name="is_favorite"
                control={control}
                render={({ field }) => (
                  <SwitchFilterField
                    label="Избранные"
                    checked={field.value}
                    onChange={(checked) => {
                      field.onChange(checked)
                      void submit()
                    }}
                  />
                )}
              />
              <Controller
                name="is_bidder"
                control={control}
                render={({ field }) => (
                  <SwitchFilterField
                    label="Я участвую"
                    checked={field.value}
                    onChange={(checked) => {
                      field.onChange(checked)
                      void submit()
                    }}
                  />
                )}
              />
              <Controller
                name="is_available"
                control={control}
                render={({ field }) => (
                  <SwitchFilterField
                    label="Доступные"
                    checked={field.value}
                    onChange={(checked) => {
                      field.onChange(checked)
                      void submit()
                    }}
                  />
                )}
              />
            </Stack>

            <Divider />

            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
              <AppButton type="button" variant="outlined" onClick={handleReset}>
                Сбросить
              </AppButton>
              <AppButton type="submit">Применить</AppButton>
            </Stack>
          </Stack>
        </Paper>
      </Collapse>
    </Box>
  )
}
