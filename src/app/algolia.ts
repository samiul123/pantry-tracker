'use client'
// utils/algolia.ts
import algoliasearch from 'algoliasearch';
// const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID!;
// const ALGOLIA_API_KEY = process.env.REACT_APP_ALGOLIA_APP_KEY!; // Admin API Key for indexing

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, process.env.NEXT_PUBLIC_ALGOLIA_APP_KEY!);
const index = client.initIndex('items');
index.setSettings({
    searchableAttributes: ['name', 'category']
}).then(() => {
    console.log('Settings updated');
}).catch(err => {
    console.error('Error updating settings', err);
});

export { index };
