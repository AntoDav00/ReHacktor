const logger = {
    info: (message, ...args) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(message, ...args);
        }
    },
    error: (message, ...args) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(message, ...args);
        }

    }
};

export default logger; 