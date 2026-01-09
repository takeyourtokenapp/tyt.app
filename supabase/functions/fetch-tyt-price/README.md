# TYT Price Fetcher Edge Function

## Quick Start

This Edge Function fetches real-time TYT token data from multiple sources (Pump.fun, DexScreener, Birdeye) and serves it via a single endpoint with CORS support.

## Deployment

### Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** section
3. Click **"Deploy New Function"**
4. Name: `fetch-tyt-price`
5. Copy the entire content of `index.ts`
6. Click **"Deploy"**

### Via Supabase CLI (Alternative)

```bash
# If you have Supabase CLI installed
supabase functions deploy fetch-tyt-price
```

## Testing

### Test via curl

```bash
curl -X GET \
  'https://[your-project-ref].supabase.co/functions/v1/fetch-tyt-price' \
  -H 'Authorization: Bearer [your-anon-key]'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "price": 0.00000234,
    "marketCap": 234000,
    "volume24h": 13000,
    "priceChange24h": 15.7,
    "holders": 842,
    "totalSupply": 1000000000,
    "liquidity": 45000,
    "source": "pump.fun"
  },
  "timestamp": "2025-01-09T12:34:56.789Z"
}
```

## Data Sources

The function tries sources in this order:

1. **Pump.fun API** (primary)
   - Most accurate data
   - Direct from trading platform

2. **Birdeye API** (backup 1)
   - Public Solana token data
   - Good price accuracy

3. **DexScreener API** (backup 2)
   - Aggregated DEX data
   - Reliable fallback

## Features

- ✅ Multiple data sources with fallback
- ✅ CORS enabled for frontend access
- ✅ Response caching (10 seconds)
- ✅ Error handling and logging
- ✅ Parallel requests for speed

## Configuration

No environment variables needed - function is ready to deploy as-is.

## Monitoring

View logs in Supabase Dashboard:
1. Go to **Edge Functions**
2. Click on **fetch-tyt-price**
3. View **Logs** tab

## Rate Limits

Function respects API rate limits:
- Pump.fun: No official limit
- Birdeye: 100 req/min (public)
- DexScreener: 300 req/min

Recommended frontend polling: 15 seconds interval

## Troubleshooting

### "All sources failed"

Check logs for specific errors. Usually means:
- Token address invalid
- All APIs temporarily down
- Network issues

### CORS errors

Function includes proper CORS headers. If you see CORS errors, verify:
1. Function is deployed correctly
2. Using correct endpoint URL
3. Authorization header is set

## Support

For issues, check:
1. Supabase Edge Function logs
2. Browser console for client errors
3. Network tab for request/response details
