import db from "../config/database.js";
import {DataTypes} from "sequelize";
import {Customer} from "./Customer.js";
import {Tenant} from "./Tenant.js";

export const Address = db.define('address', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    tenantId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Tenant,
            key: 'id'
        },
    },
    street: DataTypes.STRING,
    number: DataTypes.STRING,
    complement: DataTypes.STRING,
    neighborhood: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    customer_id: {
        type: DataTypes.UUID,
        allowNull: false
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
    tableName: 'addresses',
    timestamps: true
});


Address.associate = (models) => {
    models.Address.belongsTo(Customer, {foreignKey: 'customer_id'});
    models.Address.belongsTo(Tenant);
};
