import db from "../config/database.js";
import {DataTypes} from "sequelize";
import {Customer} from "./Customer.js";
import {Tenant} from "./Tenant.js";

export const Document = db.define('document', {
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
        }
    },
    type: DataTypes.STRING,
    country: DataTypes.STRING,
    value: DataTypes.STRING,
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
    tableName: 'documents',
    timestamps: true
});

Document.associate = (models) => {
    models.Document.belongsTo(Customer, {foreignKey: 'customer_id'});
    models.Document.belongsTo(Tenant);
};
