const { Log, setToken } = require('../logging_middleware/index');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZzI4MzRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDgyMiwiaWF0IjoxNzc3Njk5OTIyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTQ4MWM1ZTMtNzZlNC00NTRlLTgyMDAtNDdkNjgzOTg2ZDQ1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2FydGlrIGd1cHRhIiwic3ViIjoiZjRjNTgzYjYtNWI3OC00NTk1LWE1YmQtY2YwODhmY2NkMzE2In0sImVtYWlsIjoia2cyODM0QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoia2FydGlrIGd1cHRhIiwicm9sbE5vIjoicmEyMzExMDMzMDEwMDQ1IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiZjRjNTgzYjYtNWI3OC00NTk1LWE1YmQtY2YwODhmY2NkMzE2IiwiY2xpZW50U2VjcmV0IjoielhIYlpNcnB0TWhCbXZHUyJ9.6qJWYH2CsI3vo0-FKt6IzPm7DYcy20BmhLq6jyEGfxc';

setToken(TOKEN);

const TYPE_WEIGHT = {
    Placement: 3,
    Result: 2,
    Event: 1
};

async function fetchNotifications() {
    const response = await fetch('http://20.207.122.201/evaluation-service/notifications', {
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.notifications;
}

async function getTopN(n = 10) {
    await Log('frontend', 'info', 'utils', `Fetching top ${n} priority notifications`);
    const notifications = await fetchNotifications();
    const sorted = notifications.sort((a, b) => {
        const weightDiff = (TYPE_WEIGHT[b.Type] || 0) - (TYPE_WEIGHT[a.Type] || 0);
        if (weightDiff !== 0) return weightDiff;
        return new Date(b.Timestamp) - new Date(a.Timestamp);
    });
    const top = sorted.slice(0, n);
    await Log('frontend', 'info', 'utils', `Top ${n} notifications retrieved successfully`);
    console.log(`Top ${n} Priority Notifications:`);
    console.log(JSON.stringify(top, null, 2));
    return top;
}

getTopN(10);