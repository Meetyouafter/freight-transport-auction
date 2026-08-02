import type { AuctionSeed } from './makeAuctionFixture'

/**
 * The mocked dataset behind the three hand-written fixtures.
 *
 * It is laid out as a matrix on purpose: every `AuctionStatus`, every `status_mobile`, every
 * `auc_type` (including the `Unknown` fallbacks) and every restriction flag appears at least once,
 * prices/dates/cities/customers are spread so each filter cuts a different slice, and there are
 * enough records — and enough of them with a bid of ours — to page through both list screens.
 *
 * Fields not set here are derived from `id`: route cities, dates, cargo, body type and organizer
 * rotate through their lists (see `makeAuctionFixture`).
 */
export const auctionSeeds: AuctionSeed[] = [
  // --- Auction: live trading, every trading status and auction type -----------------------------
  {
    id: 1301,
    aucType: 'Up',
    status: 'Auction',
    statusMobile: 'Leading',
    current: 74000,
    isFavorite: true,
  },
  {
    id: 1302,
    aucType: 'Down',
    status: 'Auction',
    statusMobile: 'Losing',
    current: 96000,
    step: 2000,
    myBet: 98000,
  },
  {
    id: 1303,
    aucType: 'Request',
    status: 'Auction',
    statusMobile: 'NotParticipating',
    current: 140000,
    step: 2500,
  },
  {
    id: 1304,
    aucType: 'FixPrice',
    status: 'Auction',
    statusMobile: 'NotParticipating',
    current: 42000,
  },
  {
    id: 1305,
    aucType: 'Up',
    status: 'Auction',
    statusMobile: 'NotParticipating',
    current: 88000,
    step: 1500,
    isFavorite: true,
  },
  {
    id: 1306,
    aucType: 'Down',
    status: 'Auction',
    statusMobile: 'Leading',
    current: 34000,
    hideAddress: true,
  },
  {
    id: 1307,
    aucType: 'Up',
    status: 'Auction',
    statusMobile: 'Losing',
    current: 51000,
    myBet: 50000,
    hideBetsHistory: true,
  },
  {
    id: 1308,
    aucType: 'Request',
    status: 'Auction',
    statusMobile: 'Leading',
    current: 63000,
    step: 500,
  },
  {
    id: 1309,
    aucType: 'Down',
    status: 'Auction',
    statusMobile: 'NotParticipating',
    current: 118000,
    step: 2000,
    hideCargoPrice: true,
  },
  {
    id: 1310,
    aucType: 'FixPrice',
    status: 'Auction',
    statusMobile: 'Losing',
    current: 27000,
    myBet: 28000,
  },
  // `Unknown` values are legal in the API enums — they must render a label, not an empty badge.
  {
    id: 1311,
    aucType: 'Unknown',
    status: 'Auction',
    statusMobile: 'NotParticipating',
    current: 45000,
  },
  {
    id: 1312,
    aucType: 'Up',
    status: 'Auction',
    statusMobile: 'Unknown',
    current: 62000,
    isFavorite: true,
  },
  {
    id: 1331,
    aucType: 'Up',
    status: 'Auction',
    statusMobile: 'Leading',
    current: 205000,
    step: 5000,
    isFavorite: true,
  },
  {
    id: 1332,
    aucType: 'Down',
    status: 'Auction',
    statusMobile: 'Losing',
    current: 21000,
    step: 500,
    myBet: 22000,
  },
  {
    id: 1333,
    aucType: 'Request',
    status: 'Auction',
    statusMobile: 'NotParticipating',
    current: 156000,
    step: 2000,
    isFavorite: true,
  },

  // --- Planning: trading has not started yet ----------------------------------------------------
  {
    id: 1313,
    aucType: 'Up',
    status: 'Planning',
    statusMobile: 'NotParticipating',
    current: 58000,
    isFavorite: true,
  },
  {
    id: 1314,
    aucType: 'Down',
    status: 'Planning',
    statusMobile: 'NotParticipating',
    current: 76000,
    step: 1500,
  },

  // --- DeterminateWinner: bidding closed, organiser is choosing ---------------------------------
  {
    id: 1315,
    aucType: 'Up',
    status: 'DeterminateWinner',
    statusMobile: 'Leading',
    current: 92000,
    step: 2000,
  },
  {
    id: 1316,
    aucType: 'Down',
    status: 'DeterminateWinner',
    statusMobile: 'Losing',
    current: 210000,
    step: 5000,
    myBet: 215000,
  },

  // --- WaitDeal: winner picked, deal not signed -------------------------------------------------
  {
    id: 1317,
    aucType: 'Up',
    status: 'WaitDeal',
    statusMobile: 'Winner',
    current: 51000,
    isFavorite: true,
  },
  {
    id: 1318,
    aucType: 'Request',
    status: 'WaitDeal',
    statusMobile: 'Confirmed',
    current: 39000,
    step: 500,
  },

  // --- InProgress: the shipment is running ------------------------------------------------------
  {
    id: 1319,
    aucType: 'Down',
    status: 'InProgress',
    statusMobile: 'Confirmed',
    current: 47000,
    hideBetsHistory: true,
  },
  { id: 1320, aucType: 'FixPrice', status: 'InProgress', statusMobile: 'Winner', current: 68000 },

  // --- Finished ---------------------------------------------------------------------------------
  {
    id: 1321,
    aucType: 'Up',
    status: 'Finished',
    statusMobile: 'Winner',
    current: 118000,
    step: 2000,
  },
  {
    id: 1322,
    aucType: 'Down',
    status: 'Finished',
    statusMobile: 'Losing',
    current: 46000,
    myBet: 47000,
  },
  {
    id: 1323,
    aucType: 'Request',
    status: 'Finished',
    statusMobile: 'NotParticipating',
    current: 84000,
    step: 1500,
  },
  { id: 1324, aucType: 'FixPrice', status: 'Finished', statusMobile: 'Confirmed', current: 132000 },

  // --- Stopped / Canceled -----------------------------------------------------------------------
  {
    id: 1325,
    aucType: 'Up',
    status: 'Stopped',
    statusMobile: 'NotParticipating',
    current: 105000,
    step: 2500,
  },
  {
    id: 1326,
    aucType: 'Down',
    status: 'Stopped',
    statusMobile: 'Losing',
    current: 92000,
    step: 2000,
    myBet: 94000,
  },
  { id: 1327, aucType: 'Up', status: 'Canceled', statusMobile: 'NotParticipating', current: 73000 },
  {
    id: 1328,
    aucType: 'Request',
    status: 'Canceled',
    statusMobile: 'Losing',
    current: 61000,
    myBet: 62000,
  },

  // --- Unknown auction status -------------------------------------------------------------------
  { id: 1329, aucType: 'Unknown', status: 'Unknown', statusMobile: 'Unknown', current: 55000 },
  {
    id: 1330,
    aucType: 'FixPrice',
    status: 'Unknown',
    statusMobile: 'NotParticipating',
    current: 245000,
  },
]
