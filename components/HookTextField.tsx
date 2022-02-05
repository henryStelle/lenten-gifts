import { TextField, TextFieldProps } from '@mui/material';
import { Controller, FieldErrors, UseControllerProps } from 'react-hook-form';
import { toTitleCase } from '../utils/toTitleCase';

export default function HookTextField<T>({
    mui,
    errors,
    ...props
}: UseControllerProps<T> & { mui?: TextFieldProps } & {
    errors: FieldErrors;
}) {
    return (
        <Controller
            {...props}
            render={({ field }) => (
                <TextField
                    label={toTitleCase(field.name)}
                    {...mui}
                    {...field}
                    helperText={
                        errors?.[props.name]?.message || mui?.helperText
                    }
                    error={Boolean(errors?.[props.name])}
                    size={'small'}
                    margin={'dense'}
                />
            )}
        />
    );
}
