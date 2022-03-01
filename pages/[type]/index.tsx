import React from 'react';
import { useRouter } from 'next/router';
import { singularize } from '../../utils/singularize';

export default function Home() {
    const router = useRouter();
    React.useEffect(() => {
        const type = router.query.type as string;
        if (type) {
            if (!['group', 'gift'].includes(singularize(type))) {
                throw new Error('Unsupported listing.');
            }
            router.replace(`${type}/view`);
        }
    }, [router]);
    return null;
}
