import {NextRequest, NextResponse} from "next/server";
import {addDoc, collection} from "@firebase/firestore";
import {db} from "@/app/utils/firebase";
import {index} from "@/app/utils/algolia";

export async function POST(req: NextRequest) {
    try {
        const item = await req.json().then(res => res.data);
        const docRef = await addDoc(collection(db, 'items'), item);
        const newItem = { ...item, id: docRef.id };
        await index.saveObject({ ...newItem, objectID: newItem.id });
        return NextResponse.json(newItem, {status: 200});
    } catch (error) {
        console.log("Error adding item" + error)
        return NextResponse.json({ error: 'Error adding item' + error }, {status: 500});
    }
}