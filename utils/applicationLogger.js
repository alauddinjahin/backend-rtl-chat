
const applicationLogger = (err, req) => {

    const timestamp = new Date().toISOString()
    return {
        body: {
            error: err.message,
            stack: err.stack,
            requestId: req.id,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        },
        production: {
            error: 'Internal server error',
            message: 'Something went wrong on our end',
            requestId: req.id,
            timestamp
        },
        dev: {
            error: err.message,
            stack: err.stack,
            requestId: req.id,
            timestamp
        }
    }

}

module.exports = applicationLogger