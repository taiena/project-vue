import { key } from './apikey.js'

// the map stores a list of functions for each key 
// that must be received when the ticker key changes
const tickersHandlers = new Map()
console.log("tickersHandlers: ", tickersHandlers)

const loadTickers = tickersHandlers => {
  console.log("tickersHandlers from loadTickers: ", tickersHandlers)
  if (tickersHandlers.size == 0) {
    return
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
     ...tickersHandlers.keys()]    
     .join(',')}&tsyms=USD&api_key=${key}`
  )
  .then(res => res.json())
  .then(rawData => {
    const updatedPrices = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value.USD])
    )
    Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
      const handlers = tickersHandlers.get(currency) ?? []
      handlers.forEach(fn => fn(newPrice))
    })
  })
}
  

// when subscribing to a ticker, call a function
export const subscribeToTicker = (ticker, callback) => {
  console.log("subscribeToTicker: ", ticker, callback)
  // extract here all functions from this ticker
  const subscribers = tickersHandlers.get(ticker) || []
  // set new function to ticker
  tickersHandlers.set(ticker, [...subscribers, callback])
}


export const unsubscribeFromTicker = (ticker, callback) => {
  console.log("unsubscribeFromTicker: ", ticker, callback)
  const subscribers = tickersHandlers.get(ticker) || []
  // remove function from ticker
  // filtering a function that is different from the callback
  tickersHandlers.set(ticker, subscribers.filter(fn => fn !== callback))
}

setInterval(loadTickers, 5000, tickersHandlers)

