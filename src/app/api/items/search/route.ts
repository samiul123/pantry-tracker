import { NextRequest, NextResponse } from 'next/server';
import { index } from '@/app/utils/algolia';
import { Item } from '@/app/page';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    try {
        const { hits, nbHits } =
            await index.search<
                { objectID: string; name: string; category: string; amount: number }
            >(query ? query : "", {
                page,
                hitsPerPage: limit
            });
        const items: Item[] = hits.map(hit => ({
            id: hit.objectID,
            name: hit.name,
            category: hit.category,
            amount: hit.amount
        }));
        return NextResponse.json({ items, totalItems: nbHits }, { status: 200 });
    } catch (error) {
        console.error("Error performing search:", error);
        return NextResponse.json({ error: 'Error performing search' + error }, { status: 500 });
    }
}
