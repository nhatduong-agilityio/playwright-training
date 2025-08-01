export const getEnvValue = (key: string, defaultValue?: string) => {
  const value = process.env[key];

  if (!value && defaultValue === null) {
    throw new Error(`Environment variable "${key}" is not defined`);
  }

  return value || defaultValue;
};
