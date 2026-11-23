import { NextResponse } from 'next/server';
import { fetchWeeklyProduction } from '../../../../lib/server/hasilProduksiDaily';

const VALID_FACTORIES = new Set(['all', 'wotan', 'cirebon']);

function getErrorText(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

function classifyWeeklyError(errorText) {
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
      code: 'WEEKLY_BACKEND_CONFIG_ERROR',
      category: 'configuration',
      retryable: false,
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
  ) {
    return {
      status: 502,
      code: 'WEEKLY_BACKEND_NETWORK_ERROR',
      category: 'network',
      retryable: true,
      upstreamStatus,
    };
  }

  if (upstreamStatus) {
    return {
      status: 502,
      code: 'WEEKLY_BACKEND_UPSTREAM_ERROR',
      category: 'upstream',
      retryable: upstreamStatus >= 500,
      upstreamStatus,
    };
  }

  return {
    status: 500,
    code: 'WEEKLY_INTERNAL_ERROR',
    category: 'internal',
    retryable: false,
    upstreamStatus: null,
  };
}

export async function GET(request) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  const url = new URL(request.url);
  const factoryParam = String(url.searchParams.get('factory') || 'all').toLowerCase();

  try {
    const factory = VALID_FACTORIES.has(factoryParam) ? factoryParam : 'all';

    const payload = await fetchWeeklyProduction(factory);
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'x-request-id': requestId,
      },
    });
  } catch (error) {
    const errorText = getErrorText(error);
    const classification = classifyWeeklyError(errorText);
    const isProd = process.env.NODE_ENV === 'production';

    console.error('[weekly-api] GET failed', {
      requestId,
      route: '/api/hasil-produksi/weekly',
      query: {
        factory: factoryParam,
      },
      classification,
      error: {
        message: errorText,
        stack: error instanceof Error ? error.stack : undefined,
      },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'Failed to fetch weekly production data from backend.',
        code: classification.code,
        category: classification.category,
        retryable: classification.retryable,
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
