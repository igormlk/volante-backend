import db from "../config/database.js";
import {DataTypes} from "sequelize";
import {Tenant} from "./Tenant.js";

export const Role = db.define('role', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'roles'
})

