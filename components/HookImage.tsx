import { Link, TextField } from '@mui/material';
import React from 'react';

interface HookImageProps {
    setImage: (image: string) => void;
}

const HookImage = React.forwardRef<HTMLInputElement, HookImageProps>(
    ({ setImage, ...props }, ref) => {
        return (
            <>
                <input type='hidden' ref={ref} {...props} />

                <TextField
                    component='span'
                    fullWidth={true}
                    type='file'
                    inputProps={{
                        accept: 'image/*',
                    }}
                    helperText={
                        <span>
                            Upload an image for your gift. If you are looking
                            for free stock photos, consider{' '}
                            <Link
                                href='https://www.pexels.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Pexels
                            </Link>
                            .
                        </span>
                    }
                    onChange={(e) => {
                        if (!('files' in e.target)) return;
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onloadend = () => {
                            // now rescale the image using a canvas
                            const img = new Image();

                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const maxHeight = 400;
                                const scaleSize = maxHeight / img.height;

                                if (scaleSize > 1) {
                                    const encoded =
                                        reader.result?.toString() || '';
                                    setImage(encoded);
                                    return;
                                }

                                canvas.width = img.width * scaleSize;
                                canvas.height = maxHeight;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(
                                        img,
                                        0,
                                        0,
                                        canvas.width,
                                        canvas.height
                                    );
                                    const srcEncoded = ctx.canvas
                                        .toDataURL('image/jpeg', 0.7)
                                        .toString();

                                    console.log(
                                        'image src in MB: ',
                                        (srcEncoded.length * 3) / 4 / 1000000
                                    );

                                    setImage(srcEncoded);
                                }
                            };

                            img.src = reader.result as string;
                        };
                        reader.readAsDataURL(file);
                    }}
                    size={'small'}
                    margin={'dense'}
                />
            </>
        );
    }
);

HookImage.displayName = 'HookImage';

export default HookImage;
