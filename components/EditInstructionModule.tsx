import React from 'react';
import { Button, Card, CardActions, CardContent, Grid } from '@mui/material';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { InstructionWithId } from '../models/Instruction';
import HookTextField from './HookTextField';
import AlertContext from '../contexts/Alert';

export default function EditInstructionModule(props: InstructionWithId) {
    const { control, handleSubmit, register, getValues } =
        useForm<InstructionWithId>({
            mode: 'onTouched',
            defaultValues: props,
        });
    const dispatch = React.useContext(AlertContext);
    const onSubmit: SubmitHandler<InstructionWithId> = async (body) => {
        try {
            const response = await fetch('/api/instruction/put', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const result = await response.json();
            if (response.ok) {
                dispatch({
                    type: 'open',
                    payload: {
                        message: 'Instruction updated!',
                        severity: 'success',
                    },
                });
            } else {
                dispatch({
                    type: 'open',
                    payload: { message: result.message, severity: 'error' },
                });
            }
        } catch (err) {
            dispatch({
                type: 'open',
                payload: { message: err as string, severity: 'error' },
            });
        }
    };

    const onSubmitError: SubmitErrorHandler<InstructionWithId> = (form) => {
        const count = Object.keys(form).length;
        console.log(getValues());
        dispatch({
            type: 'open',
            payload: {
                message: `There ${count == 1 ? 'is' : 'are'} ${count} error${
                    count == 1 ? '' : 's'
                } with your form.`,
                severity: 'error',
            },
        });
    };

    return (
        <Grid item xs={12} md={6}>
            <Card
                component={'form'}
                onSubmit={handleSubmit(onSubmit, onSubmitError)}
            >
                <CardContent>
                    <input type={'hidden'} {...register('_id')} />
                    <HookTextField<InstructionWithId>
                        control={control}
                        name={'type'}
                        mui={{
                            disabled: true,
                            fullWidth: true,
                            multiline: true,
                        }}
                    />
                    <HookTextField<InstructionWithId>
                        control={control}
                        name={'text'}
                        mui={{
                            fullWidth: true,
                            multiline: true,
                        }}
                    />
                </CardContent>
                <CardActions sx={{ flexDirection: 'row-reverse' }}>
                    <Button type={'submit'}>Save</Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
