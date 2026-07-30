import { http, HttpResponse } from 'msw'
import type { AuctionLot } from '@entities/auction-lot'

const auctionLots: AuctionLot[] = [
  {
    id: 'lot-1',
    title: 'Refrigerated cargo, Berlin → Warsaw',
    origin: 'Berlin, DE',
    destination: 'Warsaw, PL',
    currentBid: 1200,
    currency: 'USD',
  },
  {
    id: 'lot-2',
    title: 'Dry van, Rotterdam → Lyon',
    origin: 'Rotterdam, NL',
    destination: 'Lyon, FR',
    currentBid: 950,
    currency: 'USD',
  },
  {
    id: 'lot-3',
    title: 'Flatbed, Kraków → Vienna',
    origin: 'Kraków, PL',
    destination: 'Vienna, AT',
    currentBid: 780,
    currency: 'USD',
  },
]

export const auctionLotHandlers = [
  http.get('/api/auction-lots', () => HttpResponse.json(auctionLots)),
]
