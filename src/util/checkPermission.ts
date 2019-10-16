import {
  Guild,
  PermissionResolvable,
  Permissions,
} from 'discord.js';
import { IDynamicMessageConfig } from '../interfaces';
import { throwError } from './throwError';

export const checkPermissions = (config: IDynamicMessageConfig, guild: Guild)  => [
    Permissions.FLAGS.VIEW_CHANNEL,
    Permissions.FLAGS.ADD_REACTIONS,
    Permissions.FLAGS.MANAGE_MESSAGES,
    Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.READ_MESSAGES,
    Permissions.FLAGS.READ_MESSAGE_HISTORY,
  ].forEach((permission: PermissionResolvable) => {
    const gotPermissions = guild.me.hasPermission(permission);
    if (!gotPermissions) {
      throwError(config, `DynamicMessage - Missing permission ${permission.toString()}`);
    }
  });
