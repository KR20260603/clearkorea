export type Json = string | number | boolean | null | JsonObject | readonly Json[];

type Table<Row, Insert = Row, Update = Partial<Insert>> = {
  readonly Row: Row;
  readonly Insert: Insert;
  readonly Update: Update;
  readonly Relationships: readonly [];
};

type JsonObject = { readonly [key: string]: Json | undefined };
type Id = string;
type Timestamp = string;
type AppRole = "guest" | "user" | "admin" | "super";
type OAuthProvider = "kakao" | "naver" | "dev_guest";
type Visibility = "visible" | "hidden" | "removed";
type ReviewStatus = "pending" | "approved" | "rejected";
type TargetType = "voice" | "comment" | "post";

type UserRow = {
  readonly id: Id;
  readonly auth_user_id: Id | null;
  readonly nickname: string;
  readonly is_guest: boolean;
  readonly oauth_provider: OAuthProvider | null;
  readonly oauth_subject: string | null;
  readonly role: AppRole;
  readonly verified_badge: boolean;
  readonly trust_score: number;
  readonly created_at: Timestamp;
};

type UserInsert = Omit<UserRow, "id" | "created_at" | "role" | "trust_score" | "verified_badge"> &
  Partial<Pick<UserRow, "id" | "created_at" | "role" | "trust_score" | "verified_badge">>;

type VoiceRow = {
  readonly id: number;
  readonly user_id: Id;
  readonly content: string;
  readonly hashtags: readonly string[];
  readonly visibility: Visibility;
  readonly ai_checked: boolean;
  readonly created_at: Timestamp;
  readonly like_count: number;
  readonly dislike_count: number;
  readonly comment_count: number;
  readonly view_count: number;
  readonly share_count: number;
};

type CommentRow = {
  readonly id: number;
  readonly voice_id: number;
  readonly user_id: Id;
  readonly content: string;
  readonly visibility: Visibility;
  readonly created_at: Timestamp;
};

type RallyRow = {
  readonly id: number;
  readonly title: string;
  readonly location: string;
  readonly lat: number | null;
  readonly lng: number | null;
  readonly seoul_place_code: string | null;
  readonly start_at: Timestamp;
  readonly status: "planned" | "active" | "ended" | "cancelled";
  readonly updated_by: Id | null;
};

type StreamRow = {
  readonly id: number;
  readonly title: string;
  readonly youtube_id: string;
  readonly status: "scheduled" | "live" | "ended" | "hidden";
  readonly is_verified: boolean;
};

type PostRow = {
  readonly id: number;
  readonly type: "verified" | "public";
  readonly user_id: Id | null;
  readonly media_url: string | null;
  readonly content: string;
  readonly visibility: Visibility;
  readonly created_at: Timestamp;
};

type EmbedRow = {
  readonly id: number;
  readonly platform: string;
  readonly url: string;
  readonly verified_user_id: Id | null;
};

type TipRow = {
  readonly id: number;
  readonly submitter_user_id: Id | null;
  readonly figure_name: string;
  readonly url: string;
  readonly platform_detected: string | null;
  readonly status: ReviewStatus;
  readonly reviewed_by: Id | null;
  readonly created_at: Timestamp;
};

type AdminApplicationRow = {
  readonly id: number;
  readonly user_id: Id;
  readonly name: string;
  readonly region: string;
  readonly contact: string;
  readonly intro: string;
  readonly reason: string;
  readonly status: ReviewStatus;
  readonly reviewed_by: Id | null;
  readonly created_at: Timestamp;
};

type NewsItemRow = {
  readonly id: number;
  readonly source: string;
  readonly title: string;
  readonly thumbnail_url: string | null;
  readonly url: string;
  readonly published_at: Timestamp;
  readonly lang: string;
  readonly is_hidden: boolean;
};

type AuditLogRow = {
  readonly id: number;
  readonly actor_id: Id | null;
  readonly action: string;
  readonly target: string;
  readonly created_at: Timestamp;
};

type ReactionRow = {
  readonly id: number;
  readonly target_type: TargetType;
  readonly target_id: number;
  readonly user_id: Id;
  readonly kind: "like" | "dislike";
  readonly created_at: Timestamp;
};

type ReportRow = {
  readonly id: number;
  readonly target_type: TargetType;
  readonly target_id: number;
  readonly reporter_id: Id | null;
  readonly reason: string;
  readonly created_at: Timestamp;
};

type ModerationActionRow = {
  readonly id: number;
  readonly target_type: TargetType;
  readonly target_id: number;
  readonly action: "hide" | "restore" | "remove";
  readonly by: "ai" | "admin" | "auto";
  readonly reason: string;
  readonly created_at: Timestamp;
};

type CounterRow = {
  readonly key: string;
  readonly value: number;
  readonly updated_at: Timestamp;
};

type AffectedStationRow = {
  readonly id: number;
  readonly name: string;
  readonly area: string;
  readonly severity: "red" | "orange" | "yellow";
  readonly status: string;
  readonly note: string;
  readonly updated_at: Timestamp;
};

type SettingRow = {
  readonly key: string;
  readonly value: Json;
  readonly updated_by: Id | null;
  readonly updated_at: Timestamp;
};

export type Database = {
  readonly public: {
    readonly Tables: {
      readonly users: Table<UserRow, UserInsert>;
      readonly voices: Table<VoiceRow, Partial<VoiceRow>>;
      readonly comments: Table<CommentRow, Partial<CommentRow>>;
      readonly rallies: Table<RallyRow, Partial<RallyRow>>;
      readonly streams: Table<StreamRow, Partial<StreamRow>>;
      readonly posts: Table<PostRow, Partial<PostRow>>;
      readonly embeds: Table<EmbedRow, Partial<EmbedRow>>;
      readonly tips: Table<TipRow, Partial<TipRow>>;
      readonly admin_applications: Table<AdminApplicationRow, Partial<AdminApplicationRow>>;
      readonly news_items: Table<NewsItemRow, Partial<NewsItemRow>>;
      readonly audit_logs: Table<AuditLogRow, Partial<AuditLogRow>>;
      readonly reactions: Table<ReactionRow, Partial<ReactionRow>>;
      readonly reports: Table<ReportRow, Partial<ReportRow>>;
      readonly moderation_actions: Table<ModerationActionRow, Partial<ModerationActionRow>>;
      readonly counters: Table<CounterRow>;
      readonly affected_stations: Table<AffectedStationRow, Partial<AffectedStationRow>>;
      readonly settings: Table<SettingRow>;
    };
    readonly Views: Record<string, never>;
    readonly Functions: Record<string, never>;
    readonly Enums: {
      readonly app_role: AppRole;
      readonly oauth_provider: Exclude<OAuthProvider, "dev_guest">;
      readonly content_visibility: Visibility;
    };
  };
};

export type Tables<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Row"];
