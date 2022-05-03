import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { generate } from '../utils/theme';
import createEmotionCache from '../utils/createEmotionCache';
import NavBar from '../components/NavBar';
import { Toolbar, useMediaQuery } from '@mui/material';
import type { AppProps } from 'next/app';
import Footer from '../components/Footer';
import AlertContext, { reducer } from '../contexts/Alert';
import Notify from '../components/Notify';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(
    props: AppProps & { emotionCache: EmotionCache }
) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () => generate(prefersDarkMode),
        [prefersDarkMode]
    );
    const [alert, dispatch] = React.useReducer(reducer, {
        message: '',
        severity: 'success',
    });

    return (
        <CacheProvider value={emotionCache}>
            <AlertContext.Provider value={dispatch}>
                <Head>
                    <meta
                        name='viewport'
                        content='initial-scale=1, width=device-width'
                    />
                </Head>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <NavBar />
                    {/* this div provides a little extra padding below the navbar */}
                    <div style={{ height: 20 }} />
                    <Toolbar />
                    <Component {...pageProps} />
                    <Footer />
                    <Notify {...alert} />
                </ThemeProvider>
            </AlertContext.Provider>
        </CacheProvider>
    );
}
