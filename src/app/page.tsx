'use client';

import {
    Box,
    Container,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {ChangeEvent, FormEvent, SetStateAction, useEffect, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {useDebounce} from "@/hooks/usedebounce";
import {getPusherClient} from "@/app/utils/pusher-client";
import AddForm from "@/app/components/add-form";
import {ItemList} from "@/app/components/item-list";

export type Item = {
    id?: string
    name: string
    category: string
    amount: number
};

export default function Home() {
    const [items, setItems] = useState<Item[]>([]);
    const [searchedItems, setSearchedItems] = useState<Item[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

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
        fetch('/api/init-pusher', {
            method: 'POST'
        }).then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error initializing pusher:', error));

        const pusher = getPusherClient();
        const channel = pusher.subscribe('items')
        channel.bind('item-change', (data: { items: SetStateAction<Item[]>; }) => {
            console.log("Date received: ", data)
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
            <Typography variant='h3' sx={{marginBottom: '2rem'}}>Pantry Tracker</Typography>
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
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                    }}
                />

                <AddForm/>

                <ItemList items={searchedItems.length > 0 ? searchedItems : items} />
            </Box>
        </Container>
    );
}
