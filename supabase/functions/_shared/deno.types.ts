export interface DenoNamespace {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response>): void;
}

// Re-export Deno.serve
export const serve = Deno.serve
