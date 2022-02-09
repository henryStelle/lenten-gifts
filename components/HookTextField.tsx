import { TextField, TextFieldProps } from '@mui/material';
import { Controller, FieldErrors, UseControllerProps } from 'react-hook-form';
import { toTitleCase } from '../utils/toTitleCase';

interface HookTextFieldProps<T> extends UseControllerProps<T> {
    mui?: TextFieldProps;
}

export default function HookTextField<T>({
    mui,
    ...props
}: HookTextFieldProps<T>) {
    return (
        <Controller
            {...props}
            render={({ field, fieldState }) => (
                <TextField
                    label={toTitleCase(field.name)}
                    {...mui}
                    {...field}
                    helperText={fieldState?.error?.message || mui?.helperText}
                    error={Boolean(fieldState?.error)}
                    size={'small'}
                    margin={'dense'}
                />
            )}
        />
    );
}
