import {DataTypes} from "sequelize";
import db from "../config/database.js";
import {Tenant} from "./Tenant.js";

export const Catalog = db.define('catalog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING(25),
        allowNull: true,
        unique: true
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hasConditionalPrice: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    tenantId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
            model: Tenant,
            key: 'id'
        }
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    }
}, {
    tableName: 'catalog',
    timestamps: true
})

Catalog.belongsTo(Tenant);