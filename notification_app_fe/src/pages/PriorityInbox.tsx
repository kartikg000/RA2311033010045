import { useEffect, useState } from 'react';
import * as api from '../api';
import type { AppNotification } from '../api';
import { Log } from '../logger';
import {
    Card, CardContent, Typography, Chip,
    Box, CircularProgress, TextField
} from '@mui/material';

export default function PriorityInbox() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [viewed, setViewed] = useState<Set<string>>(new Set());
    const [topN, setTopN] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            await Log('frontend', 'info', 'page', 'PriorityInbox page loaded');
            const data = await api.getNotifications();
            const priority = api.getPriorityNotifications(data, topN);
            setNotifications(priority);
            setLoading(false);
        }
        setLoading(true);
        load();
    }, [topN]);

    const markViewed = (id: string) => {
        setViewed(prev => new Set([...prev, id]));
        Log('frontend', 'info', 'component', `Priority notification viewed: ${id}`);
    };

    const typeColor: Record<string, 'primary' | 'success' | 'warning'> = {
        Placement: 'primary', Result: 'success', Event: 'warning'
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Priority Inbox</Typography>
            <TextField
                label="Show top N"
                type="number"
                value={topN}
                onChange={e => setTopN(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputprops={{ min: 1, max: 50 }}
            />

            {loading ? <CircularProgress /> : notifications.map((n, i) => (
                <Card
                    key={n.ID}
                    onClick={() => markViewed(n.ID)}
                    sx={{
                        mb: 2, cursor: 'pointer',
                        border: viewed.has(n.ID) ? '1px solid #ccc' : '2px solid #1976d2',
                        opacity: viewed.has(n.ID) ? 0.6 : 1
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">#{i + 1} {n.Message}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label={n.Type} color={typeColor[n.Type]} size="small" />
                                {viewed.has(n.ID) && <Chip label="Viewed" size="small" />}
                            </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{n.Timestamp}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}