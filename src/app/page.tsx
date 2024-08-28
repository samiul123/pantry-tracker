'use client';

import {
    Box,
    Container,
    InputAdornment, TablePagination,
    TextField,
    Typography
} from "@mui/material";
import React, {ChangeEvent, useEffect, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {useDebounce} from "@/hooks/usedebounce";
import AddForm from "@/app/components/addForm";
import {ItemList} from "@/app/components/itemList";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setItems} from "@/lib/itemsSlice";

export type Item = {
    id?: string
    name: string
    category: string
    amount: string | number
};

export default function Home() {
    const dispatch = useAppDispatch()
    const {items, totalItems}  = useAppSelector((state) => state)
    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetch(`/api/items/search?query=${debouncedSearchQuery}&page=${page}&limit=${rowsPerPage}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
            .then(response => response.json())
            .then(data => dispatch(setItems(data)))
    }, [debouncedSearchQuery, page, rowsPerPage]);

    useEffect(() => {
        fetch(`/api/items/search?query=&page=${page}&limit=${rowsPerPage}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
            .then(response => response.json())
            .then(data => dispatch(setItems(data)))
    }, [page, rowsPerPage]);

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                height: "50%"
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
                <ItemList items={items}/>
                <TablePagination
                    component='div'
                    count={totalItems}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}/>
            </Box>
        </Container>
    );
}
