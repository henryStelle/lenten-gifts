import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function NavBar() {
    const router = useRouter();

    return (
        <AppBar>
            <Toolbar>
                <Typography variant='h6' sx={{ flexGrow: 1 }}>
                    Lenten Giving
                </Typography>
                <Button
                    color={'secondary'}
                    variant='outlined'
                    onClick={() => router.push('/view?v=gift')}
                    sx={{ marginRight: 2 }}
                >
                    View Gifts
                </Button>
                <Button
                    color={'secondary'}
                    variant='contained'
                    onClick={() => router.push('/offer/gift')}
                >
                    Offer Gift
                </Button>
            </Toolbar>
        </AppBar>
    );
}
