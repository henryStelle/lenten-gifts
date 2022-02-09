import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Listing from '../../components/Listing';
import { ListingWithId } from '../../models/Listing';
import { Typography, Grid } from '@mui/material';
import { singularize } from '../../utils/singularize';
import { toTitleCase } from '../../utils/toTitleCase';
import useQuery from '../../utils/useQuery';
import Loading from '../../components/Loading';

export default function View() {
    const router = useRouter();
    const type = router.query.type as string;

    const {
        data = [],
        error,
        isLoading,
    } = useQuery<ListingWithId[]>('/api/listing/list');

    const filtered = data.filter((gift) => gift.type == singularize(type));

    return (
        <Layout title={type ? `View ${toTitleCase(type + 's')}` : 'View'}>
            <div style={{ height: 24 }} />
            {error && (
                <Typography color={'error'}>{error.toString()}</Typography>
            )}
            {isLoading && <Loading />}
            <Grid container spacing={3}>
                {filtered.map((gift) => (
                    <Listing key={gift._id} {...gift} />
                ))}
            </Grid>
            {!isLoading && filtered.length == 0 && (
                <Typography align={'center'}>
                    Unfortunately, no {type + 's'} have been uploaded or are
                    currently being offered.
                </Typography>
            )}
        </Layout>
    );
}
