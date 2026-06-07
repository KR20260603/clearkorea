export type AppRole = "guest" | "user" | "admin" | "super";

export type ManagedRole = Exclude<AppRole, "guest">;
