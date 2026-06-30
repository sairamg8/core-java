export default {
  id: 'mockito',
  title: '1. Mockito — Mocking & Stubbing',
  explanation: `**Mockito** is the most popular Java mocking framework. It creates fake (mock) implementations of dependencies so you can test a class in isolation — without a real database, HTTP client, or email sender.

**Key concepts:**
- **Mock** — a fake object. All methods return defaults (0, null, empty) unless stubbed.
- **Stub** — tell a mock what to return for a specific call (\`when(...).thenReturn(...)\`).
- **Verify** — assert that a method was called, how many times, and with what arguments.
- **Spy** — wrap a real object; real methods run unless stubbed.`,
  code: `// Maven: mockito-core + mockito-junit-jupiter (for @ExtendWith)
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)   // enables @Mock, @InjectMocks etc.
class OrderServiceTest {

    @Mock
    PaymentGateway paymentGateway;    // Mockito creates a fake implementation

    @Mock
    EmailService emailService;

    @InjectMocks
    OrderService orderService;        // real class — mocks injected via constructor/setter

    // ── Stubbing — define what a mock returns ────────────────────────────
    @Test
    void successfulOrder() {
        // ARRANGE — stub the dependency
        when(paymentGateway.charge("card-123", 99.99))
            .thenReturn(new PaymentResult(true, "txn-456"));

        // ACT
        Order order = orderService.placeOrder("card-123", 99.99);

        // ASSERT
        assertTrue(order.isSuccessful());
        assertEquals("txn-456", order.getTransactionId());
    }

    @Test
    void paymentFailureThrowsException() {
        when(paymentGateway.charge(anyString(), anyDouble()))
            .thenThrow(new PaymentException("Card declined"));

        assertThrows(PaymentException.class,
            () -> orderService.placeOrder("card-bad", 50.0));
    }

    // Multiple stubs — different return per call
    @Test
    void retryLogic() {
        when(paymentGateway.charge(anyString(), anyDouble()))
            .thenReturn(new PaymentResult(false, null))   // 1st call fails
            .thenReturn(new PaymentResult(true, "txn-ok")); // 2nd call succeeds

        Order order = orderService.placeOrderWithRetry("card-123", 10.0);
        assertTrue(order.isSuccessful());
    }

    // ── Argument Matchers ────────────────────────────────────────────────
    @Test
    void matchersExample() {
        when(paymentGateway.charge(eq("card-vip"), anyDouble()))
            .thenReturn(new PaymentResult(true, "vip-txn"));
        // eq() — exact match
        // anyString(), anyInt(), anyDouble(), any(MyClass.class) — any value
        // startsWith(), endsWith(), contains() — String matchers
        // argThat(pred) — custom predicate matcher
    }

    // ── Verify — assert interactions ─────────────────────────────────────
    @Test
    void emailSentAfterSuccessfulOrder() {
        when(paymentGateway.charge(anyString(), anyDouble()))
            .thenReturn(new PaymentResult(true, "txn-789"));

        orderService.placeOrder("card-123", 99.99);

        // verify it was called exactly once with these args
        verify(emailService).sendConfirmation("order@example.com", "txn-789");
        verify(paymentGateway, times(1)).charge("card-123", 99.99);
        verify(emailService, never()).sendFailureNotice(anyString());
    }

    @Test
    void verifyNoMoreInteractionsAfterOrder() {
        when(paymentGateway.charge(anyString(), anyDouble()))
            .thenReturn(new PaymentResult(true, "t1"));

        orderService.placeOrder("card-123", 10.0);

        verifyNoMoreInteractions(emailService); // nothing else called on emailService
    }

    // ── ArgumentCaptor — capture what was passed ─────────────────────────
    @Test
    void captureEmailContent() {
        when(paymentGateway.charge(anyString(), anyDouble()))
            .thenReturn(new PaymentResult(true, "txn-cap"));

        orderService.placeOrder("card-123", 75.00);

        ArgumentCaptor<String> emailCaptor  = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> txCaptor     = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendConfirmation(emailCaptor.capture(), txCaptor.capture());

        assertEquals("txn-cap", txCaptor.getValue());
        assertTrue(emailCaptor.getValue().contains("@"));
    }

    // ── Spy — wrap a real object ─────────────────────────────────────────
    @Test
    void spyExample() {
        List<String> realList = new java.util.ArrayList<>();
        List<String> spyList  = spy(realList);

        spyList.add("a");       // real method called
        spyList.add("b");

        // Stub one method
        doReturn(100).when(spyList).size();  // use doReturn for spies, not when()
        assertEquals(100, spyList.size());  // stubbed
        assertEquals("a", spyList.get(0)); // real

        verify(spyList, times(2)).add(anyString());
    }

    // Stub classes
    interface PaymentGateway {
        PaymentResult charge(String cardId, double amount);
    }
    interface EmailService {
        void sendConfirmation(String email, String txnId);
        void sendFailureNotice(String email);
    }
    record PaymentResult(boolean success, String transactionId) {}
    static class PaymentException extends RuntimeException {
        PaymentException(String msg) { super(msg); }
    }
    record Order(boolean isSuccessful, String transactionId) {
        boolean isSuccessful() { return isSuccessful; }
        String getTransactionId() { return transactionId; }
    }
    static class OrderService {
        private final PaymentGateway pg; private final EmailService es;
        OrderService(PaymentGateway pg, EmailService es) { this.pg = pg; this.es = es; }
        Order placeOrder(String card, double amt) {
            var r = pg.charge(card, amt);
            if (r.success()) es.sendConfirmation("order@example.com", r.transactionId());
            return new Order(r.success(), r.transactionId());
        }
        Order placeOrderWithRetry(String card, double amt) {
            var r = pg.charge(card, amt);
            if (!r.success()) r = pg.charge(card, amt);
            return new Order(r.success(), r.transactionId());
        }
    }
    interface List<T> extends java.util.List<T> {}
    static <T> java.util.List<T> spy(java.util.List<T> l) { return org.mockito.Mockito.spy(l); }
}`,
  points: [
    '@InjectMocks uses constructor injection first, then setter injection, then field injection — prefer constructor injection in production code for testability',
    'Use doReturn().when(spy).method() for spies — not when().thenReturn(). when() calls the real method during stubbing, which can cause errors.',
    'Never stub methods that are not called in the test — this is called "over-specification" and makes tests fragile',
    'ArgumentCaptor is useful when you need to assert on complex objects passed to a void method (e.g. verify an email body was formatted correctly)',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between a Mock and a Spy in Mockito?\nA: A Mock is a completely fake object — all methods return defaults (0, null, empty list) unless stubbed. A Spy wraps a real object — unstubbed methods call the real implementation. Use mocks for dependencies you want full control over; use spies when you want real behavior but need to override one or two methods.',
    },
    {
      type: 'gotcha',
      content: 'Mockito cannot mock: final classes (by default), static methods, private methods, or constructors. For static methods, use MockedStatic via mockStatic(). For final classes, enable the mockito-extensions/mockito.mock-maker-inline setting.',
    },
  ],
}
