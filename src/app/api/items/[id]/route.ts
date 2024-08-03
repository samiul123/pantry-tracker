import { NextRequest, NextResponse } from 'next/server';
import { deleteDoc, doc } from '@firebase/firestore';
import { db } from '@/app/utils/firebase';
import {index} from "@/app/utils/algolia";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
    }

    try {
        const docRef = doc(db, 'items', id);
        await deleteDoc(docRef);
        await index.deleteObject(id)
        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error deleting item:", error);
        return NextResponse.json({ error: 'Error deleting item' }, { status: 500 });
    }
}
