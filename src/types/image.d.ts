export interface Image {
    id: number;
    file_name: string;
    url: string;
    width: number;
    height: number;
    created_at: string;
    thumbnail: string;
}

export interface ImageRecord {
    date: string;
    list: Image[];
}

export type ImageList = ImageRecord[];
