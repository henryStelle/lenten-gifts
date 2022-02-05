import { darkScrollbar } from '@mui/material';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#3f51b5' },
        secondary: { main: '#fff' },
        background: {
            default: '#f7f7f7',
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

export default responsiveFontSizes(theme);
