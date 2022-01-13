import { key } from './apikey.js'

export const loadTicker = tickers =>
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
      ','
    )}&tsyms=USD&api_key=${key}`
  )
  .then(res => res.json())
  .then(rawData => Object.fromEntries(
    Object.entries(rawData).map(([key, value]) => [key, value.USD])
  ))
