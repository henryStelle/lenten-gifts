import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export function generate(prefersDarkMode: boolean) {
    const theme = createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : undefined,
            primary: { main: prefersDarkMode ? '#d9add7' : '#866f85' },
            secondary: { main: '#fff' },
            background: {
                default: prefersDarkMode ? '#121212' : '#f7f7f7',
            },
        },
        components: {
            MuiLink: {
                defaultProps: {
                    referrerPolicy: 'no-referrer',
                    target: '_blank',
                },
            },
            MuiCssBaseline: {
                styleOverrides: {
                    '#__next': {
                        minHeight: '100vh',
                        position: 'relative',
                    },
                    '*': {
                        '::-webkit-scrollbar': { width: 7, height: 7 },
                        '::-webkit-scrollbar-thumb': {
                            borderRadius: 7,
                            backgroundColor: 'gray',
                            transition: '0.1s',
                            '&:hover': { backgroundColor: '#696969' },
                        },
                    },
                    body: {
                        overscrollBehavior: 'none',
                    },
                },
            },
        },
    });

    return responsiveFontSizes(theme);
}
