import { Log } from './logger';

const BASE = 'http://20.207.122.201/evaluation-service';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZzI4MzRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDgyMiwiaWF0IjoxNzc3Njk5OTIyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTQ4MWM1ZTMtNzZlNC00NTRlLTgyMDAtNDdkNjgzOTg2ZDQ1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2FydGlrIGd1cHRhIiwic3ViIjoiZjRjNTgzYjYtNWI3OC00NTk1LWE1YmQtY2YwODhmY2NkMzE2In0sImVtYWlsIjoia2cyODM0QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoia2FydGlrIGd1cHRhIiwicm9sbE5vIjoicmEyMzExMDMzMDEwMDQ1IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiZjRjNTgzYjYtNWI3OC00NTk1LWE1YmQtY2YwODhmY2NkMzE2IiwiY2xpZW50U2VjcmV0IjoielhIYlpNcnB0TWhCbXZHUyJ9.6qJWYH2CsI3vo0-FKt6IzPm7DYcy20BmhLq6jyEGfxc';

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

export interface AppNotification {
    ID: string;
    Type: 'Placement' | 'Result' | 'Event';
    Message: string;
    Timestamp: string;
}

export async function getNotifications(params: Record<string, string> = {}): Promise<AppNotification[]> {
    const query = new URLSearchParams(params).toString();
    const url = `${BASE}/notifications${query ? '?' + query : ''}`;
    await Log('frontend', 'info', 'api', `Fetching notifications with params: ${JSON.stringify(params)}`);
    const res = await fetch(url, { headers });
    const data = await res.json();
    await Log('frontend', 'info', 'api', `Fetched ${data.notifications?.length} notifications`);
    return data.notifications || [];
}

const TYPE_WEIGHT: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };

export function getPriorityNotifications(notifications: AppNotification[], n: number = 10): AppNotification[] {
    return [...notifications]
        .sort((a, b) => {
            const w = (TYPE_WEIGHT[b.Type] || 0) - (TYPE_WEIGHT[a.Type] || 0);
            if (w !== 0) return w;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        })
        .slice(0, n);
}