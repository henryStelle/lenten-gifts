import React from 'react';
import {
    Typography,
    Button,
    ImageList,
    ImageListItem,
    Grid,
    useTheme,
} from '@mui/material';
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

interface Photo {
    alt: string;
    avg_color: string;
    height: number;
    width: number;
    id: number;
    photographer: string;
    photographer_id: number;
    photographer_url: string;
    url: string;
    src: {
        landscape: string;
        large: string;
        large2x: string;
        medium: string;
        small: string;
        tiny: string;
    };
}

interface PhotoSearch {
    next_page: string;
    page: number;
    per_page: number;
    photos: Photo[];
    total_results: number;
}

export default function Create() {
    const theme = useTheme();
    const { control, handleSubmit, formState, register, setValue, watch } =
        useForm<ListingWithId>({
            mode: 'onTouched',
        });

    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch = React.useContext(AlertContext);
    const { data } = useQuery<PhotoSearch>(
        watch('title')
            ? `https://api.pexels.com/v1/search?size=small&query=${encodeURIComponent(
                  watch('title')
              )}&per_page=6&orientation=landscape`
            : null,
        {
            headers: {
                Authorization: `Bearer ${process.env.PEXELS_API_KEY}`,
            },
        }
    );

    const router = useRouter();
    const type = router.query.type as string | undefined;

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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <HookTextField<ListingWithId>
                            control={control}
                            errors={formState.errors}
                            name={'name'}
                            mui={{
                                helperText: 'Your full name',
                                fullWidth: true,
                                autoComplete: 'name',
                            }}
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
                                    'The title or summary of the ' +
                                    singularize(type),
                                fullWidth: true,
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
                                fullWidth: true,
                            }}
                            rules={{ required: 'A description is required' }}
                        />
                        <HookTextField<ListingWithId>
                            control={control}
                            errors={formState.errors}
                            name={'image'}
                            defaultValue={''}
                            mui={{
                                helperText:
                                    'The URL to an image to display with this listing',
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
                            errors={formState.errors}
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
                            errors={formState.errors}
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
                        <HookTextField<ListingWithId>
                            control={control}
                            errors={formState.errors}
                            name={'password'}
                            mui={{
                                helperText: 'Your password',
                                fullWidth: true,
                                type: 'password',
                                autoComplete: 'new-password',
                            }}
                            defaultValue={''}
                            rules={{
                                minLength: {
                                    value: 8,
                                    message:
                                        'Your password must be at least 8 characters',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <ImageList
                            sx={{ width: '100%', height: 410 }}
                            cols={2}
                            rowHeight={180}
                        >
                            {data?.photos.map((photo) => (
                                <ImageListItem key={photo.id}>
                                    {/* eslint @next/next/no-img-element: off  */}
                                    <img
                                        src={photo.src.medium}
                                        alt={photo.alt}
                                        loading='lazy'
                                        onClick={() =>
                                            setValue('image', photo.src.medium)
                                        }
                                        style={
                                            watch('image') === photo.src.medium
                                                ? {
                                                      border:
                                                          '4px solid ' +
                                                          theme.palette.primary
                                                              .main,
                                                  }
                                                : {
                                                      filter: 'grayscale(0.5)',
                                                  }
                                        }
                                    />
                                </ImageListItem>
                            )) || <></>}
                        </ImageList>
                    </Grid>
                </Grid>

                <Typography paragraph>
                    {type === 'group'
                        ? "Thank you for helping to build community at St. John's this Lent."
                        : "Thank you for sharing your gift with St. John's this Lent."}
                </Typography>

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
