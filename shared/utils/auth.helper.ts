export const readServerAccessToken = (cookies: any) => {
    return cookies.get("accessToken")?.value ?? null;
  };
  