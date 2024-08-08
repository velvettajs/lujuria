import 'dotenv/config';

export const DatabaseConfig = {
    dbUrl: process.env.DATABASE_URL as string
};

export const CdnConfig = {
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID as string,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY as string,
    R2_ENDPOINT: process.env.R2_ENDPOINT as string,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME as string
}

export const CDN_URL = process.env.CDN_URL as string;

export const WEBSITE_DATA = {
    name: 'pornhere.cam',
    url: 'https://pornhere.cam',
    icon: ''
};