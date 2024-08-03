// import useSWRSubscription from 'swr/subscription';
// import { collection, onSnapshot, query } from '@firebase/firestore';
// import { db } from '@/app/firebase';
// import { Item } from '@/app/page';
//
// const subscribe = (key: string, { next }: { next: (err?: Error, data?: Item[]) => void }) => {
//     const q = query(collection(db, 'items'));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         console.log("subscribe")
//         const itemsArr: Item[] = [];
//         querySnapshot.forEach((doc) => {
//             itemsArr.push({ ...doc.data(), id: doc.id } as Item);
//         });
//         next(undefined, itemsArr);
//     }, (error) => {
//         next(error);
//     });
//
//     return () => unsubscribe();
// };
//
// const useFirestoreSubscription = () => {
//     const { data, error } = useSWRSubscription('firestore-items', subscribe);
//     return { data, error };
// };
//
// export default useFirestoreSubscription;
