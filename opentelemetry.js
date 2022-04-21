const {
    ConsoleSpanExporter,
    SimpleSpanProcessor
} = require('@opentelemetry/tracing')
const {Resource} = require('@opentelemetry/resources');
const {SemanticResourceAttributes} = require('@opentelemetry/semantic-conventions');
const {HttpInstrumentation} = require('@opentelemetry/instrumentation-http')
const {NodeTracerProvider} = require('@opentelemetry/node')
const {registerInstrumentations} = require('@opentelemetry/instrumentation')
const {JaegerExporter} = require('@opentelemetry/exporter-jaeger');
const {JaegerPropagator} = require('@opentelemetry/propagator-jaeger');

const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'basic-service',
    }),
})

const exporter = new JaegerExporter({
    endpoint: 'http://localhost:14268/api/traces',
});

// To export tracing to Jaeger
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// To export tracing to console
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))

provider.register({
    propagator: new JaegerPropagator()
});

registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation()
    ]
})
