import { NextResponse } from 'next/server';
import { fetchBackOrderData } from '../../../lib/server/backorder';

const VALID_PLANTS = new Set(['all', 'wotan', 'cirebon']);

function getErrorText(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

function classifyError(errorText) {
  const text = String(errorText || 'Unknown error');
  const lower = text.toLowerCase();
  const backendStatusMatch = text.match(/failed \((\d{3})\)/i);
  const upstreamStatus = backendStatusMatch ? Number.parseInt(backendStatusMatch[1], 10) : null;

  if (
    lower.includes('base_url or api_key is not configured')
    || lower.includes('base_url is invalid')
    || lower.includes('base_url must use http or https protocol')
  ) {
    return {
      status: 500,
      code: 'BACKORDER_BACKEND_CONFIG_ERROR',
      upstreamStatus,
    };
  }

  if (
    lower.includes('fetch failed')
    || lower.includes('enotfound')
    || lower.includes('econnrefused')
    || lower.includes('etimedout')
    || lower.includes('socket hang up')
    || lower.includes('certificate')
    || lower.includes('aborted')
  ) {
    return {
      status: 502,
      code: 'BACKORDER_BACKEND_NETWORK_ERROR',
      upstreamStatus,
    };
  }

  if (upstreamStatus) {
    return {
      status: 502,
      code: 'BACKORDER_BACKEND_UPSTREAM_ERROR',
      upstreamStatus,
    };
  }

  return {
    status: 500,
    code: 'BACKORDER_INTERNAL_ERROR',
    upstreamStatus: null,
  };
}

export async function GET(request) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const { searchParams } = new URL(request.url);
    const plantParam = String(searchParams.get('plant') || 'all').toLowerCase();
    const plant = VALID_PLANTS.has(plantParam) ? plantParam : 'all';

    const payload = await fetchBackOrderData(plant);

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'x-request-id': requestId,
      },
    });
  } catch (error) {
    const errorText = getErrorText(error);
    const classification = classifyError(errorText);

    console.error('[backorder-api] GET failed', {
      requestId,
      route: '/api/backorder',
      error: errorText,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'Failed to fetch back order data from backend.',
        code: classification.code,
        requestId,
        timestamp: new Date().toISOString(),
        upstreamStatus: classification.upstreamStatus,
        error: errorText,
      },
      {
        status: classification.status,
        headers: {
          'x-request-id': requestId,
        },
      },
    );
  }
}
