import React from 'react';
import { Typography, Button, Skeleton, Grid, useTheme } from '@mui/material';
import { ListingWithId } from '../../../models/Listing';
import useQuery from '../../../utils/useQuery';
import Layout from '../../../components/Layout';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import HookTextField from '../../../components/HookTextField';
import { useRouter } from 'next/router';
import AlertContext from '../../../contexts/Alert';
import ImageList, { PhotoSearch } from '../../../components/ImageList';
import useDefaultImage from '../../../utils/useDefaultImage';

export default function Manage() {
    const router = useRouter();
    const theme = useTheme();
    const id = router.query.id as string | undefined;
    const dispatch = React.useContext(AlertContext);
    const defaultImage = useDefaultImage();

    const { control, handleSubmit, reset, watch, setValue, register } =
        useForm<ListingWithId>({
            mode: 'onTouched',
        });
    const { data, error, isLoading, mutate } = useQuery<ListingWithId>(
        `/api/listing/${id}`
    );
    const photos = useQuery<PhotoSearch>(
        watch('title')?.length > 4
            ? `/api/photos?title=${encodeURIComponent(watch('title'))}`
            : null
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            {Object.entries(data || {})
                                .filter(
                                    ([name]) =>
                                        ![
                                            '__v',
                                            'isAvailable',
                                            'type',
                                        ].includes(name)
                                )
                                .map(([name, value]) =>
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
                                            mui={{
                                                helperText:
                                                    typeof value ===
                                                        'boolean' &&
                                                    'To edit, enter "true" or "false"',
                                                fullWidth: true,
                                            }}
                                            rules={{
                                                validate: (val) =>
                                                    (typeof value === 'boolean'
                                                        ? [
                                                              'true',
                                                              'false',
                                                          ].includes(
                                                              val as string
                                                          )
                                                        : true) ||
                                                    'To edit, enter "true" or "false"',
                                            }}
                                        />
                                    )
                                )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography align={'center'}>
                                {watch('title')?.length < 5
                                    ? 'Please enter a title of at least 5 characters to preview images.'
                                    : 'Please click on one of the following images to automatically set your listing image.'}
                            </Typography>
                            <ImageList
                                sx={{ width: '100%', height: 420 }}
                                cols={2}
                                rowHeight={180}
                                photos={[defaultImage].concat(
                                    photos.data?.photos || []
                                )}
                                onPhotoClick={(photo) =>
                                    setValue('image', photo.src.medium, {
                                        shouldDirty: false,
                                    })
                                }
                                selectedUrl={watch('image')}
                                selectedItemStyle={{
                                    border:
                                        '4px solid ' +
                                        theme.palette.primary.main,
                                }}
                                unselectedItemStyle={{
                                    filter: 'grayscale(0.5)',
                                }}
                            >
                                <p>Fallback</p>
                            </ImageList>
                        </Grid>
                    </Grid>
                )}
            </form>
        </Layout>
    );
}
