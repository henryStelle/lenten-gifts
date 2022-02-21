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
import { Instruction } from '../../models/Instruction';

export default function View() {
    const router = useRouter();
    const type = singularize(router.query.type as string);

    const {
        data = [],
        error,
        isLoading,
    } = useQuery<ListingWithId[]>('/api/listing/list');
    const instruction = useQuery<Instruction>(`/api/instruction/${type}`);

    const filtered = data.filter((gift) => gift.type == type);

    return (
        <Layout title={type ? `View ${toTitleCase(type)}s` : 'View'}>
            <div style={{ height: 12 }} />
            <Typography sx={{ paddingBottom: 2 }}>
                {instruction.data?.text}
                {/* {type == 'gift'
                    ? `After 2 years of pandemic isolation and loss, this simply isn't a year for more depravity! So instead of "giving up" something for Lent, these parishioners are offering to "give away" something they love, so that you can enjoy it too. So scroll through the offerings, see what tickles your fancy, then contact the person offering the gift and find a time that you can get together.`
                    : `Welcome to St. John's Lenten Group Offerings! Unless otherwise indicated, these groups will be meeting during the season of Lent (March 2 - April 16). Each group has been created by a St. John's parishioner who will be able to answer any questions you may have.`} */}
            </Typography>
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
                <Typography align={'center'} sx={{ paddingTop: 1 }}>
                    Unfortunately, no {type}s have been uploaded or are
                    currently being offered.
                </Typography>
            )}
        </Layout>
    );
}
