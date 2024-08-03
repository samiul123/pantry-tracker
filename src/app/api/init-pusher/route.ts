import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { db } from '@/app/utils/firebase';
import {NextRequest, NextResponse} from "next/server";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

let initialized = false;

const initializePusher = () => {
    if (initialized) return;
    initialized = true;

    const q = query(collection(db, 'items'));
    onSnapshot(q, (querySnapshot) => {
        const itemsArr: any[] = [];
        querySnapshot.forEach((doc) => {
            itemsArr.push({ ...doc.data(), id: doc.id });
        });

        console.log("Sending data");
        pusher.trigger('items', 'item-change', { items: itemsArr })
            .then(() => {
                console.log("Data sent to Pusher successfully");
            })
            .catch((error) => {
                console.error("Error sending data to Pusher", error);
            });
    });
};

export const POST = () => {
    try {
        initializePusher();
        return NextResponse.json({ message: 'Pusher initialized' }, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: 'Pusher initialization error' }, {status: 500});
    }

};
