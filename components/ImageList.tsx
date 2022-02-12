import React from 'react';
import {
    ImageList as MuiImageList,
    ImageListItem,
    ImageListProps as MuiImageListProps,
    useTheme,
} from '@mui/material';

export interface Photo {
    alt: string;
    avg_color: string;
    height: number;
    width: number;
    id: number;
    photographer: string;
    photographer_id: number;
    photographer_url: string;
    url: string;
    src: {
        landscape: string;
        large: string;
        large2x: string;
        medium: string;
        small: string;
        tiny: string;
    };
}

interface CustomProps {
    onPhotoClick: (photo: Photo) => void;
    photos: Photo[];
    selectedUrl?: string;
    selectedItemStyle: React.CSSProperties;
    unselectedItemStyle: React.CSSProperties;
}

type ImageListProps = CustomProps & Partial<MuiImageListProps>;

export default function ImageList({
    onPhotoClick,
    photos,
    selectedUrl,
    selectedItemStyle,
    unselectedItemStyle,
    ...props
}: ImageListProps) {
    return (
        <MuiImageList {...props}>
            {photos.map((photo) => (
                <ImageListItem key={photo.id}>
                    {/* eslint @next/next/no-img-element: off  */}
                    <img
                        src={photo.src.medium}
                        alt={photo.alt}
                        loading='lazy'
                        onClick={() => onPhotoClick(photo)}
                        style={
                            Object.values(photo.src).some(
                                (url) => selectedUrl === url
                            )
                                ? selectedItemStyle
                                : unselectedItemStyle
                        }
                    />
                </ImageListItem>
            )) || <></>}
        </MuiImageList>
    );
}
