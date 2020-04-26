import { dynamicMessage, useGuild, useChannel, useState  } from '../src/api';

export const InfoMessage = dynamicMessage(() => {
  const guild = useGuild();
  const channel = useChannel();
  return '' +
  `Guild: ${guild.get()?.name}\n` +
  `Channel: ${channel.get()?.name}\n` +
  `NodeJS: ${process.versions.node}\n` +
  `V8: ${process.versions.v8}\n` +
  `Uptime: ${Math.ceil(process.uptime() / 60)}min`;
});