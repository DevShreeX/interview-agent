/**
 * Curated expert candidate responses for Auto-Fill & Auto-Demo presentation mode.
 */

export const SAMPLE_ANSWERS = {
  rag: [
    "To design a low-latency scalable RAG pipeline under high concurrency, I implement multi-tier vector indexing using HNSW in Qdrant with GPU acceleration. Vector embeddings are cached at the edge using Redis Enterprise with semantic hashing to bypass redundant LLM calls. For retrieval latency, I decouple dense retrieval from sparse BM25 reranking using an asynchronous hybrid search pipeline with Cross-Encoders compiled on TensorRT-LLM.",
    "I partition vector indices by tenant and date, utilizing scalar quantization (SQ8) to compress memory footprint by 75% while retaining 98% recall precision. We stream chunked responses using Server-Sent Events (SSE) and leverage speculative decoding on local NIM microservices to keep P99 latency under 200ms."
  ],
  system_design: [
    "To scale this system to 10x traffic, I apply event-driven microservices architecture using Apache Kafka for async queue decoupling and Redis for write-through caching. Database reads are offloaded to read-replicas with connection pooling via PgBouncer. For resiliency, circuit breakers (Resilience4j) and token-bucket rate limiters protect downstream services.",
    "I implement stateless horizontal pod autoscaling (HPA) triggered by custom Prometheus metrics (queue depth and CPU saturation) rather than just memory usage. State is persisted in distributed DynamoDB tables with strongly consistent read operations for critical financial ledgers."
  ],
  battle: [
    "Under a 10x traffic surge, the primary vector database search connection pool and cross-encoder reranking service become the immediate bottlenecks. I mitigate this by introducing read-only vector replica nodes, enforcing adaptive token-bucket rate limiting at the API gateway, and returning cached semantic embeddings for queries with high similarity scores."
  ]
};

export function getRandomSampleAnswer(type = 'rag') {
  const pool = SAMPLE_ANSWERS[type] || SAMPLE_ANSWERS.rag;
  return pool[Math.floor(Math.random() * pool.length)];
}
