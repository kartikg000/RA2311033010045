const axios = require('axios');

let authToken = '';

function setToken(token) {
    authToken = token;
}

async function Log(stack, level, package_, message) {
    try {
        const response = await axios.post(
            'http://20.207.122.201/evaluation-service/logs',
            {
                stack: stack,
                level: level,
                package: package_,
                message: message
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Logging failed:', error.message);
    }
}

module.exports = { Log, setToken };