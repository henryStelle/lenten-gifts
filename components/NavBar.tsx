import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function NavBar() {
    const router = useRouter();
    const current_page = router.asPath.split('/').pop();

    return (
        <AppBar>
            <Toolbar>
                <Typography variant='h6' sx={{ flexGrow: 1 }}>
                    Lenten Gifts
                </Typography>
                <Button
                    color={'secondary'}
                    variant={current_page === 'view' ? 'contained' : 'outlined'}
                    onClick={() => router.push(`/`)}
                    sx={{ marginRight: 2 }}
                >
                    View Gifts
                </Button>
                <Button
                    color={'secondary'}
                    variant={
                        current_page === 'offer' ? 'contained' : 'outlined'
                    }
                    onClick={() => router.push(`/offer`)}
                >
                    Offer a Gift
                </Button>
            </Toolbar>
        </AppBar>
    );
}
