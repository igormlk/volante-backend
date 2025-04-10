import {DataTypes} from "sequelize";
import db from "../config/database.js";
import {Catalog} from "./Catalog.js";
import {Tenant} from "./Tenant.js";

export const CatalogPriceCondition = db.define('CatalogPriceConditions', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    catalogItemId: {
        references: {
            model: Catalog,
            key: 'id'
        }
    },
    car_paint_type: {
        type: DataTypes.CHAR(2),
        allowNull: true,
        primaryKey: true
    },
    car_size: {
        type: DataTypes.CHAR(2),
        allowNull: true,
        primaryKey: true
    },
    car_color: {
        type: DataTypes.CHAR(2),
        allowNull: true,
        primaryKey: true
    },
    car_part: {
        type: DataTypes.CHAR(2),
        allowNull: true,
        primaryKey: true
    },
    value: {
        type: DataTypes.DECIMAL,
        allowNull: false
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
    tableName: 'catalog_price_conditions',
    timestamps: true
})

CatalogPriceCondition.belongsTo(Tenant)