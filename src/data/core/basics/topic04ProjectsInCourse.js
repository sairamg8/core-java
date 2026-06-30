export default {
  id: 'projects-in-course',
  title: '4. Projects in the Course',
  explanation: `This course is **project-driven**. You will build real, functional applications — not toy snippets. Here is a preview of what you will build and what each project teaches.

**Project 1 — Quiz App (Console)**
Pure Java, no frameworks. A console quiz game with hardcoded questions, scoring, and results.
Teaches: class design, method decomposition, arrays, control flow, basic OOP.

**Project 2 — Student Management (JDBC + MySQL)**
A CRUD app that stores student records in a real MySQL database via Java's JDBC API.
Teaches: SQL from Java, PreparedStatement (SQL injection prevention), connection management.

**Project 3 — Job Application Web App (Spring Boot + JPA)**
A full web app where users post and browse job listings. Full MVC with a database backend.
Teaches: Spring MVC, Thymeleaf templates, Spring Data JPA entities, form handling.

**Project 4 — E-Commerce API (Spring Boot + React + Security)**
A product catalog REST API with authentication, image upload, JWT tokens, and a React frontend.
Teaches: Stateless auth, file storage, CORS, REST design, frontend-backend integration.

**Project 5 — Microservices Quiz App (Spring Cloud)**
The Quiz App reimagined as independent microservices communicating over REST with Eureka and Feign.
Teaches: Service discovery, inter-service REST calls, API Gateway, load balancing.

**Why building projects beats watching tutorials:**
Tutorials show you a working solution. Projects make you encounter errors, debug them, and derive understanding through struggle. The act of making something not work — and then making it work — creates durable knowledge.`,
  points: [
    'Projects in this course intentionally start simple and grow in complexity as you learn new concepts — mirroring how real features are built incrementally.',
    'Every project is a portfolio piece. Host them on GitHub with a clear README explaining what the app does and how to run it locally.',
    'The most common junior developer interview question: "Walk me through a project you built." Be ready with a 60-second pitch covering: what it does, the tech stack, the biggest challenge, and what you would improve.',
    'Extend each project after finishing it. Add one feature the instructor did not include — this is the bridge between following a tutorial and building independently.',
  ],
  callouts: [
    {
      type: 'analogy',
      content: 'Watching a cooking show does not teach you to cook. You learn to cook by burning things. Code is the same — following along builds familiarity; building from a blank file builds competence.',
    },
    {
      type: 'tip',
      content: 'After Project 1 (Quiz App), add a high-score leaderboard. After Project 3 (Job App), add a search filter. After Project 4 (E-Commerce), add a shopping cart. These small extensions are what separate candidates in interviews.',
    },
  ],
}
