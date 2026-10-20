function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

export const config = {
  baseUrl: getRequiredEnv('BASE_URL'),
};

export const credentials = {
  username: getRequiredEnv('TEST_USERNAME'),
  password: getRequiredEnv('TEST_PASSWORD'),
};