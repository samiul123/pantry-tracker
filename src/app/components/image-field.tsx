import {Box, IconButton} from "@mui/material";
import {Camera, CameraType} from "react-camera-pro";
import Image from "next/image";
import {Cancel, ImageOutlined} from "@mui/icons-material";
import React, {RefObject} from "react";

type ImageFieldProps = {
    image: string | ImageData | null
    onCapture: () => void
    cameraRef: RefObject<CameraType>
    clearImage: () => void
    clearItem: () => void
}

export const ImageField: React.FC<ImageFieldProps> = ({image,
                                                          onCapture,
                                                          cameraRef,
                                                          clearImage,
                                                          clearItem}) => {

    const errorMessages = {
        noCameraAccessible: 'No camera device accessible. Please connect a camera or try a different browser.',
        permissionDenied: 'Camera permission denied. Please grant camera access in your browser settings.',
        switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
        canvas: 'Canvas is not supported.',
    };

    return (
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
                onClick={onCapture}
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
                                onClick={() => {
                                    clearImage()
                                    clearItem()
                                }}
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
    )
}