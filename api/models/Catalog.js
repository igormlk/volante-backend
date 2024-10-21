import { DataTypes } from "sequelize";
import db from "../config/database.js";

export const Catalog = db.define('catalog', {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING(25),
        allowNull: true,
        unique: true
    },
    value:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    type:{
        type: DataTypes.STRING,
        allowNull:false
    },
    hasConditionalPrice: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    tableName: 'catalog'
})