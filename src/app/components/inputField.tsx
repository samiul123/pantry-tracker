'use client'

import {Item} from "@/app/page";
import React from "react";
import {Box, FormControl, FormHelperText, TextField} from "@mui/material";

export default function InputField(props: { item: Item,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
        errors: Record<string, string | null>
    }) {

    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            {Object.keys(props.item).map((key) => (
                <TextField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value={props.item[key as keyof Item] || ''}
                    onChange={props.onChange}
                    required
                    error={!!props.errors[key]}
                    helperText={props.errors[key]}
                    sx={{ flex: 2 }}
                />
            ))}
        </Box>
    );
}