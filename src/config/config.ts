import { config } from 'dotenv';
config();

export const DatabaseConfig = {
    dbUrl: process.env.DATABASE_URL as string
};

export const CdnConfig = {
    cdnUrl: process.env.CND_URL as string,
}