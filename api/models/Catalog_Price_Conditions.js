import { DataTypes } from "sequelize";
import db from "../config/database.js";
import { Catalog } from "./Catalog.js";

export const CatalogPriceCondition = db.define('CatalogPriceConditions', {
    catalogItemId: {
        references:{
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
    value:{
        type: DataTypes.DECIMAL,
        allowNull: false
    }
},{
    tableName: 'catalog_price_conditions'
})