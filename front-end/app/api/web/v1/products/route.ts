import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    // Build query params to forward
    const query: Record<string, string> = {};
    params.forEach((value, key) => {
      query[key] = value;
    });

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      params: query,
      headers: {
        ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy GET /web/v1/products error:', error?.message || error);
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { error: 'Internal Server Error' };
    return NextResponse.json(data, { status });
  }
}
