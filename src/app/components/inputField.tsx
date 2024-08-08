'use client'

import {Item} from "@/app/page";
import React from "react";
import {Box, TextField} from "@mui/material";

export default function InputField(props: { item: Item, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
    return <Box sx={{display: 'flex', gap: 2}}>
            <TextField
                label="Name"
                name="name"
                value={props.item.name || ''}
                required
                sx={{
                    flex: 2
                }}
                onChange={props.onChange}
            />
            <TextField
                label="Category"
                name="category"
                value={props.item.category || ''}
                required
                sx={{
                    flex: 2
                }}
                onChange={props.onChange}
            />
            <TextField
                label="Amount"
                name="amount"
                value={props.item.amount == 0 ? '' : props.item.amount}
                required
                sx={{
                    flex: 1
                }}
                onChange={props.onChange}
            />
    </Box>;
}