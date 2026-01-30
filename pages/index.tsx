import React from 'react';
import { Typography, Grid } from '@mui/material';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import { Instruction } from '../models/Instruction';
import useQuery from '../utils/useQuery';
import Listing from '../components/Listing';
import { ListingWithId } from '../models/Listing';

export default function View() {
    const {
        data = [],
        error,
        isLoading,
    } = useQuery<ListingWithId[]>('/api/listing/list');
    const instruction = useQuery<Instruction>(`/api/instruction/gift`);

    return (
        <Layout title={'View Gifts'}>
            <div style={{ height: 12 }} />
            <Typography sx={{ paddingBottom: 2 }}>
                {instruction.data?.text}
            </Typography>
            {error && (
                <Typography color={'error'}>{error.toString()}</Typography>
            )}
            {isLoading && <Loading />}
            <Grid container spacing={3}>
                {data.map((gift) => (
                    <Listing key={gift._id} {...gift} />
                ))}
            </Grid>
            {!isLoading && data.length == 0 && (
                <Typography
                    align={'center'}
                    sx={{ paddingTop: 10 }}
                    color='text.secondary'
                >
                    Unfortunately, no gifts have been uploaded or are currently
                    being offered.
                </Typography>
            )}
        </Layout>
    );
}
