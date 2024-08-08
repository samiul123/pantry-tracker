'use client'

import {Box, Button} from "@mui/material";
import { Add, CameraSharp } from "@mui/icons-material";
import {Item} from "@/app/page";
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import InputField from "@/app/components/inputField";
import {CameraType} from "react-camera-pro";
import {FacingMode} from "react-camera-pro/dist/components/Camera/types";
import CameraDialog from "@/app/components/cameraDialog";
import {addItem} from "@/lib/itemsSlice";
import {useDispatch} from "react-redux";

export default function AddForm() {
    const dispatch = useDispatch()
    const [item, setItem] = useState<Item>({
        name: '',
        category: '',
        amount: 0
    })
    const [image, setImage] = useState<string | ImageData | null>(null);
    const cameraRef = useRef<CameraType>(null);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [facingMode, setFacingMode] = useState<FacingMode>('environment')
    const [cameraItem, setCameraItem] = useState<Item>({
        name: '',
        category: '',
        amount: 0
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const {name, value} = event.target
        if (showCamera) {
            setCameraItem({
                ...item,
                [name]: value
            })
        } else {
            setItem({
                ...item,
                [name]: value
            })
        }
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

    const handleAddItem = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = item.name && item.category && item.amount != 0 ? item : cameraItem

        await fetch('/api/items/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data})
        })
            .then(() => dispatch(addItem(data)))
            .catch(error => console.log(error));

        if (showCamera) {
            handleCloseCamera()
        } else {
            setItem({
                name: '',
                category: '',
                amount: 0
            })
        }
    }

    const handleClearCameraItem = () => setCameraItem({
        name: '',
        category: '',
        amount: 0
    })

    const handleSwitchCamera = () => {
        setFacingMode(facingMode === 'environment' ? 'user' : 'environment')
    }

    const handleCloseCamera = () => {
        setShowCamera(false)
        setImage(null)
        setFacingMode('environment')
        handleClearCameraItem()
    }

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
                    setCameraItem({...data})
                })
                .catch(error => {
                    console.log("Error: ", error)
                })
        }
    }, [image]);

    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                justifyContent: 'space-between',
                alignItems: "center",
                gap: 2
            }}
            onSubmit={handleAddItem}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <InputField item={item} onChange={handleChange}/>
                {
                    showCamera &&
                    <CameraDialog open={showCamera}
                                  onClose={handleCloseCamera}
                                  onSubmit={handleAddItem}
                                  image={image}
                                  cameraRef={cameraRef}
                                  clearImage={handleClearImage}
                                  clearItem={handleClearCameraItem}
                                  facingMode={facingMode}
                                  item={cameraItem}
                                  onChange={handleChange}
                                  onCameraSwitch={handleSwitchCamera}
                                  onCapture={handleCapture}/>
                }
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2,
                height: '100%'
            }}>
                <Button variant="contained" onClick={() => setShowCamera(true)}><CameraSharp/></Button>
                <Button variant="contained" type="submit"><Add /></Button>
            </Box>
        </Box>
    );


}