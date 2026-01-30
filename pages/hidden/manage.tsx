import React from 'react';
import { Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import Dashboard from '../../components/Dashboard';
import { ListingWithId } from '../../models/Listing';
import useQuery from '../../utils/useQuery';
import EditInstructionModule from '../../components/EditInstructionModule';
import { InstructionWithId } from '../../models/Instruction';

export default function Manage() {
    const [type, setType] = React.useState('listing');
    const {
        data = [],
        error,
        isLoading,
    } = useQuery<(ListingWithId | InstructionWithId)[]>(
        type === 'listing'
            ? '/api/listing/list?filter=false'
            : '/api/instruction/list'
    );

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
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label={'Search'}
                        fullWidth
                        // margin='normal'
                        size={'small'}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <Button
                        variant={type === 'listing' ? 'contained' : 'outlined'}
                        onClick={() => setType('listing')}
                        fullWidth
                    >
                        Listings
                    </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Button
                        variant={
                            type === 'instruction' ? 'contained' : 'outlined'
                        }
                        onClick={() => setType('instruction')}
                        fullWidth
                    >
                        Instructions
                    </Button>
                </Grid>
            </Grid>

            {type == 'listing' && data && (
                <Dashboard
                    data={filtered as ListingWithId[]}
                    keys={['title', 'name', 'email', 'isAvailable']}
                    map={(key, value) =>
                        key == 'isAvailable' ? (value ? 'Yes' : 'No') : value
                    }
                    rename={(key) =>
                        key == 'isAvailable' ? 'Available?' : key
                    }
                />
            )}
            {type === 'instruction' && data && (
                <Grid container spacing={2} sx={{ paddingTop: 2 }}>
                    {data.map((instruction) => (
                        <EditInstructionModule
                            key={instruction._id}
                            {...(instruction as InstructionWithId)}
                        />
                    ))}
                </Grid>
            )}
        </Layout>
    );
}
