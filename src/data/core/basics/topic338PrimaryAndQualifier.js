export default {
  id: 'primary-and-qualifier',
  title: '338. @Primary and @Qualifier',
  explanation: `When **two or more beans** match an autowired type, Spring cannot decide which to inject and throws \`NoUniqueBeanDefinitionException\`. **\`@Primary\`** and **\`@Qualifier\`** are the two ways to break that tie.

**The ambiguity:**
\`\`\`java
public interface PaymentGateway { }
@Component class RazorpayGateway implements PaymentGateway { }
@Component class StripeGateway   implements PaymentGateway { }

@Autowired PaymentGateway gateway;   // TWO candidates -> error
\`\`\`

**\`@Primary\` — a default winner.** Mark one bean \`@Primary\`; it is chosen whenever the type is ambiguous and no qualifier is given.
\`\`\`java
@Component @Primary
class RazorpayGateway implements PaymentGateway { }   // wins by default
\`\`\`

**\`@Qualifier\` — pick a specific bean by name.** At the injection point, name exactly which bean you want.
\`\`\`java
@Autowired @Qualifier("stripeGateway")
private PaymentGateway gateway;   // forces Stripe
\`\`\`

**How they differ and combine:**
- \`@Primary\` lives on the **bean definition** and provides a **global default**.
- \`@Qualifier\` lives on the **injection point** and makes a **per-injection choice**.
- If both are present, **\`@Qualifier\` wins** — an explicit choice overrides the default.

**When to use which:** use \`@Primary\` when one implementation is the normal choice almost everywhere and the alternatives are rare; use \`@Qualifier\` when different injection points genuinely need different implementations. See [[primary-annotation]] and [[qualifier-annotation]] for each in isolation, and [[annotation-autowiring]] for the underlying resolution.`,
  code: `public interface PaymentGateway { void pay(int amount); }

@Component
@Primary                                   // default when ambiguous
public class RazorpayGateway implements PaymentGateway {
    public void pay(int amount) { }
}

@Component
public class StripeGateway implements PaymentGateway {
    public void pay(int amount) { }
}

@Component
public class CheckoutService {
    private final PaymentGateway defaultGw;
    private final PaymentGateway stripeGw;

    public CheckoutService(
            PaymentGateway defaultGw,                       // -> Razorpay (@Primary)
            @Qualifier("stripeGateway") PaymentGateway stripeGw) {  // -> Stripe
        this.defaultGw = defaultGw;
        this.stripeGw = stripeGw;
    }
}`,
  codeTitle: '@Primary default vs @Qualifier explicit pick',
  points: [
    'Two beans of the same type cause NoUniqueBeanDefinitionException when autowired',
    '@Primary marks one bean as the default choice when the type is ambiguous',
    '@Qualifier("beanName") at the injection point selects a specific bean by name',
    '@Primary is a global default on the bean; @Qualifier is a per-injection-point override',
    'When both apply, @Qualifier wins because the explicit choice beats the default',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How do @Primary and @Qualifier resolve autowiring ambiguity, and which takes precedence?\nA: When several beans match a type, @Primary designates one bean as the default that Spring injects unless told otherwise, while @Qualifier("name") is placed at the injection point to demand a specific bean. @Primary sits on the bean definition and is global; @Qualifier sits on the injection point and is local. If both are present the @Qualifier wins because an explicit request overrides the default.',
    },
    {
      type: 'tip',
      content: 'Reach for @Primary when one implementation is the normal choice across the app and alternatives are exceptions; reach for @Qualifier when different injection points deliberately need different implementations. Combining them gives a sensible default plus targeted overrides.',
    },
  ],
}
