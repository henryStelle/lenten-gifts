import { TextField, TextFieldProps } from '@mui/material';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { toTitleCase } from '../utils/toTitleCase';

interface HookTextFieldProps<T extends FieldValues>
    extends UseControllerProps<T> {
    mui?: TextFieldProps;
}

export default function HookTextField<T extends FieldValues>({
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
