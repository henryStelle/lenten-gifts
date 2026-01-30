import React from 'react';

export default function useDefaultImage() {
    const [defaultImage, setDefaultImage] = React.useState('/easter_2023.jpg');

    React.useEffect(() => {
        setDefaultImage(`${window.location.origin}/easter_2023.jpg`);
    }, []);

    const defaultPhoto = {
        alt: 'The default easter image',
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
    };

    return defaultPhoto;
}
