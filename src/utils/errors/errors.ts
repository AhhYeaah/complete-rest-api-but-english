const defaultErrorMessage = new Map();
defaultErrorMessage.set(400, 'Invalid parameters');
defaultErrorMessage.set(500, 'Internal Server Error');

export function resolveErrorObject(code, message?) {
  const errorMessage = message ?? defaultErrorMessage.get(code) ?? 'Unknown Error';
  return { error: { code: code, message: errorMessage } };
}
