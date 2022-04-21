require('./opentelemetry')
const fastify = require('fastify')({logger: true})
const openTelemetryPlugin = require('@autotelic/fastify-opentelemetry')

fastify.register(openTelemetryPlugin, {wrapRoutes: true})

fastify.get('/example', async (request, reply) => {
    const {
        activeSpan,
        tracer,
    } = request.openTelemetry()

    // Spans started in a wrapped route will automatically be children of the activeSpan.
    const childSpan = tracer.startSpan(`${activeSpan.name} - child process`)
    // doSomeWork()
    childSpan.end()

    return {hello: 'world'}
})

// Run the server!
const start = async () => {
    await fastify.listen(3000)
}
start()
