// tslint:disable
const chalk = require('chalk');

export const describe = async (subject: string, cb: () =>void | Promise<void>) => {
  console.group(chalk.blue(subject));
  return new Promise(async (resolve) => {
    await Promise.resolve(cb());
    console.groupEnd();
    resolve();
    // TODO: Fix indentation issues
  });
}

export const it = async (subject: string, cb: () =>void | Promise<void>) => {
  return Promise.resolve(cb())
    .then(() => {
      console.log(chalk.greenBright(subject));
    })
    .catch((err) => {
      console.group(chalk.redBright(subject));
      console.log(chalk.redBright(err.message));
      console.log(chalk.redBright(`Actual: ${err.actual}`));
      console.log(chalk.redBright(`Expected: ${err.expected}`));
    });
}