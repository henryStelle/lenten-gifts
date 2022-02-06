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
} from '@mui/material';
import { ListingWithId } from '../models/Listing';

export default function Listing(props: ListingWithId) {
    const [hover, setHover] = React.useState(false);
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
                        <Link variant='body2' href={`tel:${props.phone}`}>
                            {props.phone}
                        </Link>
                    </div>
                </CardContent>
                <CardActions>
                    <Button href={`/manage/${props._id}`} target={'_blank'}>
                        Edit
                    </Button>
                    <div style={{ flexGrow: 1 }} />
                    <Button variant='outlined' href={`mailto:${props.email}`}>
                        Email
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
