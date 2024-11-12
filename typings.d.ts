export interface PluginSettingsBody {
    rank: string;
    title: string;
    subtitle: string;
    triggerWebhooks: boolean;
}

export interface PluginSettingsResponse {
    body: PluginSettingsBody;
}

export interface RankUpdate {
    id: number;
    rank: number;
}

export interface WelcomeResponse {
    body: string;
}