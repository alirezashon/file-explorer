// app/api/chat/route.ts
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const ip = request.ip || 'IP not available'

  const geo = request.geo || {}
  const { country, region, city, latitude, longitude } = geo

  const response = {
    ip,
    location: {
      country: country || 'Country not available',
      region: region || 'Region not available',
      city: city || 'City not available',
      latitude: latitude || 'Latitude not available',
      longitude: longitude || 'Longitude not available',
    },
  }

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  })
}
