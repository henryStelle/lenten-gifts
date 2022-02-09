import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { Controller, FieldErrors, UseControllerProps } from 'react-hook-form';
import { toTitleCase } from '../utils/toTitleCase';

interface HookCheckBoxProps<T> extends UseControllerProps<T> {
    mui?: TextFieldProps;
    options: string[];
}

export default function HookCheckBox<T>({
    mui,
    options,
    ...props
}: HookCheckBoxProps<T>) {
    return (
        <Controller
            {...props}
            render={({ field: { onChange, ...field }, fieldState }) => (
                <FormGroup {...field}>
                    <FormLabel
                        component={'legend'}
                        error={Boolean(fieldState.error)}
                    >
                        {mui?.label || toTitleCase(field.name)}
                    </FormLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={(
                                            field.value as string[]
                                        ).includes(option.toLowerCase())}
                                        value={option.toLowerCase()}
                                        onChange={(_, checked) => {
                                            if (checked) {
                                                onChange(
                                                    (
                                                        field.value as string[]
                                                    ).concat([
                                                        option.toLowerCase(),
                                                    ])
                                                );
                                            } else {
                                                const val = new Set(
                                                    field.value as string[]
                                                );
                                                val.delete(
                                                    option.toLowerCase()
                                                );
                                                onChange(Array.from(val));
                                            }
                                        }}
                                    />
                                }
                                label={option}
                                name={field.name}
                            />
                        ))}
                    </div>
                    <FormHelperText error={Boolean(fieldState.error)}>
                        {fieldState.error?.message || mui?.helperText}
                    </FormHelperText>
                </FormGroup>
            )}
        />
    );
}
