import db from "../config/database.js";
import {DataTypes} from "sequelize";
import {Customer} from "./Customer.js";
import {Tenant} from "./Tenant.js";

export const Contact = db.define('contact', {
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
    number: DataTypes.STRING,
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
    tableName: 'contacts',
    timestamps: true
});

Contact.associate = (models) => {
    models.Contact.belongsTo(Customer, {foreignKey: 'customer_id'});
    models.Contact.belongsTo(Tenant);
};

