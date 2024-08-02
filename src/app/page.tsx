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
import {addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query} from "@firebase/firestore";
import {db} from "@/app/firebase";

type Item = {
    id?: string,
    name: string;
    category: string;
    amount: number;
};

export default function Home() {
    const [items, setItems] = useState<Item[]>([]);

    const [item, setItem] = useState<Item>({
        name: '',
        category: '',
        amount: 0
    })
    const [searchQuery, setSearchQuery] = useState<string>('');


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const { name, value} = event.target
        setItem({
            ...item,
            [name]: value
        })
    }

    const addItem = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await addDoc(collection(db, 'items'), {...item})
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
        setItems(filteredItems);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemove = async (id: string) => {
        await deleteDoc(doc(db, 'items', id))
    };

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
                    <Button variant='contained' type='submit'>+</Button>
                </Box>

                {
                    items &&
                    <List sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        {
                            items.map((item, index) => (
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
                                            alignItems: 'center'
                                        }}
                                    >
                                        <ListItemText primary={item.name} sx={{ flex: 2 }} />
                                        <ListItemText primary={item.category} sx={{ flex: 2 }} />
                                        <ListItemText primary={item.amount} sx={{ flex: 1, textAlign: 'right' }} />
                                    </Box>
                                    <Button variant='contained' onClick={() => handleRemove(item.id!)}>
                                        X
                                    </Button>
                                </ListItem>
                            ))
                        }
                    </List>
                }
            </Box>
        </Container>
    );
}
