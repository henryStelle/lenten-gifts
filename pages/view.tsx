import React from 'react';
import { Typography, Tabs, Tab, Paper, Grid, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { toTitleCase } from '../utils/toTitleCase';
import Listing from '../components/Listing';
import useQuery from '../utils/useQuery';
import { ListingWithId } from '../models/Listing';
import { singularize } from '../utils/singularize';

export default function View() {
    const router = useRouter();
    const theme = useTheme();

    const {
        data = [],
        error,
        isLoading,
    } = useQuery<ListingWithId[]>('/api/listing/list');
    const [subject, setSubject] = React.useState('');

    const handleChangeSubject = (nxt: string) => {
        setSubject(nxt);
        router.push(router.pathname, { query: { v: nxt } });
    };

    React.useEffect(() => {
        // waiting for router to load and then waiting for the query to load and then only if not already a subject
        if (
            router &&
            router.asPath.includes('v=') == !!router.query.v &&
            !subject
        ) {
            handleChangeSubject(router.query.v?.toString() || 'gift');
        }
    }, [router]);

    return (
        <Layout title={subject ? `View ${toTitleCase(subject + 's')}` : 'View'}>
            <Paper>
                <Tabs
                    value={subject}
                    variant='fullWidth'
                    onChange={(_, nextSubject) =>
                        handleChangeSubject(nextSubject)
                    }
                    // textColor={
                    //     theme.palette.mode == 'dark' ? 'secondary' : 'primary'
                    // }
                >
                    <Tab value={'gift'} label={'Gifts'} />
                    <Tab value={'group'} label={'Groups'} />
                </Tabs>
            </Paper>
            <div style={{ height: 24 }} />
            {error && (
                <Typography color={'error'}>{error.toString()}</Typography>
            )}
            {isLoading && <Typography align={'center'}>Loading...</Typography>}
            <Grid container spacing={3}>
                {data
                    .filter(({ type }) => type == singularize(subject))
                    .map((gift) => (
                        <Listing key={gift._id} {...gift} />
                    ))}
            </Grid>
        </Layout>
    );
}
