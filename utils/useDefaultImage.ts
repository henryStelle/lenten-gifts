import React from 'react';
import { Photo } from '../components/ImageList';

export default function useDefaultImage() {
    const [defaultImage, setDefaultImage] = React.useState('');

    React.useEffect(() => {
        setDefaultImage(`${window.location.origin}/default.jpg`);
    }, []);

    const defaultPhoto = {
        alt: 'The default lenten image',
        avg_color: '#fff',
        height: 1,
        width: 1,
        id: '1',
        photographer: 'unknown',
        photographer_id: '5678',
        photographer_url: 'rt7io',
        url: defaultImage,
        src: {
            landscape: defaultImage,
            large: defaultImage,
            large2x: defaultImage,
            medium: defaultImage,
            small: defaultImage,
            tiny: defaultImage,
        },
    } as unknown as Photo;

    return defaultPhoto;
}
