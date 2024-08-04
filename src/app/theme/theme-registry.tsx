'use client';

import { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
    children: ReactNode;
}

export default function ThemeRegistry({ children }: Props) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
