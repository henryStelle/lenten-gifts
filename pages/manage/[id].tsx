import React from 'react';
import { Typography, Button, Skeleton } from '@mui/material';
import { ListingWithId } from '../../models/Listing';
import useQuery from '../../utils/useQuery';
import Layout from '../../components/Layout';
import { useSWRConfig } from 'swr';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import HookTextField from '../../components/HookTextField';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmail from 'validator/lib/isEmail';
import { useRouter } from 'next/router';
import { singularize } from '../../utils/singularize';
import AlertContext from '../../contexts/Alert';

export default function Manage() {
    const router = useRouter();
    const id = router.query.id as string | undefined;
    const dispatch = React.useContext(AlertContext);

    const { control, handleSubmit, reset, formState } = useForm<ListingWithId>({
        mode: 'onTouched',
    });
    const { mutate } = useSWRConfig();
    const { data, error, isLoading } = useQuery<ListingWithId>(
        `/api/listing/${id}`
    );

    React.useEffect(() => {
        if (data?._id) {
            reset(data);
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<ListingWithId> = async (form) => {
        await handleApiRequest(form);
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

    const handleApiRequest = async (body: unknown) => {
        try {
            const response = await fetch('/api/listing/put', {
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
                        message: 'Listing updated!',
                        severity: 'success',
                    },
                });
                return result;
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

    const toggleAvailability = async () => {
        const body = { ...data, isAvailable: !data?.isAvailable };
        const result = await handleApiRequest(body);
        if (result) {
            mutate(`/api/listing/${id}`, result, false);
        }
    };

    return (
        <Layout title={'Manage Listing'}>
            <Typography variant='h4'>
                {isLoading ? <Skeleton /> : `Hi, ${data?.name}!`}
            </Typography>
            <Typography sx={{ marginBottom: 4 }}>
                This page allows you to edit your listing or mark it as no
                longer available. It is recommended that you bookmark this page
                to ensure you are able to find it later.
            </Typography>

            {error && (
                <Typography color={'error'}>{error.toString()}</Typography>
            )}
            <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}
                >
                    <Typography variant='h5' sx={{ flexGrow: 1 }}>
                        Listing Details -{' '}
                        {isLoading
                            ? 'loading...'
                            : data?.isAvailable
                            ? 'Available'
                            : 'Unavailable'}
                    </Typography>
                    {isLoading ? null : (
                        <Button
                            sx={{ marginRight: 2 }}
                            variant={'outlined'}
                            onClick={toggleAvailability}
                        >
                            {data?.isAvailable
                                ? 'Mark Unavailable'
                                : 'Mark Available'}
                        </Button>
                    )}
                    <Button
                        variant='contained'
                        disabled={isLoading}
                        type={'submit'}
                    >
                        Save Changes
                    </Button>
                </div>

                {!isLoading && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <HookTextField<ListingWithId>
                            control={control}
                            errors={formState.errors}
                            name={'name'}
                            mui={{ helperText: 'Your full name' }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            errors={formState.errors}
                            name={'title'}
                            mui={{
                                helperText:
                                    'The title or summary of the ' +
                                    singularize(data?.type),
                            }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            errors={formState.errors}
                            name={'description'}
                            mui={{
                                helperText:
                                    'More specific details regarding the ' +
                                    singularize(data?.type),
                            }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            errors={formState.errors}
                            name={'phone'}
                            mui={{ helperText: 'Your phone number' }}
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
                            rules={{
                                validate: (str) =>
                                    isEmail(str as string) ||
                                    'A valid email address must be entered',
                            }}
                        />
                    </div>
                )}
            </form>
        </Layout>
    );
}
