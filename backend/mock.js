import yahooFinance from 'yahoo-finance2';

const getStock = async (symbol) => {
  const result = await yahooFinance.quote(symbol);
  console.log(result);
};

getStock('BAJFINANCE.NS'); // Apple stock
