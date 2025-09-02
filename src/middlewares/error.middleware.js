// Middleware de tratamento de erros

export default function errorHandler(err, req, res, next) {
    console.error('Error', err);

    // Se já for um erro conhecido (com status definido), usa ele
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ success: false, message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
    
}