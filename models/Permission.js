import db from "../config/database.js";
import {DataTypes} from "sequelize";
import {Tenant} from "./Tenant.js";

export const Permission = db.define('permission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Tenant,
            key: 'id'
        }
    },
}, {
    tableName: 'permissions'
})
