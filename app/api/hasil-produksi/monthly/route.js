import { NextResponse } from 'next/server';
import { fetchMonthlyProduction } from '../../../../lib/server/hasilProduksiDaily';

const VALID_FACTORIES = new Set(['all', 'wotan', 'cirebon']);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const factoryParam = String(searchParams.get('factory') || 'all').toLowerCase();
    const factory = VALID_FACTORIES.has(factoryParam) ? factoryParam : 'all';

    const payload = await fetchMonthlyProduction(factory);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to fetch monthly production data from backend.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
