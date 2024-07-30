import { z } from 'zod'
import type { ChatCompletionTool } from 'openai/resources/chat'

export const functions = [
  {
    name: 'play_pacman',
    description: 'Play pacman with the user.',
    parameters: z.object({})
  },
  {
    name: 'throw_confetti',
    description: 'Throw confetti to the user. Use this to celebrate.',
    parameters: z.object({})
  },
  {
    name: 'show_stock_price',
    description:
      'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
    parameters: z.object({
      symbol: z
        .string()
        .describe(
          'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
        ),
      price: z.number().describe('The price of the stock.'),
      delta: z.number().describe('The change in price of the stock')
    })
  },
  {
    name: 'show_stock_purchase_ui',
    description:
      'Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.',
    parameters: z.object({
      symbol: z
        .string()
        .describe(
          'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
        ),
      price: z.number().describe('The price of the stock.'),
      numberOfShares: z
        .number()
        .describe(
          'The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it.'
        )
    })
  },
  {
    name: 'list_stocks',
    description: 'List three imaginary stocks that are trending.',
    parameters: z.object({
      stocks: z.array(
        z.object({
          symbol: z.string().describe('The symbol of the stock'),
          price: z.number().describe('The price of the stock'),
          delta: z.number().describe('The change in price of the stock')
        })
      )
    })
  },
  {
    name: 'get_events',
    description:
      'List funny imaginary events between user highlighted dates that describe stock activity.',
    parameters: z.object({
      events: z.array(
        z.object({
          date: z
            .string()
            .describe('The date of the event, in ISO-8601 format'),
          headline: z.string().describe('The headline of the event'),
          description: z.string().describe('The description of the event')
        })
      )
    })
  }
]

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'play_pacman',
      description: 'Play pacman with the user.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'throw_confetti',
      description: 'Throw confetti to the user. Use this to celebrate.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'show_stock_price',
      description:
        'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description:
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
          },
          price: {
            type: 'number',
            description: 'The price of the stock.'
          },
          delta: {
            type: 'number',
            description: 'The change in price of the stock'
          }
        },
        required: ['symbol', 'price', 'delta']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'show_stock_purchase_ui',
      description:
        'Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description:
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
          },
          price: {
            type: 'number',
            description: 'The price of the stock.'
          },
          numberOfShares: {
            type: 'number',
            description:
              'The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it.'
          }
        },
        required: ['symbol', 'price']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_stocks',
      description: 'List three imaginary stocks that are trending.',
      parameters: {
        type: 'object',
        properties: {
          stocks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'The symbol of the stock'
                },
                price: {
                  type: 'number',
                  description: 'The price of the stock'
                },
                delta: {
                  type: 'number',
                  description: 'The change in price of the stock'
                }
              },
              required: ['symbol', 'price', 'delta']
            }
          }
        },
        required: ['stocks']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_events',
      description:
        'List funny imaginary events between user highlighted dates that describe stock activity.',
      parameters: {
        type: 'object',
        properties: {
          events: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  description: 'The date of the event, in ISO-8601 format'
                },
                headline: {
                  type: 'string',
                  description: 'The headline of the event'
                },
                description: {
                  type: 'string',
                  description: 'The description of the event'
                }
              },
              required: ['date', 'headline', 'description']
            }
          }
        },
        required: ['events']
      }
    }
  }
]
