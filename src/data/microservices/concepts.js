export default {
  id: 'microservices-concepts',
  title: '1. Microservices Architecture',
  explanation: `A **microservice** is a small, independently deployable service that owns a single business capability and its data. Services communicate over the network (HTTP/REST or messaging).

**Monolith vs Microservices:**
- Monolith: all features in one deployable unit. Simple to start, hard to scale independently.
- Microservices: each feature is a service. Independent deployment, independent scaling — but distributed systems complexity.

**When to use microservices:** Large teams, high-scale, need to deploy different parts independently. NOT for small apps or early-stage products — "start with a monolith, extract services when you feel the pain."`,
  table: {
    headers: ['Concept', 'Description'],
    rows: [
      ['Service Discovery', 'Services register themselves; clients find them by name, not IP (Eureka, Consul)'],
      ['API Gateway', 'Single entry point — routing, auth, rate limiting, SSL termination (Spring Cloud Gateway, Kong)'],
      ['Circuit Breaker', 'Stop calling a failing service; return fallback instead (Resilience4j)'],
      ['Config Server', 'Centralize configuration; services pull config on startup (Spring Cloud Config)'],
      ['Distributed Tracing', 'Trace a request across multiple services (Zipkin, Jaeger, OpenTelemetry)'],
      ['Saga Pattern', 'Distributed transactions across services using compensating transactions'],
    ],
  },
  code: `// ── Service communication — REST (synchronous) ───────────────────────────
// Using Spring's RestClient (Java 21+) or WebClient (reactive)
import org.springframework.web.client.RestClient;
import org.springframework.cloud.openfeign.*;

// Option 1: RestClient (simple, blocking)
@Service
class OrderClient {
    private final RestClient restClient;

    OrderClient(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("http://order-service").build();
    }

    List<Order> getOrdersForUser(Long userId) {
        return restClient.get()
            .uri("/api/orders?userId={id}", userId)
            .retrieve()
            .body(new org.springframework.core.ParameterizedTypeReference<>() {});
    }
}

// Option 2: Feign Client (Spring Cloud) — declarative REST client
@FeignClient(name = "order-service")   // "order-service" resolved via Eureka
interface OrderServiceClient {
    @GetMapping("/api/orders")
    List<Order> getOrders(@RequestParam Long userId);
}

// ── Circuit Breaker with Resilience4j ─────────────────────────────────────
// Add: spring-cloud-starter-circuitbreaker-resilience4j
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Service
class ProductService {
    private final RestClient restClient;
    ProductService(RestClient.Builder b) { restClient = b.baseUrl("http://inventory").build(); }

    @CircuitBreaker(name = "inventory", fallbackMethod = "fallback")
    public int getStock(Long productId) {
        return restClient.get()
            .uri("/stock/{id}", productId)
            .retrieve()
            .body(Integer.class);
    }

    // Called when circuit is OPEN or request fails
    public int fallback(Long productId, Exception ex) {
        System.err.println("Inventory service down: " + ex.getMessage());
        return -1;  // "unknown stock" fallback
    }
}
// Circuit states: CLOSED (normal) → OPEN (failing) → HALF_OPEN (probing)

// ── Event-driven with Spring Events (in-process) ──────────────────────────
// For cross-service events, use Kafka/RabbitMQ (see next step)
import org.springframework.context.event.*;
import org.springframework.context.ApplicationEventPublisher;

record OrderPlacedEvent(Long orderId, Long userId, double total) {}

@Service
class OrderService {
    private final ApplicationEventPublisher events;
    OrderService(ApplicationEventPublisher e) { this.events = e; }

    void placeOrder(Long userId, double total) {
        // ... save order ...
        events.publishEvent(new OrderPlacedEvent(1L, userId, total)); // async
    }
}

@Service
class NotificationService {
    @EventListener
    @Async  // runs in a separate thread
    void onOrderPlaced(OrderPlacedEvent event) {
        System.out.println("Sending confirmation for order " + event.orderId());
    }
}

// ── Saga pattern — distributed transaction (choreography style) ────────────
// 1. OrderService: save Order(PENDING) → publish OrderCreated event
// 2. PaymentService: consume OrderCreated → charge card
//    success → publish PaymentCompleted
//    fail    → publish PaymentFailed
// 3. OrderService: consume PaymentCompleted → update Order(CONFIRMED)
//                  consume PaymentFailed    → update Order(CANCELLED)
// No 2-phase commit — each service has local ACID transactions; compensation handles failures

record Order(Long orderId, Long userId, double total) {}
@interface GetMapping { String value() default ""; }
@interface RequestParam {}
@interface Service {}
@interface Async {}
@interface EventListener {}`,
  points: [
    'Each microservice should own its own database — no shared DB between services. This ensures loose coupling and independent deployability.',
    'Synchronous REST calls between services create coupling and amplify failure — if the downstream service is slow, the upstream is slow. Prefer async messaging for non-critical flows.',
    'The API Gateway handles cross-cutting concerns (auth, logging, rate limiting) so individual services don\'t need to — keep services lean.',
    'Start with a modular monolith, not microservices — split into services only when you have clear bounded contexts, separate teams, or independent scaling requirements.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is a circuit breaker and why is it needed in microservices?\nA: When service B is failing, service A keeps calling it and accumulates slow/failing threads — cascading failure. A circuit breaker monitors failure rate and "opens" the circuit after a threshold — subsequent calls return immediately with a fallback instead of waiting. After a timeout, it enters HALF_OPEN to probe if the service recovered.',
    },
    {
      type: 'gotcha',
      content: 'Two-phase commit (2PC) for distributed transactions is theoretically possible but practically unusable at scale — it requires all services to be available and creates long-held locks. Use the Saga pattern with compensating transactions instead: each step publishes an event, and failures trigger compensation (refund, cancel, revert).',
    },
  ],
}
