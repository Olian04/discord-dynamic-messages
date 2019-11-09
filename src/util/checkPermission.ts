import {
  Guild,
  PermissionResolvable,
  Permissions,
} from 'discord.js';
import { IDynamicMessageConfig } from '../interfaces/IDynamicMessageConfigTame';
import { throwError } from './throwError';

export const checkPermissions = (config: IDynamicMessageConfig, guild: Guild)  => {
  if (guild === null) {
    // In a DM or groupDM.
    // TODO: Figure out what permissions we have in a DM channel.

    // tslint:disable-next-line:no-console
    console.warn(
      `DynamicMessage - Unable to resole permissions of "null" guild. Continuing may result in unintended behavior.`,
    );
    return;
  }

  return [
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
};
