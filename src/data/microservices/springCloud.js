export default {
  id: 'spring-cloud',
  title: '2. Spring Cloud & Kafka/RabbitMQ',
  explanation: `**Spring Cloud** provides microservices infrastructure on top of Spring Boot:
- **Eureka** — service registry and discovery
- **Spring Cloud Gateway** — API Gateway with routing, filters, rate limiting
- **Spring Cloud Config** — centralized configuration server

**Message brokers** decouple services and enable async communication:
- **RabbitMQ** — AMQP protocol, exchange/queue model, good for task queues
- **Apache Kafka** — event log, partitioned, high-throughput, replay-able`,
  table: {
    headers: ['Tool', 'Role', 'Best For'],
    rows: [
      ['Eureka', 'Service registry', 'Service discovery in Spring Cloud'],
      ['Spring Cloud Gateway', 'API Gateway', 'Routing, auth, rate limiting'],
      ['Spring Cloud Config', 'Config server', 'Centralized config for all services'],
      ['RabbitMQ', 'Message broker', 'Task queues, work distribution'],
      ['Apache Kafka', 'Event streaming', 'High-throughput events, audit log, replay'],
      ['Resilience4j', 'Resilience', 'Circuit breaker, retry, rate limiter'],
    ],
  },
  code: `// ── Eureka Service Discovery ──────────────────────────────────────────────
// Server (separate Spring Boot app):
// @EnableEurekaServer on main class
// application.yml: eureka.client.register-with-eureka=false

// Client (every microservice):
// application.yml:
// spring.application.name=user-service        ← service name for discovery
// eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

// Now Feign clients can use service NAME instead of URL:
// @FeignClient(name = "order-service")  ← Eureka resolves the actual IP/port

// ── Spring Cloud Gateway ──────────────────────────────────────────────────
// application.yml
/*
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service        # lb:// = load-balanced via Eureka
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1             # remove /api prefix before forwarding
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
            - Method=GET,POST
*/

// Custom Gateway Filter
import org.springframework.cloud.gateway.filter.*;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class AuthFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                              GatewayFilterChain chain) {
        var token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(
                org.springframework.http.HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);  // continue
    }

    public int getOrder() { return -1; }  // high priority
}

// ── Kafka with Spring ─────────────────────────────────────────────────────
// Add: spring-kafka
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;

// Producer — publish event
@Service
class OrderEventPublisher {
    private final KafkaTemplate<String, String> kafka;

    OrderEventPublisher(KafkaTemplate<String, String> kafka) {
        this.kafka = kafka;
    }

    void publishOrderCreated(Long orderId) {
        String payload = """{"orderId":""" + orderId + ""","event":"ORDER_CREATED"}""";
        kafka.send("order-events", String.valueOf(orderId), payload);
        //        topic            key (partition key)          value
    }
}

// Consumer — handle event in a separate service
@Component
class InventoryEventHandler {
    @KafkaListener(topics = "order-events", groupId = "inventory-group")
    void handleOrderEvent(String message) {
        System.out.println("Inventory service received: " + message);
        // update stock, etc.
    }
}

// application.yml for Kafka:
/*
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: inventory-group
      auto-offset-reset: earliest    # read from beginning if no committed offset
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
*/

// ── RabbitMQ with Spring ──────────────────────────────────────────────────
// Add: spring-boot-starter-amqp
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Service
class EmailQueuePublisher {
    private final RabbitTemplate rabbit;
    EmailQueuePublisher(RabbitTemplate r) { this.rabbit = r; }

    void queueEmail(String to, String subject) {
        rabbit.convertAndSend("email.queue", to + "|" + subject);
    }
}

@Component
class EmailWorker {
    @RabbitListener(queues = "email.queue")
    void processEmail(String message) {
        String[] parts = message.split("\\|");
        System.out.println("Sending email to " + parts[0] + ": " + parts[1]);
    }
}

@interface Service {} @interface Component {}`,
  points: [
    'Use Kafka for event sourcing, audit logs, and high-throughput streams where replay matters. Use RabbitMQ for task queues, work distribution, and RPC-style patterns.',
    'Kafka consumers in a consumer group share partitions — each partition is read by exactly one consumer. Scale consumers by adding partitions (partition count ≥ consumer count).',
    'Spring Cloud Gateway runs on WebFlux (reactive, non-blocking) — don\'t mix it with blocking code (JDBC) in filters.',
    'The API Gateway should be thin — routing and cross-cutting concerns only. Business logic stays in the services.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between Kafka and RabbitMQ?\nA: RabbitMQ is a traditional message broker — messages are pushed to consumers and deleted after acknowledgement. Kafka is an event log — messages are retained for a configurable period and consumers track their own offset. This means Kafka supports replay (re-processing past events), multiple independent consumers of the same event, and much higher throughput.',
    },
    {
      type: 'gotcha',
      content: 'Kafka\'s auto-offset-reset=earliest means a new consumer group reads ALL historical messages from the beginning — potentially millions. Use latest for new consumers that only care about future events, earliest only for replay scenarios.',
    },
  ],
}
