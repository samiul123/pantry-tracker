import { NextRequest, NextResponse } from 'next/server';
import { index } from '@/app/utils/algolia';
import { Item } from '@/app/page';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    try {
        if (!query) {
            const allItems: Item[] = [];
            await index.browseObjects<{ objectID: string; name: string; category: string; amount: number }>({
                query: '',
                batch: batch => {
                    batch.forEach(hit => allItems.push({
                        id: hit.objectID,
                        name: hit.name,
                        category: hit.category,
                        amount: hit.amount
                    }));
                }
            });
            return NextResponse.json(allItems, { status: 200 });
        } else {
            const { hits } = await index.search<{ objectID: string; name: string; category: string; amount: number }>(query);
            const items = hits.map(hit => ({
                id: hit.objectID,
                name: hit.name,
                category: hit.category,
                amount: hit.amount
            }));
            return NextResponse.json(items, { status: 200 });
        }
    } catch (error) {
        console.error("Error performing search:", error);
        return NextResponse.json({ error: 'Error performing search' + error }, { status: 500 });
    }
}
