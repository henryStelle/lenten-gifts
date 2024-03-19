import {
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Radio,
    TextFieldProps,
} from '@mui/material';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { toTitleCase } from '../utils/toTitleCase';

interface HookRadioProps<T extends FieldValues> extends UseControllerProps<T> {
    mui?: TextFieldProps;
    options: string[];
}

export default function HookRadio<T extends FieldValues>({
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
