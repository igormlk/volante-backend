import {Sequelize} from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
    });

export default db