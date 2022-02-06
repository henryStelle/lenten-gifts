import React from 'react';
import { Typography, Button } from '@mui/material';
import { ListingWithId } from '../../models/Listing';
import Layout from '../../components/Layout';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import HookTextField from '../../components/HookTextField';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmail from 'validator/lib/isEmail';
import { toTitleCase } from '../../utils/toTitleCase';
import { singularize } from '../../utils/singularize';
import { useRouter } from 'next/router';
import AlertContext from '../../contexts/Alert';

export default function Create() {
    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch = React.useContext(AlertContext);

    const router = useRouter();
    const type = router.query.type as string | undefined;

    const { control, handleSubmit, formState, register, setValue } =
        useForm<ListingWithId>({
            mode: 'onTouched',
        });

    const onSubmit: SubmitHandler<ListingWithId> = async (body) => {
        try {
            console.log(body);
            const response = await fetch('/api/listing/post', {
                method: 'POST',
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
                        message: 'Listing updated!',
                        severity: 'success',
                    },
                });
                router.push(`/manage/${result._id}`);
            } else {
                console.log(result, response);
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

    React.useEffect(() => {
        if (type) setValue('type', type);
    }, [type, setValue]);

    return (
        <Layout title={'Manage Listing'}>
            <Typography variant='h4' gutterBottom>
                Sign up to offer a {singularize(type)}
            </Typography>

            <form
                onSubmit={handleSubmit(onSubmit, onSubmitError)}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <input
                    type={'hidden'}
                    defaultValue={singularize(type)}
                    {...register('type')}
                />
                <HookTextField<ListingWithId>
                    control={control}
                    errors={formState.errors}
                    name={'name'}
                    mui={{ helperText: 'Your full name' }}
                    defaultValue={''}
                    rules={{
                        minLength: {
                            value: 5,
                            message:
                                'Your name must be at least 5 characters long',
                        },
                    }}
                />
                <HookTextField<ListingWithId>
                    control={control}
                    errors={formState.errors}
                    name={'title'}
                    mui={{
                        helperText:
                            'The title or summary of the ' + singularize(type),
                    }}
                    defaultValue={''}
                    rules={{
                        minLength: {
                            value: 5,
                            message: `The title of your ${singularize(
                                type
                            )} must be at least 5 characters long`,
                        },
                    }}
                />
                <HookTextField<ListingWithId>
                    control={control}
                    errors={formState.errors}
                    name={'description'}
                    defaultValue={''}
                    mui={{
                        helperText:
                            'More specific details regarding the ' +
                            singularize(type),
                    }}
                    rules={{ required: 'A description is required' }}
                />
                <HookTextField<ListingWithId>
                    control={control}
                    errors={formState.errors}
                    name={'phone'}
                    mui={{ helperText: 'Your phone number' }}
                    defaultValue={''}
                    rules={{
                        validate: (str) =>
                            isMobilePhone(str as string, 'any', {
                                strictMode: true,
                            }) ||
                            'A valid phone number must be entered in the international format: +1 253 456 7899',
                    }}
                />
                <HookTextField<ListingWithId>
                    control={control}
                    errors={formState.errors}
                    name={'email'}
                    mui={{ helperText: 'Your email address' }}
                    defaultValue={''}
                    rules={{
                        validate: (str) =>
                            isEmail(str as string) ||
                            'A valid email address must be entered',
                    }}
                />

                <Button
                    variant='contained'
                    disabled={isLoading}
                    type={'submit'}
                >
                    Offer {toTitleCase(type)}
                </Button>
            </form>
        </Layout>
    );
}
