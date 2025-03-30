import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: RequestInit
): Promise<Response> {
  // Get the user ID from localStorage if available
  let headers = options?.headers || {};
  try {
    const storedUser = localStorage.getItem("farmlinker_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.id) {
        headers = {
          ...headers,
          "user-id": String(user.id),
        };
      }
    }
  } catch (error) {
    console.error("Error reading user data for authentication header:", error);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Add user authentication header if available
    const headers: Record<string, string> = {};
    try {
      const storedUser = localStorage.getItem("farmlinker_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.id) {
          headers["user-id"] = String(user.id);
        }
      }
    } catch (error) {
      console.error("Error reading user data for authentication header:", error);
    }

    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
