import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    React.useEffect(() => {
        router.replace('/gift/view');
    }, [router]);
    return null;
}
