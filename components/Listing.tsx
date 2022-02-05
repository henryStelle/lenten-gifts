import React from 'react';
import {
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
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
                {/* <CardHeader title={props.title} subheader={props.name} /> */}
                <CardMedia
                    component={'img'}
                    height={140}
                    image={'https://source.unsplash.com/random'}
                    alt={props.description}
                />
                <CardContent onMouseEnter={() => setHover(true)}>
                    <Typography variant='body1' gutterBottom>
                        {props.title}
                    </Typography>
                    {/* <Typography variant="body1" gutterBottom>
            {props.name}
          </Typography> */}
                    <div
                        style={{
                            maxHeight: hover ? 200 : 100,
                            overflow: 'auto',
                            transition: '200ms',
                        }}
                    >
                        <Typography variant='body2'>
                            {props.description}
                        </Typography>
                    </div>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button href={`tel:${props.phone}`}>Phone</Button>
                    <Button variant='outlined' href={`mailto:${props.email}`}>
                        Email
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
