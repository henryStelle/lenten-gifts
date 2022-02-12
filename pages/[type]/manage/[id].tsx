import React from 'react';
import { Typography, Button, Skeleton, TextField } from '@mui/material';
import { ListingWithId } from '../../../models/Listing';
import useQuery from '../../../utils/useQuery';
import Layout from '../../../components/Layout';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import HookTextField from '../../../components/HookTextField';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmail from 'validator/lib/isEmail';
import { useRouter } from 'next/router';
import { singularize } from '../../../utils/singularize';
import AlertContext from '../../../contexts/Alert';
import isURL from 'validator/lib/isURL';

export default function Manage() {
    const router = useRouter();
    const id = router.query.id as string | undefined;
    const dispatch = React.useContext(AlertContext);

    const { control, handleSubmit, reset, formState, register } =
        useForm<ListingWithId>({
            mode: 'onTouched',
        });
    const { data, error, isLoading, mutate } = useQuery<ListingWithId>(
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
            mutate(`/api/listing/${id}`, result);
        }
    };

    // if (error?.toString()?.includes('403')) {
    //     return (
    //         <Layout title='Sign In'>
    //             <Typography variant='h4'>Please Sign In</Typography>
    //             <form
    //                 onSubmit={(e) => {
    //                     e.preventDefault();
    //                     mutate(`/api/listing/${id}`, true);
    //                 }}
    //                 style={{ maxWidth: 400, width: '100%' }}
    //             >
    //                 <Button
    //                     variant='contained'
    //                     type={'submit'}
    //                 >
    //                     Sign In
    //                 </Button>
    //             </form>
    //         </Layout>
    //     );
    // }

    return (
        <Layout title={'Manage Listing'}>
            <Typography variant='h4'>
                {isLoading ? <Skeleton /> : `Hi, ${data?.name}!`}
            </Typography>
            <Typography sx={{ marginBottom: 4 }}>
                This page allows you to edit your listing or mark it as no
                longer available.{' '}
                <strong>
                    Please bookmark this page to ensure you are able to find it
                    later.
                </strong>{' '}
                To bookmark this page on most browsers, click the star with the
                plus in the top right-hand corner.
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
                        {Object.keys(data || {})
                            .filter(
                                (name) =>
                                    !['__v', 'isAvailable', 'type'].includes(
                                        name
                                    )
                            )
                            .map((name) =>
                                name.startsWith('_') ? (
                                    <input
                                        type={'hidden'}
                                        // @ts-ignore
                                        {...register(name)}
                                    />
                                ) : (
                                    <HookTextField<ListingWithId>
                                        key={name}
                                        control={control}
                                        // @ts-ignore
                                        name={name}
                                    />
                                )
                            )}
                        {/* <HookTextField<ListingWithId>
                            control={control}
                            name={'name'}
                            mui={{ helperText: 'Your full name' }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'title'}
                            mui={{
                                helperText:
                                    'The title or summary of the ' +
                                    singularize(data?.type),
                            }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'description'}
                            mui={{
                                helperText:
                                    'More specific details regarding the ' +
                                    singularize(data?.type),
                            }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'image'}
                            defaultValue={''}
                            mui={{
                                helperText:
                                    'The url of the image related to your listing',
                            }}
                            rules={{
                                validate: (url) =>
                                    isURL(url as string) ||
                                    "The image's URL must be valid",
                            }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'phone'}
                            mui={{ helperText: 'Your phone number' }}
                            rules={{
                                validate: (str) =>
                                    isMobilePhone(str as string) ||
                                    'A valid phone number must be entered in the North American format: 253 456 7899',
                            }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'email'}
                            mui={{ helperText: 'Your email address' }}
                            rules={{
                                validate: (str) =>
                                    isEmail(str as string) ||
                                    'A valid email address must be entered',
                            }}
                        /> */}
                    </div>
                )}
            </form>
        </Layout>
    );
}
