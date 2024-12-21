interface Error {
  response?: { data?: { message?: string } };
}
export function formatError(e: unknown) {
  if ((e as Error).response?.data?.message) {
    return (e as Error).response?.data?.message as string;
  }
  if (e instanceof Error) {
    return e.message;
  }
  return JSON.stringify(e);
}
