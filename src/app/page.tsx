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
import {ChangeEvent, FormEvent, SetStateAction, useEffect, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc} from "@firebase/firestore";
import {db} from "@/app/utils/firebase";
import {index} from "@/app/utils/algolia";
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
import {getPusherClient} from "@/app/utils/pusher-client";

export type Item = {
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
        const {name, value} = event.target
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

        await fetch('/api/items/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({item})
        }).catch(error => console.log(error));

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
    };

    const handleRemove = async (id: string) => {
        await fetch(`/api/items/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).catch(error => console.log(error));
    };

    const handleEdit = (index: number, item: Item) => {
        setUpdateIndex(index)
        setUpdatedItem(item)
    }

    const cancelEdit = () => setUpdateIndex(-1)

    const updateItem = async (initialItem: Item) => {
        await fetch('/api/items/update', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: initialItem.id, updatedItem})
        }).then(() => {
            setUpdatedItem({
                id: '',
                name: '',
                category: '',
                amount: 0
            });
            setUpdateIndex(-1)
        }).catch(error => console.log(error));
    }

    useEffect(() => {
        const searchItems = async () => {
            if (debouncedSearchQuery) {
                const response = await fetch(`/api/items/search?query=${debouncedSearchQuery}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });
                const items = await response.json();
                setSearchedItems(items);
            } else {
                setSearchedItems([])
            }
        };
        searchItems();
    }, [debouncedSearchQuery]);


    useEffect(() => {
        // const fetchItems = async () => {
        //     try {
        //         const response = await fetch('/api/items/search', {
        //             method: 'GET',
        //             headers: { 'Content-Type': 'application/json' },
        //         });
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         const items = await response.json();
        //         setItems(items);
        //     } catch (error) {
        //         console.error('Error fetching items:', error);
        //     }
        // };
        // fetchItems();
        fetch('/api/init-pusher', {
            method: 'POST'
        }).then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error initializing pusher:', error));

        const pusher = getPusherClient();
        const channel = pusher.subscribe('items')
        channel.bind('item-change', (data: { items: SetStateAction<Item[]>; }) => {
            setItems(data.items)
        })

        return () => {
            channel.unbind('item-change')
            channel.unsubscribe()
        }
    }, []);

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
