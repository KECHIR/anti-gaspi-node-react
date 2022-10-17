import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertNotification({ severity, open, message, handleClose }) {
    return (
        <Stack spacing={2} sx={{ width: '100%', left: "unset", bottom: "unset" }}>
            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                <Alert severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}