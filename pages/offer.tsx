import { useTheme } from '@emotion/react';
import {
    Typography,
    Grid,
    Button,
    Link,
    TextField,
    Stack,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { isMobilePhone, isEmail } from 'validator';
import HookTextField from '../components/HookTextField';
import Layout from '../components/Layout';
import AlertContext from '../contexts/Alert';
import { ListingWithId } from '../models/Listing';
import { defaultImage } from '../utils/useDefaultImage';
import HookImage from '../components/HookImage';

export default function Offer() {
    const theme = useTheme();
    const { control, handleSubmit, setValue, register, watch, getValues } =
        useForm<ListingWithId>({
            mode: 'onTouched',
        });
    const dispatch = React.useContext(AlertContext);
    const isUsingDefaultImage = !watch('image');

    const router = useRouter();

    const onSubmit: SubmitHandler<ListingWithId> = async (body) => {
        try {
            const str = JSON.stringify(body);
            const response = await fetch('/api/listing/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: str,
            });
            const result = await response.json();
            if (response.ok) {
                dispatch({
                    type: 'open',
                    payload: {
                        message: 'Listing updated!',
                        severity: 'success',
                    },
                });
                router.push(`/manage/${result._id}`);
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

    const onSubmitError: SubmitErrorHandler<ListingWithId> = (form) => {
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
        <Layout title={'Create Listing'}>
            <Typography variant='h4' gutterBottom>
                Sign up to offer a gift
            </Typography>

            <form
                onSubmit={handleSubmit(onSubmit, onSubmitError)}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'name'}
                            mui={{
                                helperText: 'Your full name',
                                fullWidth: true,
                                autoComplete: 'name',
                            }}
                            defaultValue={''}
                            rules={{
                                required: 'Your name is required',
                                minLength: {
                                    value: 5,
                                    message:
                                        'Your name must be at least 5 characters long',
                                },
                            }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'title'}
                            mui={{
                                helperText: 'The title or summary of the gift',
                                fullWidth: true,
                            }}
                            defaultValue={''}
                            rules={{
                                required: 'The title is required',
                                minLength: {
                                    value: 5,
                                    message: `The title of your gift must be at least 5 characters long`,
                                },
                            }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'description'}
                            defaultValue={''}
                            mui={{
                                helperText:
                                    'More specific details regarding the gift you are offering',
                                fullWidth: true,
                                multiline: true,
                                minRows: 2,
                            }}
                            rules={{ required: 'A description is required' }}
                        />

                        <HookImage
                            setImage={(img) => setValue('image', img)}
                            {...register('image')}
                        />

                        <Stack direction={'row'} spacing={2} my={1}>
                            <HookTextField<ListingWithId>
                                control={control}
                                name={'phone'}
                                mui={{
                                    helperText: 'Your phone number',
                                    fullWidth: true,
                                    autoComplete: 'tel',
                                }}
                                defaultValue={''}
                                rules={{
                                    validate: (str) =>
                                        isMobilePhone(str as string) ||
                                        'A valid phone number must be entered in the North American format: 253 456 7899',
                                }}
                            />
                            <HookTextField<ListingWithId>
                                control={control}
                                name={'email'}
                                mui={{
                                    helperText: 'Your email address',
                                    fullWidth: true,
                                    autoComplete: 'email',
                                }}
                                defaultValue={''}
                                rules={{
                                    validate: (str) =>
                                        isEmail(str as string) ||
                                        'A valid email address must be entered',
                                }}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4} alignContent={'center'}>
                        <Stack spacing={1} alignItems={'center'}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={watch('image') || defaultImage.url}
                                alt={'Selected image'}
                                style={{
                                    width: '100%',
                                    objectFit: 'contain',
                                    height: 140,
                                }}
                            />
                            <Typography
                                align={'center'}
                                variant='body2'
                                color='text.secondary'
                            >
                                Preview of{' '}
                                {isUsingDefaultImage
                                    ? 'default image'
                                    : 'your selected image'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <Typography paragraph>
                    {
                        "Thank you for sharing your gift with St. John's this Lent."
                    }
                </Typography>

                <Button
                    variant='contained'
                    type={'submit'}
                    sx={{ width: 'max-content' }}
                >
                    Offer Gift
                </Button>
            </form>
        </Layout>
    );
}
