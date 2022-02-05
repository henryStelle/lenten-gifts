import { Typography } from '@mui/material';
import Layout from '../components/Layout';

export default function Error404() {
    return (
        <Layout title={'404 Error'}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '40vh',
                    justifyContent: 'center',
                }}
            >
                <Typography variant='h4'>
                    Unfortunately, we have encountered a 404 error.
                </Typography>
                <Typography>
                    This means the page you are looking for doesn't exist.
                </Typography>
            </div>
        </Layout>
    );
}
