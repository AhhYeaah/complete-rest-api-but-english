export function requiredEnv(param) {
  if (!param) throw Error('Please set the enviroment variables.');
  return param;
}
