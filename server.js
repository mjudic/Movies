import Fastify from 'fastify';
import fs from 'fs';

const fastify = Fastify({
    logger: true
});

function randomDelay(maxDelay) {
    return new Promise(resolve => {
        const delay = Math.floor(Math.random() * maxDelay); // Random delay up to maxDelay ms
        setTimeout(resolve, delay);
    });
}

function maybeThrowError(probability) {
    const shouldThrow = Math.random() < probability; // Probability of throwing an error
    if (shouldThrow) {
        throw new Error('Fake server error');
    }
}

fastify.get('/', async (request, reply) => {
    // Set defaults and read query parameters
    const maxDelay = parseInt(request.query.maxDelay, 10) || 4000;
    const errorProbability = parseFloat(request.query.errorProbability) || 0.1;

    await randomDelay(maxDelay);
    maybeThrowError(errorProbability);

    const data = JSON.parse(fs.readFileSync('db.json')).movies;

    // Pagination
    const limit = parseInt(request.query.limit, 10) || data.length;
    const offset = parseInt(request.query.offset, 10) || 0;

    // Filtering
    let filteredData = data;
    if (request.query.filter) {
        const [key, value] = request.query.filter.split('=');
        filteredData = filteredData.filter(item => item[key].includes(value));
    }

    // Sorting
    if (request.query.sortBy) {
        const sortProperty = request.query.sortBy
        filteredData = filteredData.sort((a, b) => {
            return b[sortProperty] - a[sortProperty];
        });
    }

    // Apply pagination
    const paginatedData = filteredData.slice(offset, offset + limit);
    return {
        movies: paginatedData,
        total: filteredData.length
    };
});

try {
    await fastify.listen({port: 3000});
} catch (err) {
    fastify.log.error(err);
}
