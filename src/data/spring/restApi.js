export default {
  id: 'spring-rest',
  title: '1. Spring MVC & REST API',
  explanation: `Spring MVC maps HTTP requests to Java methods. **@RestController** = @Controller + @ResponseBody — every method returns JSON automatically (via Jackson).

**HTTP Method → CRUD mapping:**
- GET → Read (safe, idempotent)
- POST → Create (neither)
- PUT → Replace entirely (idempotent)
- PATCH → Partial update
- DELETE → Remove (idempotent)`,
  table: {
    headers: ['Annotation', 'Binds to'],
    rows: [
      ['@GetMapping("/users/{id}")', 'GET /users/123'],
      ['@PostMapping("/users")', 'POST /users'],
      ['@PutMapping("/users/{id}")', 'PUT /users/123'],
      ['@DeleteMapping("/users/{id}")', 'DELETE /users/123'],
      ['@PathVariable Long id', 'URL path segment /users/{id}'],
      ['@RequestParam(defaultValue="0") int page', 'Query param ?page=2'],
      ['@RequestBody UserDto dto', 'JSON request body'],
      ['@RequestHeader("Authorization")', 'HTTP header value'],
    ],
  },
  code: `import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.*;
import jakarta.validation.constraints.*;
import java.util.List;

// ── DTOs — never expose entities directly ─────────────────────────────────
record UserDto(Long id, String name, String email) {}
record CreateUserRequest(
    @NotBlank(message = "Name is required") String name,
    @Email(message = "Must be a valid email") @NotBlank String email,
    @Min(0) @Max(150) int age
) {}

// ── REST Controller ───────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/users")    // base path for all methods
public class UserController {
    private final UserService service;

    public UserController(UserService service) { this.service = service; }

    // GET /api/v1/users?page=0&size=20
    @GetMapping
    public ResponseEntity<List<UserDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(service.getAll(page, size));
    }

    // GET /api/v1/users/42
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());   // 404
    }

    // POST /api/v1/users   body: {"name":"Alice","email":"a@b.com","age":25}
    @PostMapping
    public ResponseEntity<UserDto> create(
            @RequestBody @Valid CreateUserRequest req) {  // @Valid triggers Bean Validation
        UserDto created = service.create(req);
        var location = org.springframework.web.servlet.support.ServletUriComponentsBuilder
            .fromCurrentRequest().path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);  // 201 Created
    }

    // PUT /api/v1/users/42
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(
            @PathVariable Long id,
            @RequestBody @Valid CreateUserRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    // DELETE /api/v1/users/42
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();  // 204 No Content
    }
}

// ── Global exception handling ──────────────────────────────────────────────
@RestControllerAdvice   // handles exceptions across all controllers
class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    // Handles @Valid failures
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(java.util.stream.Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ErrorResponse("VALIDATION_ERROR", msg));
    }

    @ExceptionHandler(Exception.class)  // catch-all
    public ResponseEntity<ErrorResponse> handleAll(Exception ex) {
        return ResponseEntity.internalServerError()
            .body(new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
    }
}

record ErrorResponse(String code, String message) {}
class UserNotFoundException extends RuntimeException {
    UserNotFoundException(String msg) { super(msg); }
}
interface UserService {
    List<UserDto> getAll(int page, int size);
    java.util.Optional<UserDto> findById(Long id);
    UserDto create(CreateUserRequest req);
    UserDto update(Long id, CreateUserRequest req);
    void delete(Long id);
}`,
  points: [
    'Always return ResponseEntity<T> — it gives full control over status code, headers, and body. Don\'t just return T directly.',
    'Never expose JPA entities from REST endpoints — they may cause lazy-loading exceptions (Jackson serializes them), expose internal fields, and couple your API to your DB schema. Use DTOs.',
    '@Valid on @RequestBody triggers Bean Validation (javax.validation constraints). Pair with @RestControllerAdvice to return 400 with useful messages.',
    'Return 201 Created with a Location header for POST requests that create a resource — this is correct REST semantics.',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between @Controller and @RestController?\nA: @Controller returns view names (templates in MVC pattern). @RestController = @Controller + @ResponseBody — every method\'s return value is serialized to JSON and written directly to the HTTP response body. Use @RestController for APIs, @Controller for server-rendered HTML.',
    },
    {
      type: 'gotcha',
      content: '@PathVariable name must match the URI template variable exactly: @GetMapping("/{userId}") must use @PathVariable Long userId — not id. If the names differ, specify it: @PathVariable("userId") Long id.',
    },
  ],
}
