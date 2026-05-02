const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZzI4MzRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDgyMiwiaWF0IjoxNzc3Njk5OTIyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTQ4MWM1ZTMtNzZlNC00NTRlLTgyMDAtNDdkNjgzOTg2ZDQ1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia2FydGlrIGd1cHRhIiwic3ViIjoiZjRjNTgzYjYtNWI3OC00NTk1LWE1YmQtY2YwODhmY2NkMzE2In0sImVtYWlsIjoia2cyODM0QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoia2FydGlrIGd1cHRhIiwicm9sbE5vIjoicmEyMzExMDMzMDEwMDQ1IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiZjRjNTgzYjYtNWI3OC00NTk1LWE1YmQtY2YwODhmY2NkMzE2IiwiY2xpZW50U2VjcmV0IjoielhIYlpNcnB0TWhCbXZHUyJ9.6qJWYH2CsI3vo0-FKt6IzPm7DYcy20BmhLq6jyEGfxc';

export async function Log(
    stack: 'frontend' | 'backend',
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
    pkg: 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils',
    message: string
): Promise<void> {
    try {
        await fetch('http://20.207.122.201/evaluation-service/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ stack, level, package: pkg, message })
        });
    } catch (e) {
        // silent fail
    }
}