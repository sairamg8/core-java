// Stage 1 — Java Foundations
import programmingFundamentals from './core/basics/programmingFundamentals'
import javaIntro from './core/basics/javaIntro'
import jvmSection from './core/basics/jvm'
import namingConventions from './core/basics/namingConventions'
import variablesSection from './core/basics/variables'
import datatypesSection from './core/basics/datatypes'
import literalsSection from './core/basics/literals'
import castingSection from './core/basics/casting'
import autoboxingSection from './core/basics/autoboxing'
import operatorsSection from './core/basics/operators'
import controlFlowSection from './core/basics/controlFlow'
import stackAndHeap from './core/basics/stackAndHeap'
import methodsSection from './core/basics/methods'
import arraysSection from './core/basics/arrays'
import arrayOfObjects from './core/basics/arrayOfObjects'

// Stage 2 — OOP
import classesSection from './core/oop/classes'
import thisKeyword from './core/oop/thisKeyword'
import anonymousObject from './core/oop/anonymousObject'
import encapsulationSection from './core/oop/encapsulation'
import inheritanceSection from './core/oop/inheritance'
import packagesSection from './core/oop/packages'
import objectClassSection from './core/oop/objectClass'
import innerClasses from './core/oop/innerClasses'
import annotationsSection from './core/oop/annotations'
import polymorphismSection from './core/oop/polymorphism'
import abstractionSection from './core/oop/abstraction'
import finalStaticSection from './core/oop/finalStatic'

// Stage 3 — Core APIs
import stringPool from './core/strings/stringPool'
import stringImmutability from './core/strings/immutability'
import stringBuilders from './core/strings/builders'
import stringMethods from './core/strings/methods'
import exceptionBasics from './core/exceptions/basics'
import exceptionAdvanced from './core/exceptions/advanced'
import collectionsOverview from './core/collections/overview'
import collectionsList from './core/collections/list'
import collectionsQueue from './core/collections/queue'
import collectionsSetTypes from './core/collections/setTypes'
import collectionsMapTypes from './core/collections/mapTypes'
import collectionsComparisons from './core/collections/comparisons'
import genericsBasics from './core/generics/basics'
import genericsWildcards from './core/generics/wildcards'

// Stage 4 — Modern Java
import lambdas from './modern/lambdas'
import streams from './modern/streams'
import optional from './modern/optional'
import dateTime from './modern/dateTime'
import modernFeatures from './modern/modernFeatures'

// Stage 7 — Ecosystem (Maven / JDBC / JPA)
import maven from './ecosystem/maven'
import jdbc from './ecosystem/jdbc'
import hibernate from './ecosystem/hibernate'

// Stage 8 — Spring & Spring Boot
import springCore from './spring/springCore'
import springBoot from './spring/springBoot'
import restApi from './spring/restApi'

// Stage 9 — Microservices
import microConcepts from './microservices/concepts'
import springCloud from './microservices/springCloud'

// Stage 10 — Version Control (Git)
import gitBasics from './ecosystem/gitBasics'
import gitBranching from './ecosystem/gitBranching'
import gitRemote from './ecosystem/gitRemote'
import gitAdvanced from './ecosystem/gitAdvanced'

// Stage 11 — SQL & Databases
import sqlBasics from './ecosystem/sqlBasics'
import sqlJoins from './ecosystem/sqlJoins'
import sqlAggregates from './ecosystem/sqlAggregates'
import sqlAdvanced from './ecosystem/sqlAdvanced'

// Stage 12 — Legacy Web (Servlet & JSP)
import servletBasics from './ecosystem/servletBasics'
import jspBasics from './ecosystem/jspBasics'

// Stage 13 — Spring Security
import securityBasics from './spring/securityBasics'
import jwtAuth from './spring/jwtAuth'
import oauth2 from './spring/oauth2'

// Stage 14 — DevOps & Cloud
import logging from './ecosystem/logging'
import dockerBasics from './devops/dockerBasics'
import dockerCompose from './devops/dockerCompose'
import awsCore from './devops/awsCore'
import awsDeploy from './devops/awsDeploy'

// Stage 15 — Spring AI
import springAiBasics from './spring/springAiBasics'
import springAiAdvanced from './spring/springAiAdvanced'

// Stage 6 — Testing
import junit5Basics from './testing/junit5Basics'
import junit5Advanced from './testing/junit5Advanced'
import mockito from './testing/mockito'
import testPatterns from './testing/testPatterns'

// Stage 5 — Advanced Java
import threadBasics from './advanced/threadBasics'
import concurrency from './advanced/concurrency'
import jvmGc from './advanced/jvmGc'
import designPatterns from './advanced/designPatterns'
import ioNio from './advanced/ioNio'
import userInput from './advanced/userInput'
import serialization from './advanced/serialization'

export const STAGES = [
  {
    number: 1,
    label: 'Java Foundations',
    color: 'blue',
    description: 'How Java works under the hood, types, operators, and control flow.',
    steps: [
      {
        step: 1, id: 'jvm-jdk-jre',
        title: 'JVM, JDK & JRE',
        subtitle: 'How Java code goes from source to execution — and why Java is platform-independent.',
        sections: [programmingFundamentals, javaIntro, jvmSection, namingConventions],
      },
      {
        step: 2, id: 'data-types',
        title: 'Data Types & Variables',
        subtitle: 'Primitive types vs reference types, memory layout, and default values.',
        sections: [variablesSection, datatypesSection, literalsSection],
      },
      {
        step: 3, id: 'casting-autoboxing',
        title: 'Type Casting & Autoboxing',
        subtitle: 'Widening, narrowing, autoboxing, unboxing, and the Integer cache gotcha.',
        sections: [castingSection, autoboxingSection],
      },
      {
        step: 4, id: 'operators',
        title: 'Operators',
        subtitle: 'Arithmetic, relational, logical, bitwise, ternary — and operator precedence.',
        sections: [operatorsSection],
      },
      {
        step: 5, id: 'control-flow',
        title: 'Control Flow',
        subtitle: 'if/else, switch expressions (Java 14+), for/while/do-while, break and continue.',
        sections: [controlFlowSection],
      },
      {
        step: 6, id: 'methods-arrays',
        title: 'Methods & Arrays',
        subtitle: 'Defining methods, varargs, overloading, 1D/2D arrays, and Arrays utility class.',
        sections: [stackAndHeap, methodsSection, arraysSection, arrayOfObjects],
      },
    ],
  },
  {
    number: 2,
    label: 'Object-Oriented Programming',
    color: 'orange',
    description: 'The four OOP pillars — with every interview nuance and gotcha.',
    steps: [
      {
        step: 7, id: 'classes-objects',
        title: 'Classes & Objects',
        subtitle: 'Class anatomy, constructors, the this keyword, anonymous objects, and how objects live on the heap.',
        sections: [classesSection, thisKeyword, anonymousObject],
      },
      {
        step: 8, id: 'encapsulation',
        title: 'Encapsulation',
        subtitle: 'Access modifiers (public/private/protected/package), getters/setters, data hiding.',
        sections: [encapsulationSection],
      },
      {
        step: 9, id: 'inheritance',
        title: 'Inheritance',
        subtitle: 'extends keyword, super, method overriding rules, constructor chaining, and packages.',
        sections: [inheritanceSection, packagesSection],
      },
      {
        step: 10, id: 'polymorphism',
        title: 'Polymorphism',
        subtitle: 'Compile-time vs runtime polymorphism, dynamic dispatch, covariant return types, and the Object class.',
        sections: [polymorphismSection, objectClassSection],
      },
      {
        step: 11, id: 'abstraction',
        title: 'Abstraction',
        subtitle: 'Abstract classes, interfaces, default & static interface methods, inner classes, and annotations.',
        sections: [abstractionSection, innerClasses, annotationsSection],
      },
      {
        step: 12, id: 'static-final-enums',
        title: 'Static, Final & Enums',
        subtitle: 'static semantics, final variables/methods/classes, and the power of Enum.',
        sections: [finalStaticSection],
      },
    ],
  },
  {
    number: 3,
    label: 'Core APIs',
    color: 'emerald',
    description: 'The essential Java library classes you will use in every real project.',
    steps: [
      {
        step: 13, id: 'strings',
        title: 'String Handling',
        subtitle: 'Immutability, String Pool, StringBuilder vs StringBuffer, and critical String methods.',
        sections: [stringPool, stringImmutability, stringBuilders, stringMethods],
      },
      {
        step: 14, id: 'exceptions',
        title: 'Exception Handling',
        subtitle: 'try/catch/finally, checked vs unchecked, try-with-resources, custom exceptions.',
        sections: [exceptionBasics, exceptionAdvanced],
      },
      {
        step: 15, id: 'collections-lists-queues',
        title: 'Collections — Lists & Queues',
        subtitle: 'ArrayList vs LinkedList internals, ArrayDeque, PriorityQueue, and when to use each.',
        sections: [collectionsOverview, collectionsList, collectionsQueue],
      },
      {
        step: 16, id: 'collections-sets-maps',
        title: 'Collections — Sets & Maps',
        subtitle: 'HashSet, TreeSet, HashMap internals, LinkedHashMap LRU, TreeMap, Comparable vs Comparator.',
        sections: [collectionsSetTypes, collectionsMapTypes, collectionsComparisons],
      },
      {
        step: 17, id: 'generics',
        title: 'Generics',
        subtitle: 'Generic classes & methods, bounded types (extends/super), wildcards, type erasure.',
        sections: [genericsBasics, genericsWildcards],
      },
    ],
  },
  {
    number: 4,
    label: 'Modern Java (8–21)',
    color: 'purple',
    description: 'Functional programming, streams, and everything that changed since Java 8.',
    steps: [
      {
        step: 18, id: 'lambdas',
        title: 'Lambdas & Functional Interfaces',
        subtitle: 'Lambda syntax, method references, Predicate, Function, Consumer, Supplier.',
        sections: [lambdas],
      },
      {
        step: 19, id: 'streams',
        title: 'Stream API',
        subtitle: 'filter, map, flatMap, collect, reduce, parallel streams — and when NOT to use them.',
        sections: [streams],
      },
      {
        step: 20, id: 'optional-datetime',
        title: 'Optional & Date/Time API',
        subtitle: 'Eliminating nulls with Optional, LocalDate/Time, ZonedDateTime, Duration, Period.',
        sections: [optional, dateTime],
      },
      {
        step: 21, id: 'modern-java',
        title: 'Java 9–21 Features',
        subtitle: 'var, text blocks, records, sealed classes, pattern matching, virtual threads.',
        sections: [modernFeatures],
      },
    ],
  },
  {
    number: 5,
    label: 'Advanced Java',
    color: 'red',
    description: 'JVM internals, concurrency, patterns — production-grade Java knowledge.',
    steps: [
      {
        step: 22, id: 'multithreading',
        title: 'Multithreading',
        subtitle: 'Thread lifecycle, synchronized, volatile, deadlocks, and the Java Memory Model.',
        sections: [threadBasics],
      },
      {
        step: 23, id: 'concurrency-utils',
        title: 'Concurrency Utilities',
        subtitle: 'ExecutorService, CompletableFuture, ReentrantLock, Atomic classes, ConcurrentHashMap.',
        sections: [concurrency],
      },
      {
        step: 24, id: 'jvm-gc',
        title: 'JVM Internals & Garbage Collection',
        subtitle: 'Heap regions, G1/ZGC/Shenandoah, GC tuning flags, memory leaks.',
        sections: [jvmGc],
      },
      {
        step: 25, id: 'design-patterns',
        title: 'Design Patterns',
        subtitle: 'Singleton, Factory, Builder, Observer, Strategy, Decorator — in idiomatic Java.',
        sections: [designPatterns],
      },
      {
        step: 26, id: 'io-nio',
        title: 'Java I/O & NIO',
        subtitle: 'Files API, InputStream/OutputStream, BufferedReader/Writer, NIO basics, and user input (Scanner).',
        sections: [userInput, ioNio, serialization],
      },
    ],
  },
  {
    number: 6,
    label: 'Testing',
    color: 'teal',
    description: 'Write tests that give you confidence to refactor — JUnit 5, Mockito, and TDD.',
    steps: [
      {
        step: 27, id: 'junit5',
        title: 'JUnit 5 — Unit Testing',
        subtitle: 'Annotations, lifecycle, assertions, parameterized tests, and assumptions.',
        sections: [junit5Basics, junit5Advanced],
      },
      {
        step: 28, id: 'mockito',
        title: 'Mockito — Mocking & Stubs',
        subtitle: 'Mocks vs spies, stubbing, verify, ArgumentCaptor, and dependency isolation.',
        sections: [mockito],
      },
      {
        step: 29, id: 'test-patterns',
        title: 'Test Patterns & TDD',
        subtitle: 'AAA pattern, FIRST principles, TDD red-green-refactor, testing pyramid.',
        sections: [testPatterns],
      },
    ],
  },
  {
    number: 7,
    label: 'Build Tools & Databases',
    color: 'yellow',
    description: 'Maven, JDBC, JPA, and Hibernate — the standard Java data stack.',
    steps: [
      {
        step: 30, id: 'maven',
        title: 'Maven',
        subtitle: 'pom.xml, GAV coordinates, dependency scopes, build lifecycle, clean package.',
        sections: [maven],
      },
      {
        step: 31, id: 'jdbc',
        title: 'JDBC',
        subtitle: 'PreparedStatement, ResultSet, transactions, connection pooling with HikariCP.',
        sections: [jdbc],
      },
      {
        step: 32, id: 'hibernate-jpa',
        title: 'JPA & Hibernate',
        subtitle: '@Entity, @OneToMany, fetch types, N+1 problem, Spring Data JPA repositories.',
        sections: [hibernate],
      },
    ],
  },
  {
    number: 8,
    label: 'Spring & Spring Boot',
    color: 'green',
    description: 'IoC, dependency injection, auto-configuration, and REST APIs with Spring.',
    steps: [
      {
        step: 33, id: 'spring-core',
        title: 'Spring Core — IoC & DI',
        subtitle: '@Component, @Service, @Repository, constructor injection, @Bean, @Qualifier.',
        sections: [springCore],
      },
      {
        step: 34, id: 'spring-boot',
        title: 'Spring Boot',
        subtitle: 'Auto-configuration, starters, application.properties, profiles, Actuator.',
        sections: [springBoot],
      },
      {
        step: 35, id: 'spring-rest',
        title: 'REST API with Spring MVC',
        subtitle: '@RestController, ResponseEntity, @Valid, @ExceptionHandler, @ControllerAdvice.',
        sections: [restApi],
      },
    ],
  },
  {
    number: 9,
    label: 'Microservices',
    color: 'indigo',
    description: 'Service decomposition, Spring Cloud, messaging, and resilience patterns.',
    steps: [
      {
        step: 36, id: 'microservices',
        title: 'Microservices Architecture',
        subtitle: 'Service discovery, API gateway, circuit breaker, Saga pattern, event-driven.',
        sections: [microConcepts],
      },
      {
        step: 37, id: 'spring-cloud-kafka',
        title: 'Spring Cloud & Messaging',
        subtitle: 'Eureka, Gateway, Kafka vs RabbitMQ, @KafkaListener, @RabbitListener.',
        sections: [springCloud],
      },
    ],
  },
  {
    number: 10,
    label: 'Version Control',
    color: 'orange',
    description: 'Git from first commit to team collaboration — branching, merging, remotes, and advanced workflows.',
    steps: [
      {
        step: 38, id: 'git',
        title: 'Git Version Control',
        subtitle: 'init, add, commit, branching strategies, remotes, stash, reset, revert, and .gitignore.',
        sections: [gitBasics, gitBranching, gitRemote, gitAdvanced],
      },
    ],
  },
  {
    number: 11,
    label: 'SQL & Databases',
    color: 'yellow',
    description: 'SQL from SELECT to transactions — the query language every Java backend developer must know.',
    steps: [
      {
        step: 39, id: 'sql-fundamentals',
        title: 'SQL Fundamentals',
        subtitle: 'DDL, DML, SELECT, WHERE, ORDER BY, LIMIT, and all JOIN types.',
        sections: [sqlBasics, sqlJoins],
      },
      {
        step: 40, id: 'sql-advanced',
        title: 'SQL — Aggregation & Optimization',
        subtitle: 'GROUP BY, HAVING, subqueries, indexes, transactions (ACID), and views.',
        sections: [sqlAggregates, sqlAdvanced],
      },
    ],
  },
  {
    number: 12,
    label: 'Legacy Web',
    color: 'stone',
    description: 'Java EE web tier — Servlets and JSP. Foundation that Spring MVC is built on.',
    steps: [
      {
        step: 41, id: 'servlet-jsp',
        title: 'Servlet & JSP',
        subtitle: 'HttpServlet lifecycle, doGet/doPost, sessions, JSP with EL and JSTL, MVC pattern.',
        sections: [servletBasics, jspBasics],
      },
    ],
  },
  {
    number: 13,
    label: 'Spring Security',
    color: 'red',
    description: 'Authentication and authorization — BCrypt, JWT, OAuth2, and securing REST APIs.',
    steps: [
      {
        step: 42, id: 'spring-security',
        title: 'Spring Security Basics',
        subtitle: 'SecurityFilterChain, UserDetailsService, BCrypt password hashing, roles and authorities.',
        sections: [securityBasics],
      },
      {
        step: 43, id: 'jwt',
        title: 'JWT Authentication',
        subtitle: 'Token structure, signing keys, JwtFilter, stateless REST API security.',
        sections: [jwtAuth],
      },
      {
        step: 44, id: 'oauth2',
        title: 'OAuth2 & Social Login',
        subtitle: 'Authorization Code flow, Google/GitHub login, OpenID Connect, resource server.',
        sections: [oauth2],
      },
    ],
  },
  {
    number: 14,
    label: 'DevOps & Cloud',
    color: 'sky',
    description: 'Logging, containerization with Docker, and deploying Java applications to AWS.',
    steps: [
      {
        step: 45, id: 'logging',
        title: 'Logging',
        subtitle: 'SLF4J, Logback, Log4j2 — log levels, appenders, parameterized logging, production config.',
        sections: [logging],
      },
      {
        step: 46, id: 'docker',
        title: 'Docker',
        subtitle: 'Dockerfile, multi-stage builds, images, containers, Docker Compose for local dev.',
        sections: [dockerBasics, dockerCompose],
      },
      {
        step: 47, id: 'aws',
        title: 'AWS for Java Developers',
        subtitle: 'S3, RDS, IAM, VPC, EC2, Elastic Beanstalk, ECS/Fargate — deploy a Spring Boot app.',
        sections: [awsCore, awsDeploy],
      },
    ],
  },
  {
    number: 15,
    label: 'Spring AI',
    color: 'violet',
    description: 'Integrate Large Language Models into Spring Boot — chat, RAG pipelines, and tool calling.',
    steps: [
      {
        step: 48, id: 'spring-ai-basics',
        title: 'Spring AI — Chat & Prompts',
        subtitle: 'ChatClient, PromptTemplate, structured output, streaming responses.',
        sections: [springAiBasics],
      },
      {
        step: 49, id: 'spring-ai-advanced',
        title: 'Spring AI — RAG & Tools',
        subtitle: 'Vector stores, embeddings, retrieval-augmented generation, function/tool calling.',
        sections: [springAiAdvanced],
      },
    ],
  },
]

export const ALL_STEPS = STAGES.flatMap(stage =>
  stage.steps.map(step => ({
    ...step,
    stageNumber: stage.number,
    stageLabel: stage.label,
    stageColor: stage.color,
  }))
)

export function getStep(n) {
  return ALL_STEPS.find(s => s.step === n) || null
}
