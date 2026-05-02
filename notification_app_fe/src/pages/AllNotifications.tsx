import { useEffect, useState } from 'react';
import { getNotifications, AppNotification } from '../api';
import { Log } from '../logger';
import {
    Card, CardContent, Typography, Chip,
    Select, MenuItem, FormControl, InputLabel,
    Box, CircularProgress
} from '@mui/material';

export default function AllNotifications() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [filter, setFilter] = useState('');
    const [viewed, setViewed] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            await Log('frontend', 'info', 'page', 'AllNotifications page loaded');
            const params = filter ? { notification_type: filter } : {};
            const data = await getNotifications(params);
            setNotifications(data);
            setLoading(false);
        }
        setLoading(true);
        load();
    }, [filter]);

    const markViewed = (id: string) => {
        setViewed(prev => new Set([...prev, id]));
        Log('frontend', 'info', 'component', `Notification viewed: ${id}`);
    };

    const typeColor: Record<string, 'primary' | 'success' | 'warning'> = {
        Placement: 'primary', Result: 'success', Event: 'warning'
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>All Notifications</Typography>
            <FormControl sx={{ mb: 2, minWidth: 200 }}>
                <InputLabel>Filter by Type</InputLabel>
                <Select value={filter} label="Filter by Type" onChange={e => setFilter(e.target.value)}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Placement">Placement</MenuItem>
                    <MenuItem value="Result">Result</MenuItem>
                    <MenuItem value="Event">Event</MenuItem>
                </Select>
            </FormControl>

            {loading ? <CircularProgress /> : notifications.map(n => (
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
                            <Typography variant="h6">{n.Message}</Typography>
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