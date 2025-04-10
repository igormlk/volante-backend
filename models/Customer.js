import {DataTypes} from "sequelize";
import db from "../config/database.js";
import {Tenant} from "./Tenant.js";
import {Vehicle} from "./Vehicle.js";
import {Contact} from "./Contact.js";
import {Address} from "./Address.js";
import {Document} from "./CustomerDocument.js";


export const Customer = db.define('customer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: false,
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
    tableName: 'customers',
    timestamps: true
});

Customer.belongsTo(Tenant);
Customer.hasMany(Contact, {foreignKey: 'customer_id', as: 'contacts'});
Customer.hasMany(Document, {foreignKey: 'customer_id', as: 'documents'});
Customer.hasOne(Address, {foreignKey: 'customer_id', as: 'addresses'});
Customer.belongsToMany(Vehicle, {
    through: 'customer_vehicles',
    foreignKey: 'customer_id',
    otherKey: 'vehicle_id',
    as: 'vehicles'
});

