import { DataTypes } from "sequelize";
import db from "../config/database.js";
import { ServiceOrder } from "./ServiceOrder.js";
import { Catalog } from "./Catalog.js";

export const ServiceOrderItem = db.define('service_order_items', {
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    value:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'parts'
    }
}, {
    tableName: 'service_order_items'
})

ServiceOrderItem.belongsTo(ServiceOrder, { foreignKey: 'serviceOrderId', allowNull: true });
ServiceOrderItem.belongsTo(Catalog, { foreignKey: 'catalogItemId', allowNull: true });
ServiceOrder.hasMany(ServiceOrderItem, { foreignKey: 'serviceOrderId' });
Catalog.hasMany(ServiceOrderItem, { foreignKey: 'catalogItemId' });