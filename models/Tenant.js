import { DataTypes } from "sequelize";
import db from "../config/database.js";

export const Tenant = db.define('tenant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
},{
    tableName: 'tenants'
})