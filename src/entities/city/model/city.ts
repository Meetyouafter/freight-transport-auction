import { z } from 'zod'

export const citySchema = z.object({
  name: z.string(),
  gcId: z.number().int(),
  lon: z.number(),
  lat: z.number(),
})
export type City = z.infer<typeof citySchema>

export const CITIES: City[] = [
  { name: 'Пермь', gcId: 59, lon: 56.238, lat: 58.01 },
  { name: 'Москва', gcId: 100, lon: 37.617, lat: 55.752 },
  { name: 'Екатеринбург', gcId: 240, lon: 60.597, lat: 56.838 },
  { name: 'Новосибирск', gcId: 310, lon: 82.92, lat: 55.03 },
  { name: 'Казань', gcId: 43, lon: 49.108, lat: 55.796 },
  { name: 'Самара', gcId: 36, lon: 50.15, lat: 53.195 },
  { name: 'Санкт-Петербург', gcId: 2, lon: 30.315, lat: 59.939 },
  { name: 'Ростов-на-Дону', gcId: 158, lon: 39.72, lat: 47.222 },
  { name: 'Краснодар', gcId: 70, lon: 38.976, lat: 45.035 },
  { name: 'Воронеж', gcId: 80, lon: 39.19, lat: 51.66 },
]
