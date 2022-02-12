import React from 'react';
import { TextField, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import Dashboard from '../../components/Dashboard';
import { ListingWithId } from '../../models/Listing';
import useQuery from '../../utils/useQuery';

export default function Manage() {
    const {
        data = [],
        error,
        isLoading,
    } = useQuery<ListingWithId[]>('/api/listing/list?filter=false');

    const [query, setQuery] = React.useState('');
    const filtered = React.useMemo(
        () =>
            data.filter((row) =>
                JSON.stringify(row).toLowerCase().includes(query.toLowerCase())
            ),
        [data, query]
    );

    return (
        <Layout title={'Manage'}>
            <Typography variant='h4' gutterBottom>
                Admin Portal
            </Typography>
            {isLoading && <Loading />}
            {error && (
                <Typography color={'error'} gutterBottom>
                    {error.toString()}
                </Typography>
            )}
            <TextField
                label={'Search'}
                fullWidth
                margin='normal'
                size={'small'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {data && (
                <Dashboard
                    data={filtered}
                    keys={['title', 'type', 'name', 'email', 'isAvailable']}
                    map={(key, value) =>
                        key == 'isAvailable' ? (value ? 'Yes' : 'No') : value
                    }
                    rename={(key) =>
                        key == 'isAvailable' ? 'Available?' : key
                    }
                />
            )}
        </Layout>
    );
}
