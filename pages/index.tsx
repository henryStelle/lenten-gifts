import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    React.useEffect(() => {
        router.replace('/view');
    }, [router]);
    return null;
}
