import { key } from './apikey.js'

export const loadTicker = tickers =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(',')}&api_key=${key}`
  ).then(res => res.json())
