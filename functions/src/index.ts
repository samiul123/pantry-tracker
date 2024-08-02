import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import algoliasearch from 'algoliasearch';

admin.initializeApp();

const algoliaClient = algoliasearch(
    functions.config().algolia.app_id,
    functions.config().algolia.api_key
);
const index = algoliaClient.initIndex('items');

exports.syncFirestoreToAlgolia = functions.firestore
    .document('items/{itemId}')
    .onWrite(async (change, context) => {
        if (!change.after.exists) {
            return null;
        }
        const data = change.after.data();
        const objectID = context.params.itemId;
        return index.saveObject({...data, objectID});
    });

exports.deleteFromAlgolia = functions.firestore
    .document('items/{itemId}')
    .onDelete(async (snap, context) => {
        const objectID = context.params.itemId;
        await index.deleteObject(objectID);
    });
