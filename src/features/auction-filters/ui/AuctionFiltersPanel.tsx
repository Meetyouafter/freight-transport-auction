import { zodResolver } from '@hookform/resolvers/zod'
import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
  Autocomplete,
  Badge,
  Box,
  Chip,
  Collapse,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import type { AutocompleteRenderValueGetItemProps } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { AuctionTypeFilter, TradingStatus } from '@entities/auction'
import { CITIES, type City } from '@entities/city'
import { AppButton } from '@shared/ui'
import { mapFiltersToRequest } from '../model/mapFiltersToRequest'
import {
  auctionFiltersFormSchema,
  defaultAuctionFiltersFormValues,
  type AuctionFiltersFormValues,
} from '../model/schema'

function renderMultiOption(
  props: React.HTMLAttributes<HTMLLIElement> & { key: React.Key },
  label: string,
  selected: boolean,
) {
  const { key, ...rest } = props

  return (
    <li key={key} {...rest}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}
      >
        <span>{label}</span>
        {selected && <CheckIcon fontSize="small" color="primary" />}
      </Stack>
    </li>
  )
}

const singleLineTagsSx = {
  '& .MuiAutocomplete-inputRoot': {
    flexWrap: 'nowrap',
  },
  '& .MuiAutocomplete-inputRoot:not(.Mui-focused) .MuiAutocomplete-input': {
    width: 0,
    minWidth: 0,
    padding: 0,
  },
} as const

function renderLimitedTags<T extends { label: string }>(
  options: T[],
  getItemProps: AutocompleteRenderValueGetItemProps<true>,
) {
  const [first, ...rest] = options

  if (!first) return null

  return (
    <>
      <Chip size="small" label={first.label} {...getItemProps({ index: 0 })} />
      {rest.length > 0 && <Chip size="small" label={`+${rest.length}`} />}
    </>
  )
}

const AUC_TYPE_OPTIONS: { value: AuctionTypeFilter; label: string }[] = [
  { value: 'Request', label: 'Запрос цены' },
  { value: 'Up', label: 'На повышение' },
  { value: 'Down', label: 'На понижение' },
  { value: 'FixPrice', label: 'Фикс. цена' },
]

const STATUS_OPTIONS: { value: TradingStatus; label: string }[] = [
  { value: 'NotParticipating', label: 'Не участвую' },
  { value: 'Leading', label: 'Лидирую' },
  { value: 'Losing', label: 'Проигрываю' },
  { value: 'Winner', label: 'Победитель' },
  { value: 'Confirmed', label: 'Подтверждено' },
]

const AUCTION_STATUS_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'Планирование' },
  { value: 2, label: 'Торги идут' },
  { value: 3, label: 'Определение победителя' },
  { value: 4, label: 'Ожидание сделки' },
  { value: 5, label: 'В работе' },
  { value: 6, label: 'Завершён' },
  { value: 7, label: 'Остановлен' },
  { value: 8, label: 'Отменён' },
]

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
  const [open, setOpen] = useState(false)
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
          onClick={() => setOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen((prev) => !prev)
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
            boxShadow: 4,
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
                  <Autocomplete
                    multiple
                    fullWidth
                    size="small"
                    disableCloseOnSelect
                    sx={singleLineTagsSx}
                    options={AUC_TYPE_OPTIONS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={AUC_TYPE_OPTIONS.filter((option) => field.value.includes(option.value))}
                    onChange={(_, selected) => {
                      field.onChange(selected.map((option) => option.value))
                      void submit()
                    }}
                    renderOption={(props, option, { selected }) =>
                      renderMultiOption(props, option.label, selected)
                    }
                    renderValue={renderLimitedTags}
                    renderInput={(params) => <TextField {...params} label="Тип аукциона" />}
                  />
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    fullWidth
                    size="small"
                    disableCloseOnSelect
                    sx={singleLineTagsSx}
                    options={STATUS_OPTIONS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={STATUS_OPTIONS.filter((option) => field.value.includes(option.value))}
                    onChange={(_, selected) => {
                      field.onChange(selected.map((option) => option.value))
                      void submit()
                    }}
                    renderOption={(props, option, { selected }) =>
                      renderMultiOption(props, option.label, selected)
                    }
                    renderValue={renderLimitedTags}
                    renderInput={(params) => <TextField {...params} label="Статус торгов" />}
                  />
                )}
              />
              <Controller
                name="statuses"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    fullWidth
                    size="small"
                    disableCloseOnSelect
                    sx={singleLineTagsSx}
                    options={AUCTION_STATUS_OPTIONS}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={AUCTION_STATUS_OPTIONS.filter((option) =>
                      field.value.includes(option.value),
                    )}
                    onChange={(_, selected) => {
                      field.onChange(selected.map((option) => option.value))
                      void submit()
                    }}
                    renderOption={(props, option, { selected }) =>
                      renderMultiOption(props, option.label, selected)
                    }
                    renderValue={renderLimitedTags}
                    renderInput={(params) => <TextField {...params} label="Статус аукциона" />}
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
                  <DatePicker
                    label="Дата погрузки от"
                    format="DD.MM.YYYY"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date?.isValid() ? date.format('YYYY-MM-DD') : '')
                      void submit()
                    }}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                )}
              />
              <Controller
                name="load_date_to"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Дата погрузки до"
                    format="DD.MM.YYYY"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date?.isValid() ? date.format('YYYY-MM-DD') : '')
                      void submit()
                    }}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
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
                  <FormControlLabel
                    sx={{ ml: 0 }}
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked)
                          void submit()
                        }}
                      />
                    }
                    label="Избранные"
                  />
                )}
              />
              <Controller
                name="is_bidder"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    sx={{ ml: 0 }}
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked)
                          void submit()
                        }}
                      />
                    }
                    label="Я участвую"
                  />
                )}
              />
              <Controller
                name="is_available"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    sx={{ ml: 0 }}
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked)
                          void submit()
                        }}
                      />
                    }
                    label="Доступные"
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
