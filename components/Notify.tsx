import React from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';
import AlertContext from '../contexts/Alert';

export interface NotifyProps {
    message: string;
    severity: AlertColor;
}

export default function Notify(props: NotifyProps) {
    const dispatch = React.useContext(AlertContext);
    return (
        <Snackbar
            open={props.message.length > 0}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            onClose={() => dispatch({ type: 'close' })}
        >
            <Alert severity={props.severity}>{props.message}</Alert>
        </Snackbar>
    );
}
