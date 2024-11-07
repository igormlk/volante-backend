import { DataTypes } from "sequelize";
import db from "../config/database.js";
import { ServiceOrder } from "./ServiceOrder.js";
import { Catalog } from "./Catalog.js";
import {Tenant} from "./Tenant.js";
import {User} from "./User.js";

export const ServiceOrderItem = db.define('service_order_items', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
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
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: Tenant,
            key: 'id'
        }
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'service_order_items'
})

ServiceOrderItem.belongsTo(Tenant);
ServiceOrderItem.belongsTo(ServiceOrder, { foreignKey: 'serviceOrderId', allowNull: true });
ServiceOrderItem.belongsTo(Catalog, { foreignKey: 'catalogItemId', allowNull: true });
ServiceOrder.hasMany(ServiceOrderItem, { foreignKey: 'serviceOrderId' });
Catalog.hasMany(ServiceOrderItem, { foreignKey: 'catalogItemId' });