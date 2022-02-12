import React from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { ListingWithId } from '../models/Listing';

interface DashboardProps {
    data: ListingWithId[];
    keys: (keyof ListingWithId)[];
}

export default function Dashboard({ data, keys }: DashboardProps) {
    return (
        <TableContainer>
            <Table size={'small'} stickyHeader>
                <TableHead>
                    <TableRow>
                        {keys.map((key) => (
                            <TableCell key={key}>{key}</TableCell>
                        ))}
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(({ _id, ...listing }) => (
                        <TableRow key={_id}>
                            {keys.map((key) => (
                                <TableCell key={key}>
                                    {listing[key]?.toString()}
                                </TableCell>
                            ))}
                            <TableCell align='right'>
                                <Button
                                    href={`/${listing.type}/manage/${_id}`}
                                    target={'_blank'}
                                    variant={'outlined'}
                                >
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
