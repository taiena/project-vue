import { key } from './apikey.js'

export const loadTicker = tickerName =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${key}`
  ).then(res => res.json())
