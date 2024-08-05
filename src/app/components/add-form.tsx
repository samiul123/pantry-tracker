'use client'

import {Box, Button} from "@mui/material";
import {
    Add,
    ArrowBack
} from "@mui/icons-material";
import {Item} from "@/app/page";
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import InputField from "@/app/components/input-field";
import {CameraType} from "react-camera-pro";
import {ImageField} from "@/app/components/image-field";

type InputType = 'text' | 'image' | ''

export default function AddForm() {
    const [inputType, setInputType] = useState<InputType>('')
    const [item, setItem] = useState<Item>({
        name: '',
        category: '',
        amount: 0
    })
    const [image, setImage] = useState<string | ImageData | null>(null);
    const cameraRef = useRef<CameraType>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const {name, value} = event.target
        setItem({
            ...item,
            [name]: value
        })
    }

    const handleCapture = () => {
        if (cameraRef.current) {
            const photo = cameraRef.current.takePhoto();
            console.log("Photo: ", photo)
            setImage(photo)
        } else {
            console.error('Camera reference is not set');
        }

    };

    const handleClearImage = () => setImage(null)

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

    const handleBack = () => {
        setInputType('')
        setImage(null)
    }

    const handleClearItem = () => setItem({
        name: '',
        category: '',
        amount: 0
    })

    useEffect(() => {
        if (image) {
            fetch('/api/items/parse-image', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image})
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Response: ", data)
                    setItem({...data})
                })
                .catch(error => {
                    console.log("Error: ", error)
                })
        }
    }, [image]);

    return (
        <Box>
            {/*{*/}
            {/*    inputType === '' &&*/}
            {/*    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>*/}
            {/*        <Button variant='outlined' onClick={() => setInputType('text')}>Text</Button>*/}
            {/*        <Button variant='outlined' onClick={() => setInputType('image')}>Image</Button>*/}
            {/*    </Box>*/}
            {/*}*/}

            {
                // inputType !== '' &&
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        justifyContent: 'space-between',
                        alignItems: "center",
                        gap: 2
                    }}
                    onSubmit={addItem}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <InputField item={item} onChange={handleChange}/>
                        <ImageField
                            image={image}
                            cameraRef={cameraRef}
                            clearImage={handleClearImage}
                            clearItem={handleClearItem}
                            onCapture={handleCapture}
                        />
                    </Box>


                    <Box sx={{
                        display: 'flex',
                        gap: 2
                    }}>
                        <Button variant="contained" type="submit"><Add /></Button>
                        <Button variant="contained" type="button" onClick={handleBack}><ArrowBack /></Button>
                    </Box>
                </Box>
            }
        </Box>
    );


}