import React from 'react';
import { Typography, Button, Grid, useTheme } from '@mui/material';
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
import useQuery from '../../utils/useQuery';
import isURL from 'validator/lib/isURL';
import ImageList, { Photo } from '../../components/ImageList';

interface PhotoSearch {
    next_page: string;
    page: number;
    per_page: number;
    photos: Photo[];
    total_results: number;
}

export default function Offer() {
    const theme = useTheme();
    const {
        control,
        handleSubmit,
        formState,
        register,
        setValue,
        watch,
        getValues,
    } = useForm<ListingWithId>({
        mode: 'onTouched',
    });

    const [defaultImage, setDefaultImage] = React.useState('');
    const dispatch = React.useContext(AlertContext);
    const { data } = useQuery<PhotoSearch>(
        watch('title')?.length > 4
            ? `/api/photos?title=${encodeURIComponent(watch('title'))}`
            : null
    );

    const router = useRouter();
    const type = singularize(router.query.type as string | undefined);

    const onSubmit: SubmitHandler<ListingWithId> = async (body) => {
        try {
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
                router.push(`/${type}/manage/${result._id}`);
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

    React.useEffect(() => {
        setDefaultImage(`${window.location.origin}/default.jpg`);
    }, [setValue]);

    return (
        <Layout title={'Create Listing'}>
            <Typography variant='h4' gutterBottom>
                Sign up to offer a {type}
            </Typography>

            <form
                onSubmit={handleSubmit(onSubmit, onSubmitError)}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <input
                    type={'hidden'}
                    defaultValue={type}
                    {...register('type')}
                />
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
                                helperText:
                                    'The title or summary of the ' + type,
                                fullWidth: true,
                            }}
                            defaultValue={''}
                            rules={{
                                required: 'The title is required',
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
                            name={'description'}
                            defaultValue={''}
                            mui={{
                                helperText:
                                    'More specific details regarding the ' +
                                    type,
                                fullWidth: true,
                            }}
                            rules={{ required: 'A description is required' }}
                        />
                        {type === 'group' && (
                            <>
                                <HookTextField<ListingWithId>
                                    control={control}
                                    defaultValue={''}
                                    name={'meetingDays'}
                                    mui={{
                                        label: 'Meeting Days of the Week',
                                        fullWidth: true,
                                        helperText:
                                            'What days of the week you plan on meeting?',
                                        placeholder: 'Monday, Friday',
                                    }}
                                    rules={{
                                        required: 'This field is required',
                                        minLength: {
                                            value: 3,
                                            message:
                                                'Please be more descriptive',
                                        },
                                    }}
                                />
                                <HookTextField<ListingWithId>
                                    control={control}
                                    name={'meetingTime'}
                                    defaultValue={''}
                                    mui={{
                                        fullWidth: true,
                                        label: 'Meeting Time',
                                        helperText:
                                            'What time do you plan on meeting and for how long? If you do not know, just put TBD',
                                        placeholder: '5pm - 6pm',
                                    }}
                                    rules={{
                                        required: 'A meeting time is required',
                                    }}
                                />
                                <HookTextField<ListingWithId>
                                    control={control}
                                    name={'meetingInterval'}
                                    mui={{
                                        fullWidth: true,
                                        label: 'Meeting Interval',
                                        helperText:
                                            'How frequently will you be meeting? Weekly? Every other week? etc.',
                                        placeholder: 'Weekly',
                                    }}
                                    defaultValue={''}
                                    rules={{
                                        required:
                                            'A meeting interval is required',
                                    }}
                                />
                            </>
                        )}
                        <HookTextField<ListingWithId>
                            control={control}
                            name={'image'}
                            defaultValue={''}
                            mui={{
                                helperText:
                                    'The URL of an image to display with this listing. Please look to the right or scroll down to see examples, or you may manually enter your own image URL.',
                                fullWidth: true,
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
                            photos={[
                                {
                                    alt: 'The default lenten image',
                                    avg_color: '#fff',
                                    height: 1,
                                    width: 1,
                                    id: '1',
                                    photographer: 'unknown',
                                    photographer_id: '5678',
                                    photographer_url: 'rt7io',
                                    url: defaultImage,
                                    src: {
                                        landscape: defaultImage,
                                        large: defaultImage,
                                        large2x: defaultImage,
                                        medium: defaultImage,
                                        small: defaultImage,
                                        tiny: defaultImage,
                                    },
                                } as unknown as Photo,
                            ].concat(data?.photos || [])}
                            onPhotoClick={(photo) =>
                                setValue('image', photo.src.medium, {
                                    shouldDirty: false,
                                })
                            }
                            selectedUrl={watch('image')}
                            selectedItemStyle={{
                                border:
                                    '4px solid ' + theme.palette.primary.main,
                            }}
                            unselectedItemStyle={{
                                filter: 'grayscale(0.5)',
                            }}
                        >
                            <p>Fallback</p>
                        </ImageList>
                    </Grid>
                </Grid>

                <Typography paragraph>
                    {type === 'group'
                        ? "Thank you for helping to build community at St. John's this Lent."
                        : "Thank you for sharing your gift with St. John's this Lent."}
                </Typography>

                <Button variant='contained' type={'submit'}>
                    Offer {toTitleCase(type)}
                </Button>
            </form>
        </Layout>
    );
}
