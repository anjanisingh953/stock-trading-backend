# Welcome to Stock trading backend document!

With the help of this document you can easily perform the crud operations using Postman.

# Postman
You can you all the RESTful APIs using Postman
1. create a BUY trades
  url: https://stock-trading-backend-i4go.onrender.com/api/trades
  method: POST
  json body data: {
								"stock_name": "TATA",
								"quantity": 100,
								"broker_name": "BrokerX",
								"price": 500,
								"method": "FIFO"
							} 
2. create a SELL trades
  url: https://stock-trading-backend-i4go.onrender.com/api/trades
  method: POST
  json body data: {
								"stock_name": "TATA",
								"quantity":  -50,
								"broker_name": "BrokerX",
								"price": 500,
								"method": "FIFO"
							} 
3. Get all trades
  url: https://stock-trading-backend-i4go.onrender.com/api/trades
  method: GET
  json body data: not required

4. Get all FIFO Lots
  url: https://stock-trading-backend-i4go.onrender.com/api/lots/FIFO
  method: GET
  json body data: not required

5. Get all LIFO Lots
  url: https://stock-trading-backend-i4go.onrender.com/api/lots/LIFO
  method: GET
  json body data: not required
