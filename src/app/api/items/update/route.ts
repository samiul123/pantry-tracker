import {NextRequest, NextResponse} from "next/server";
import {doc, updateDoc} from "@firebase/firestore";
import {db} from "@/app/utils/firebase";
import {index} from "@/app/utils/algolia";

export const PUT = async (req: NextRequest) => {
    try {
        const {id, updatedItem} = await req.json().then(res => res)
        const docRef = doc(db, 'items', id);
        await updateDoc(docRef, updatedItem);
        const newUpdatedItem = { ...updatedItem, id };
        await index.saveObject({ ...newUpdatedItem, objectID: newUpdatedItem.id });
        return NextResponse.json(newUpdatedItem, {status: 200});
    } catch (error) {
        console.log("Error: ", error)
        return NextResponse.json({ error: 'Error updating item' }, {status: 500});
    }
}