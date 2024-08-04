'use client'

import {Box, Button, IconButton, TextField} from "@mui/material";
import {
    Add,
    ArrowBack,
    BrokenImageSharp,
    CameraSharp,
    Cancel,
    ImageAspectRatio,
    ImageOutlined
} from "@mui/icons-material";
import {Item} from "@/app/page";
import React, {ChangeEvent, FormEvent, useRef, useState} from "react";
import InputField from "@/app/input-field";
import {Camera, CameraType} from "react-camera-pro";
import Image from "next/image";

type InputType = 'text' | 'image' | ''

export default function AddForm() {
    const [inputType, setInputType] = useState<InputType>('')
    const [item, setItem] = useState<Item>({
        name: '',
        category: '',
        amount: 0
    })
    const cameraRef = useRef<CameraType>(null);
    const [image, setImage] = useState<string | ImageData | null>(null);
    const errorMessages = {
        noCameraAccessible: 'No camera device accessible. Please connect a camera or try a different browser.',
        permissionDenied: 'Camera permission denied. Please grant camera access in your browser settings.',
        switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
        canvas: 'Canvas is not supported.',
    };

    const handleCapture = () => {
        if (cameraRef.current) {
            const photo = cameraRef.current.takePhoto();
            console.log("Photo: ", photo)
            setImage(photo)
        } else {
            console.error('Camera reference is not set');
        }

    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const {name, value} = event.target
        setItem({
            ...item,
            [name]: value
        })
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

    const handleBack = () => {
        setInputType('')
        setImage(null)
    }

    return (
        <Box>
            {
                inputType === '' &&
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant='outlined' onClick={() => setInputType('text')}>Text</Button>
                    <Button variant='outlined' onClick={() => setInputType('image')}>Image</Button>
                </Box>
            }

            {
                inputType !== '' &&
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
                    {
                        inputType === 'text' &&
                        <InputField item={item} onChange={handleChange}/>
                    }
                    {
                        inputType === 'image' &&
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Box
                                sx={{
                                    width: 200,
                                    height: 200,
                                    position: 'relative',
                                    flex: '0 0 200px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid gray'
                                }}
                            >
                                <Camera
                                    ref={cameraRef}
                                    errorMessages={errorMessages}
                                />
                            </Box>
                            {(
                                <Box sx={{
                                    width: 200,
                                    height: 200,
                                    flex: '0 0 200px',
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {image ? (
                                        <>
                                            <Image src={image as string} alt='image' layout="fill" objectFit="cover" />
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    color: 'white',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                    }
                                                }}
                                                onClick={() => setImage(null)}
                                            >
                                                <Cancel/>
                                            </IconButton>
                                        </>
                                    ) : (
                                        <ImageOutlined sx={{ fontSize: 100, color: 'gray' }} />
                                    )}
                                </Box>
                            )}
                        </Box>
                    }

                    <Box sx={{
                        display: 'flex',
                        gap: 2
                    }}>
                        {inputType === 'image' && <Button variant="contained" onClick={handleCapture}><CameraSharp/></Button>}
                        <Button variant="contained" type="submit"><Add /></Button>
                        <Button variant="contained" type="button" onClick={handleBack}><ArrowBack /></Button>
                    </Box>
                </Box>
            }
        </Box>
    );


}