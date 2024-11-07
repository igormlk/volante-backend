import { DataTypes } from "sequelize";
import db from "../config/database.js";
import {Tenant} from "./Tenant.js";
import {User} from "./User.js";

export const Supplier = db.define('Supplier', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING(18),
        allowNull: true,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact_person: {
        type: DataTypes.STRING,
        allowNull: true
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
    tableName: 'suppliers'
});

Supplier.belongsTo(Tenant);