import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const query: Record<string, string> = {};
    params.forEach((value, key) => {
      query[key] = value;
    });

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
      params: query,
      headers: {
        ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy GET /web/v1/product error:', error?.message || error);
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { error: 'Internal Server Error' };
    return NextResponse.json(data, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product`, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy POST /web/v1/product error:', error?.message || error);
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { error: 'Internal Server Error' };
    return NextResponse.json(data, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/product`, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy PUT /web/v1/product error:', error?.message || error);
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { error: 'Internal Server Error' };
    return NextResponse.json(data, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const query: Record<string, string> = {};
    params.forEach((value, key) => {
      query[key] = value;
    });

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
      params: query,
      headers: {
        ...(request.headers.get('authorization') ? { Authorization: request.headers.get('authorization')! } : {}),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy DELETE /web/v1/product error:', error?.message || error);
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { error: 'Internal Server Error' };
    return NextResponse.json(data, { status });
  }
}
