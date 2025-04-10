import {Permission} from "./Permission.js";
import {Role} from "./Role.js";
import db from "../config/database.js";
import {DataTypes} from "sequelize";
import {Tenant} from "./Tenant.js";

export const RolePermission = db.define('RolePermission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }
    },
    permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Permission,
            key: 'id'
        }
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
    tableName: 'role_permissions',
    timestamps: true
})

// Definir o relacionamento N-N usando RolePermission
Role.belongsToMany(Permission, {through: RolePermission});
Permission.belongsToMany(Role, {through: RolePermission});
