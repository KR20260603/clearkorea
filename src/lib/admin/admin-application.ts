import { z } from "zod";

const adminApplicationFormSchema = z.object({
  name: z.string().trim().min(1).max(80),
  region: z.string().trim().min(1).max(80),
  contact: z.string().trim().min(1).max(200),
  intro: z.string().trim().min(1).max(1000),
  reason: z.string().trim().min(1).max(1000),
});

export type AdminApplicationForm = z.infer<typeof adminApplicationFormSchema>;

export type AdminApplicationInsert = {
  readonly user_id: string;
  readonly name: string;
  readonly region: string;
  readonly contact: string;
  readonly intro: string;
  readonly reason: string;
  readonly status: "pending";
};

export type AdminApplicationResult =
  | { readonly kind: "ready"; readonly insert: AdminApplicationInsert }
  | { readonly kind: "invalid"; readonly message: string };

export function buildAdminApplication(
  userId: string,
  form: unknown,
): AdminApplicationResult {
  if (userId.trim() === "") {
    return {
      kind: "invalid",
      message: "Only a linked Kakao or Naver account can apply as admin.",
    };
  }

  const parsed = adminApplicationFormSchema.safeParse(form);
  if (!parsed.success) {
    return {
      kind: "invalid",
      message: "Fill in every field before applying as admin.",
    };
  }

  return {
    kind: "ready",
    insert: { user_id: userId, status: "pending", ...parsed.data },
  };
}
