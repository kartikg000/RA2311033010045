import { TOKEN } from './api';

export async function Log(
    stack: 'frontend' | 'backend',
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
    pkg: 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils',
    message: string
): Promise<void> {
    try {
        await fetch('/api/evaluation-service/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({
                stack: stack,
                level: level,
                package: pkg,
                message: message
            })
        });
    } catch (e) {
        // silent fail
    }
}