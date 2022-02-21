import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Link,
    CardMedia,
    CardHeader,
    Divider,
} from '@mui/material';
import { ListingWithId } from '../models/Listing';
import AlertContext from '../contexts/Alert';

export default function Listing(props: ListingWithId) {
    const [hover, setHover] = React.useState(false);
    const dispatch = React.useContext(AlertContext);

    const handleEdit = () => {
        dispatch({
            type: 'open',
            payload: {
                message:
                    'To edit this posting, please use the link provided when you registered or, if you have lost it, contact our parish administrator, Kelly Krisman, at parishadministrator@stjohnsgigharbor.org',
                severity: 'info',
            },
        });
    };

    // console.log(props);

    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={4}
            xl={3}
            onMouseLeave={() => setHover(false)}
        >
            <Card>
                {/* TODO: consider title size -- too small on mobile */}
                <CardHeader
                    title={props.title}
                    subheader={props.name}
                    titleTypographyProps={{ variant: 'body1' }}
                />
                {props.image && (
                    <CardMedia
                        component={'img'}
                        height={140}
                        image={props.image}
                        alt={props.description}
                    />
                )}
                <CardContent onMouseEnter={() => setHover(true)}>
                    {/* <Typography variant='body1'>
                        <strong>{props.title}</strong>
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                        {props.name}
                    </Typography> */}
                    <div
                        style={{
                            maxHeight: hover ? 200 : 100,
                            overflow: 'auto',
                            transition: '200ms',
                        }}
                    >
                        <Typography variant='body2' gutterBottom>
                            {props.description}
                        </Typography>
                        <Divider sx={{ marginY: 1 }} />
                        {props.type === 'group' && (
                            <>
                                {props.vaccinationRequired && (
                                    <Typography variant='body2' gutterBottom>
                                        Important:{' '}
                                        <Typography
                                            variant='body2'
                                            component={'span'}
                                            color={'error'}
                                        >
                                            Vaccination Required
                                        </Typography>
                                    </Typography>
                                )}
                                <Typography variant='body2'>
                                    When: {props.meetingDays},{' '}
                                    {props.meetingTime}, {props.meetingInterval}
                                </Typography>
                            </>
                        )}
                        <Typography variant='body2'>
                            Contact:{' '}
                            <Link href={`tel:${props.phone}`}>
                                {props.phone}
                            </Link>
                        </Typography>
                    </div>
                </CardContent>
                <CardActions>
                    <Button onClick={handleEdit}>Edit</Button>
                    <div style={{ flexGrow: 1 }} />
                    <Button variant='outlined' href={`mailto:${props.email}`}>
                        Email
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
