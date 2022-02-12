import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Radio,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { Controller, FieldErrors, UseControllerProps } from 'react-hook-form';
import { toTitleCase } from '../utils/toTitleCase';

interface HookRadioProps<T> extends UseControllerProps<T> {
    mui?: TextFieldProps;
    options: string[];
}

export default function HookRadio<T>({
    mui,
    options,
    ...props
}: HookRadioProps<T>) {
    return (
        <Controller
            {...props}
            render={({ field: { onChange, ...field }, fieldState }) => (
                <FormGroup {...field} sx={{ marginTop: 1 }}>
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
                                    <Radio
                                        checked={
                                            option.toLowerCase() == field.value
                                        }
                                        value={option.toLowerCase()}
                                        onChange={onChange}
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
