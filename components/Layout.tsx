import Head from 'next/head';
import { Container } from '@mui/material';

interface LayoutProps {
    title: string;
    children: React.ReactElement[] | React.ReactElement;
}

export default function Layout(props: LayoutProps) {
    return (
        <>
            <Head>
                <title>{props.title}</title>
            </Head>
            <Container>{props.children}</Container>
        </>
    );
}
