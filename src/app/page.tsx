'use client';

import {
    Box,
    Button,
    Container,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc} from "@firebase/firestore";
import {db} from "@/app/firebase";
import {index} from "@/app/algolia";
import {useDebounce} from "@/hooks/usedebounce";
import {
    Add,
    Cancel,
    Delete,
    Edit,
    Remove,
    Save,
    SaveAlt,
    SaveAltRounded,
    SaveAsSharp,
    SaveTwoTone
} from "@mui/icons-material";
import {isEqual} from 'lodash';

type Item = {
    id?: string,
    name: string;
    category: string;
    amount: number;
};

export default function Home() {
    const [items, setItems] = useState<Item[]>([]);
    const [searchedItems, setSearchedItems] = useState<Item[]>([])
    const [item, setItem] = useState<Item>({
        name: '',
        category: '',
        amount: 0
    })
    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [updateIndex, setUpdateIndex] = useState<number>(-1)
    const [updatedItem, setUpdatedItem] = useState<Item>({
        name: '',
        category: '',
        amount: 0
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const { name, value} = event.target
        if (updateIndex !== -1) {
            setUpdatedItem({
                ...updatedItem,
                [name]: value
            })
        } else {
            setItem({
                ...item,
                [name]: value
            })
        }
    }

    const addItem = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const docRef = await addDoc(collection(db, 'items'), { ...item });
        const newItem = { ...item, id: docRef.id };

        await index.saveObject({ ...newItem, objectID: newItem.id });

        setItem({
            name: '',
            category: '',
            amount: 0
        })
    }

    const readItem = () => {

    }

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        // setItems(filteredItems);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemove = async (id: string) => {
        await deleteDoc(doc(db, 'items', id))
        await index.deleteObject(id);
    };

    const handleEdit = (index: number, item: Item) => {
        setUpdateIndex(index)
        setUpdatedItem(item)
    }

    const cancelEdit = () => setUpdateIndex(-1)

    const updateItem = async (initialItem: Item) => {
        const docRef = doc(db, 'items', initialItem.id!)
        await updateDoc(docRef, {...updatedItem})
        const newUpdatedItem = { ...updatedItem, id: initialItem.id };

        await index.saveObject({ ...newUpdatedItem, objectID: newUpdatedItem.id });

        setUpdatedItem({
            id: '',
            name: '',
            category: '',
            amount: 0
        });
        setUpdateIndex(-1)
    }

    useEffect(() => {
        const searchItems = async () => {
            if (debouncedSearchQuery) {
                const { hits } =
                    await index.search<{ objectID: string; name: string; category: string; amount: number }>(debouncedSearchQuery);
                const items: Item[] = hits.map(hit => ({
                    id: hit.objectID,
                    name: hit.name,
                    category: hit.category,
                    amount: hit.amount
                }));
                setSearchedItems(items)
            } else {
                setSearchedItems([])
            }
        };
        searchItems();
    }, [debouncedSearchQuery]);


    useEffect(() => {
        const q =  query(collection(db, 'items'))
        const unsubscribe = onSnapshot(q, querySnapshot => {
            let itemsArr: any[] = []
            querySnapshot.forEach(doc => {
                itemsArr.push({...doc.data(), id: doc.id})
            })
            setItems(itemsArr)
        })

        return () => unsubscribe()
    }, [])

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                height: "100vh"
            }}
        >
            <Typography variant='h3' sx={{ marginBottom: '2rem' }}>Pantry Tracker</Typography>
            <Box
                component='div'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    maxWidth: "800px",
                    p: 4,
                    backgroundColor: '#1E293B',
                    borderRadius: 3
                }}
            >
                <TextField
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box
                    component='form'
                    sx={{
                        display: 'flex',
                        gap: 2,
                        width: '100%',
                        maxWidth: "800px",
                        backgroundColor: '#1E293B',
                        borderRadius: 3,
                        marginBottom: '2rem'
                    }}
                    onSubmit={addItem}
                >
                    <TextField
                        label='Name'
                        name='name'
                        value={item.name}
                        required
                        sx={{
                            flex: 2
                        }}
                        onChange={handleChange}
                    />
                    <TextField
                        label='Category'
                        name='category'
                        value={item.category}
                        required
                        sx={{
                            flex: 2
                        }}
                        onChange={handleChange}
                    />
                    <TextField
                        label='Amount'
                        name='amount'
                        value={item.amount == 0 ? '' : item.amount}
                        required
                        sx={{
                            flex: 1
                        }}
                        onChange={handleChange}
                    />
                    <Button variant='contained' type='submit'><Add/></Button>
                </Box>

                <List sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    {
                        (searchedItems.length > 0 ? searchedItems : items).map((item, index) => (
                            <ListItem key={index} sx={{
                                py: 2,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center', // Ensure alignment
                                backgroundColor: '#0F172A',
                                maxWidth: "800px",
                                borderRadius: 2,
                                gap: 3
                            }}>
                                <Box
                                    component='div'
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    {
                                        updateIndex === index ?
                                            <>
                                                <TextField name='name' value={updatedItem.name} label='Name' disabled/>
                                                <TextField name='category' value={updatedItem.category} label='Category' onChange={handleChange}/>
                                                <TextField name='amount' value={updatedItem.amount} label='Amount' onChange={handleChange}/>
                                            </> :
                                            <>
                                                <ListItemText primary={item.name} sx={{ flex: 2 }} />
                                                <ListItemText primary={item.category} sx={{ flex: 2 }} />
                                                <ListItemText primary={item.amount} sx={{ flex: 1}} />
                                            </>
                                    }

                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1
                                    }}
                                >
                                    {
                                        updateIndex === index ?
                                            <>
                                                <Button variant='contained' onClick={() => updateItem(item)}
                                                        disabled={isEqual(item, updatedItem)}>
                                                    <SaveAsSharp/>
                                                </Button>
                                                <Button variant='contained' onClick={cancelEdit}>
                                                    <Cancel/>
                                                </Button>
                                            </> :
                                            <>
                                                <Button variant='contained' onClick={() => handleEdit(index, item)}>
                                                    <Edit/>
                                                </Button>
                                                <Button variant='contained' onClick={() => handleRemove(item.id!)}>
                                                    <Delete/>
                                                </Button>
                                            </>
                                    }
                                </Box>

                            </ListItem>
                        ))
                    }
                </List>
            </Box>
        </Container>
    );
}
