'use client'

import React, {RefObject} from "react";
import {CameraType} from "react-camera-pro";
import {Item} from "@/app/page";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {CustomCamera} from "@/app/components/customCamera";
import InputField from "@/app/components/inputField";
import {Add, CameraSharp, Cameraswitch, Cancel} from "@mui/icons-material";

export default function CameraDialog(props: {
    open: boolean,
    onClose: () => void,
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
    image: string | ImageData | null,
    cameraRef: RefObject<CameraType>,
    clearImage: () => void,
    clearItem: () => void,
    facingMode: "user" | "environment",
    item: Item,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onCameraSwitch: () => void,
    onCapture: () => void
    errors: Record<string, string | null>
}) {
    return <Dialog
        open={props.open}
        onClose={props.onClose}
    >
        <Box
            component="form"
            onSubmit={props.onSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#1E293B"
            }}
            noValidate
        >
            <DialogTitle>Take photo</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CustomCamera
                    image={props.image}
                    cameraRef={props.cameraRef}
                    clearImage={props.clearImage}
                    clearItem={props.clearItem}
                    facingMode={props.facingMode}
                />
                <InputField item={props.item} onChange={props.onChange} errors={props.errors}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCameraSwitch}><Cameraswitch/></Button>
                <Button onClick={props.onCapture}><CameraSharp/></Button>
                <Button type="submit"><Add/></Button>
                <Button onClick={props.onClose}><Cancel/></Button>
            </DialogActions>
        </Box>
    </Dialog>;
}