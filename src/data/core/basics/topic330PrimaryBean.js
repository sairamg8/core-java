export default {
  id: 'primary-bean',
  title: '330. Primary Bean',
  explanation: `When **two or more beans of the same type** exist, Spring cannot decide which one to autowire and throws \`NoUniqueBeanDefinitionException\`. Marking one bean as **primary** designates it the **default** choice, resolving the ambiguity.

**The problem:**
\`\`\`
@Service class StripeGateway implements PaymentGateway { }
@Service class PaypalGateway implements PaymentGateway { }

@Autowired PaymentGateway gateway;   // ERROR: two candidates, which one?
\`\`\`

**The fix with \`@Primary\`:** mark the preferred implementation. Now every \`@Autowired PaymentGateway\` gets the primary bean unless it explicitly asks for another.
\`\`\`
@Service @Primary
class StripeGateway implements PaymentGateway { }   // the default choice
\`\`\`

**In XML** it is the \`primary\` attribute:
\`\`\`
<bean id="stripe" class="com.example.StripeGateway" primary="true"/>
<bean id="paypal" class="com.example.PaypalGateway"/>
\`\`\`

**@Primary vs @Qualifier:**
- **\`@Primary\`** sets a **global default** at the bean definition — "when in doubt, use me."
- **\`@Qualifier("paypalGateway")\`** is set at the **injection point** — "here, specifically use this one."
- \`@Qualifier\` **overrides** \`@Primary\`: a specific request always wins over the default.

**When to use which:** use \`@Primary\` for the implementation you want almost everywhere, and \`@Qualifier\` at the few injection points that need the other one. Only **one** bean of a given type may be \`@Primary\`; marking two primary re-introduces the ambiguity.`,
  code: `// Two implementations of the same interface
public interface PaymentGateway { void charge(double amount); }

@Service
@Primary                                   // <-- the default when type is PaymentGateway
public class StripeGateway implements PaymentGateway {
    public void charge(double amount) { /* ... */ }
}

@Service
public class PaypalGateway implements PaymentGateway {
    public void charge(double amount) { /* ... */ }
}

// Gets the @Primary bean (StripeGateway) automatically
@Service
public class CheckoutService {
    private final PaymentGateway gateway;
    public CheckoutService(PaymentGateway gateway) { this.gateway = gateway; }
}

// Overrides @Primary at this specific injection point
@Service
public class RefundService {
    private final PaymentGateway gateway;
    public RefundService(@Qualifier("paypalGateway") PaymentGateway gateway) {
        this.gateway = gateway;            // PayPal here, despite Stripe being primary
    }
}`,
  codeTitle: '@Primary as default, @Qualifier to override',
  points: [
    'Multiple beans of one type cause NoUniqueBeanDefinitionException on autowiring',
    '@Primary marks one bean as the default choice, resolving the ambiguity',
    'In XML it is the primary="true" attribute on the <bean>',
    '@Qualifier at the injection point overrides @Primary for that specific dependency',
    'Only one bean of a given type may be @Primary; two primaries reintroduce ambiguity',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: How do @Primary and @Qualifier differ when resolving multiple beans of the same type?\nA: @Primary is declared on a bean definition and makes it the global default injected whenever the type is ambiguous. @Qualifier is declared at an injection point and names exactly which bean to inject there. @Qualifier takes precedence over @Primary, so use @Primary for the common default and @Qualifier for the specific exceptions.',
    },
    {
      type: 'gotcha',
      content: 'Marking two beans of the same type as @Primary does not help — it throws NoUniqueBeanDefinitionException again, because Spring still has more than one default candidate. There can be at most one primary bean per type; use @Qualifier for the others.',
    },
  ],
}
