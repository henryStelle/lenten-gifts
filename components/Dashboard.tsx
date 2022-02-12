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
    map: (key: string, value?: unknown) => unknown;
    rename: (key: string) => string;
}

export default function Dashboard({ data, keys, map, rename }: DashboardProps) {
    return (
        <TableContainer>
            <Table size={'small'} stickyHeader>
                <TableHead>
                    <TableRow>
                        {keys.map((key) => (
                            <TableCell key={key}>{rename(key)}</TableCell>
                        ))}
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(({ _id, ...listing }) => (
                        <TableRow key={_id}>
                            {keys.map((key) => (
                                <TableCell key={key}>
                                    {/* @ts-ignore */}
                                    {map(key, listing[key])}
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
