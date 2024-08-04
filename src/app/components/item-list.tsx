'use client'

import {Box, Button, List, ListItem, ListItemText, TextField} from "@mui/material";
import {isEqual} from "lodash";
import {Cancel, Delete, Edit, SaveAsSharp} from "@mui/icons-material";
import {Item} from "@/app/page";
import React, {ChangeEvent, useState} from "react";

type Props = {
    items: Item[]
}

export const ItemList:React.FC<Props> = ({ items}) => {

    const [updatedItem, setUpdatedItem] = useState<Item>({
        name: '',
        category: '',
        amount: 0
    })
    const [updateIndex, setUpdateIndex] = useState<number>(-1)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const {name, value} = event.target
        if (updateIndex !== -1) {
            setUpdatedItem({
                ...updatedItem,
                [name]: value
            })
        }
    }

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

    const handleRemove = async (id: string) => {
        await fetch(`/api/items/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).catch(error => console.log(error));
    };

    return (
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
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            {
                                updateIndex === index ?
                                    <>
                                        <TextField name='name' value={updatedItem.name} label='Name' disabled/>
                                        <TextField name='category' value={updatedItem.category} label='Category'
                                                   onChange={handleChange}/>
                                        <TextField name='amount' value={updatedItem.amount} label='Amount'
                                                   onChange={handleChange}/>
                                    </> :
                                    <>
                                        <ListItemText primary={item.name} sx={{flex: 2}}/>
                                        <ListItemText primary={item.category} sx={{flex: 2}}/>
                                        <ListItemText primary={item.amount} sx={{flex: 1}}/>
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
    )
}
