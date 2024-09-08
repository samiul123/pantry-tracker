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
        amount: ''
    })
    const [image, setImage] = useState<string | ImageData | null>(null);
    const cameraRef = useRef<CameraType>(null);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [facingMode, setFacingMode] = useState<FacingMode>('environment')
    const [cameraItem, setCameraItem] = useState<Item>({
        name: '',
        category: '',
        amount: ''
    })

    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [cameraErrors, setCameraErrors] = useState<Record<string, string | null>>({});

    function isNumeric(value: string): boolean {
        return /[1-9][0-9]*/.test(value);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const {name, value} = event.target

        if (name === 'amount' && value !== '' && !isNumeric(value)) {
            setErrors({[name]: 'Input must be number'})
            return
        }
        if (['name', 'category'].includes(name) && value !== '' && isNumeric(value)) {
            setErrors({[name]: 'Input must be text'})
            return
        }
        console.log("name: ", name, value)

        if (showCamera) {
            setCameraItem({
                ...item,
                [name]: isNumeric(value) ? Number(value) : value
            })
        } else {
            setItem({
                ...item,
                [name]: isNumeric(value) ? Number(value) : value
            })
        }
        setErrors({ ...errors, [name]: null });
        setCameraErrors({ ...errors, [name]: null })
    }

    const validateFields = (data: Item) => {
        const newErrors: Record<string, string | null> = {};

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key as keyof Item];
                if (typeof value === 'string' && value.trim() === '') {
                    newErrors[key] = 'Required'
                } else if (typeof value === 'number' && value <= 0) {
                    newErrors[key] = 'Must be greater than 0'
                }
            }
        }

        if (showCamera) setCameraErrors(newErrors)
        else setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    const handleClearImage = () => setImage(null)

    const handleAddItem = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = showCamera ? cameraItem : item

        if (!validateFields(data)) {
            return;  // If validation fails, do not proceed
        }

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
                amount: ''
            })
        }
    }

    const handleClearCameraItem = () => setCameraItem({
        name: '',
        category: '',
        amount: ''
    })

    const handleSwitchCamera = () => {
        setFacingMode(facingMode === 'environment' ? 'user' : 'environment')
    }

    const handleCloseCamera = () => {
        setShowCamera(false)
        setImage(null)
        setFacingMode('environment')
        handleClearCameraItem()
        setCameraErrors({})
    }

    const handleOpenCamera = () => {
        setShowCamera(true)
        setErrors({})
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
            noValidate
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <InputField item={item} onChange={handleChange} errors={errors}/>
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
                                  onCapture={handleCapture}
                                  errors={cameraErrors}
                    />
                }
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2,
                height: '100%'
            }}>
                <Button variant="contained" onClick={handleOpenCamera}><CameraSharp/></Button>
                <Button variant="contained" type="submit"><Add /></Button>
            </Box>
        </Box>
    );


}