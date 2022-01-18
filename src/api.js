import { key } from './apikey.js'

// the map stores a list of functions for each key 
// that must be received when the ticker key changes
const tickersHandlers = new Map()
console.log("tickersHandlers: ", tickersHandlers)

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${key}`
)

const AGGREGATE_INDEX = "5"

socket.addEventListener("message", e => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(
    e.data
  )
  
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return
  }

  const handlers = tickersHandlers.get(currency) ?? []
  handlers.forEach(fn => fn(newPrice))
})

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message)

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage)
    return
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage)
    },
    { once: true }
  )
}
  
function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  })
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  })
}


export const subscribeToTicker = (ticker, callback) => {
  console.log("subscribeToTicker: ", ticker, callback)
  // extract here all functions from this ticker
  const subscribers = tickersHandlers.get(ticker) || []
  // set new function to ticker
  tickersHandlers.set(ticker, [...subscribers, callback])
  subscribeToTickerOnWs(ticker)
}


export const unsubscribeFromTicker = (ticker) => {
  console.log("unsubscribeFromTicker: ", ticker)
  tickersHandlers.delete(ticker)
  unsubscribeFromTickerOnWs(ticker)
}

