import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { singularize } from '../utils/singularize';
import { toTitleCase } from '../utils/toTitleCase';

export default function NavBar() {
    const router = useRouter();
    const type = singularize(router.query.type as string | undefined);
    const current_page = router.asPath.split('/').pop();

    return (
        <AppBar>
            <Toolbar>
                <Typography variant='h6' sx={{ flexGrow: 1 }}>
                    Easter {toTitleCase(type) ?? 'Programme'}s
                </Typography>
                {type && (
                    <>
                        <Button
                            color={'secondary'}
                            variant={
                                current_page === 'view'
                                    ? 'contained'
                                    : 'outlined'
                            }
                            onClick={() => router.push(`/${type}/view`)}
                            sx={{ marginRight: 2 }}
                        >
                            View {type}s
                        </Button>
                        <Button
                            color={'secondary'}
                            variant={
                                current_page === 'offer'
                                    ? 'contained'
                                    : 'outlined'
                            }
                            onClick={() => router.push(`/${type}/offer`)}
                        >
                            Offer {type}
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
