import { CircularProgress } from '@mui/material';

export default function Loading() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'absolute',
                top: '35vh',
                left: 0,
                right: 0,
            }}
        >
            <CircularProgress />
        </div>
    );
}
