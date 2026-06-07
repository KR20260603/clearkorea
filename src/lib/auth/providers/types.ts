export type ProviderId = "kakao" | "naver";

export type ProviderIdentity = {
  readonly provider: ProviderId;
  readonly subject: string;
};

export type AuthProvider = {
  readonly id: ProviderId;
  readonly label: string;
  readonly startPath: `/auth/${ProviderId}`;
};
