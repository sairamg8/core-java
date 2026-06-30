export default {
  id: 'introduction-to-date-and-time',
  title: '118. Introduction to Date and Time in Java',
  explanation: `Java originally provided java.util.Date and java.util.Calendar for date/time handling. Both are considered problematic and are largely deprecated for new code.

**Problems with the old API:**
- Date is mutable — it can be changed after creation, causing bugs in multithreaded code.
- Month indexing starts at 0 in Calendar (January = 0, December = 11) — a constant source of bugs.
- Date represents both a date and a time (a timestamp), making it awkward when you only need one.
- No built-in time zone handling — formatting and parsing required a separate SimpleDateFormat, which is NOT thread-safe.
- The API is confusing: Date.getYear() returns years since 1900, Date.getMonth() is 0-based.

**Java 8 introduced java.time (JSR-310):**
A completely redesigned date/time API based on the popular Joda-Time library. It is:
- Immutable and thread-safe
- Clear and intuitive (month is 1-based using the Month enum)
- Separated into distinct types for different use cases

Key classes:
- LocalDate — date only (year, month, day), no time, no timezone
- LocalTime — time only (hour, minute, second, nanosecond)
- LocalDateTime — date + time, no timezone
- ZonedDateTime — date + time + timezone
- Instant — a point on the timeline (milliseconds since epoch)
- Duration — amount of time between two time-based values
- Period — amount of time between two date-based values`,
  code: `import java.util.*;
import java.text.*;
import java.time.*;

public class DateAndTimeIntroDemo {
    public static void main(String[] args) throws Exception {
        // OLD API — java.util.Date (avoid in new code)
        Date oldDate = new Date();
        System.out.println("Old Date: " + oldDate);

        // Calendar — verbose, 0-based months
        Calendar cal = Calendar.getInstance();
        cal.set(2024, Calendar.MARCH, 15);  // must use constant to avoid 0-based bug
        System.out.println("Calendar year: " + cal.get(Calendar.YEAR));
        System.out.println("Calendar month: " + (cal.get(Calendar.MONTH) + 1));  // +1 to fix 0-based

        // SimpleDateFormat — NOT thread-safe, shared instance causes bugs
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String formatted = sdf.format(oldDate);
        Date parsed = sdf.parse("25/12/2024");
        System.out.println("Formatted: " + formatted);
        System.out.println("Parsed: " + parsed);

        // NEW API — java.time (Java 8+)
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        LocalDateTime dateTime = LocalDateTime.now();
        Instant instant = Instant.now();

        System.out.println("LocalDate:     " + today);
        System.out.println("LocalTime:     " + now);
        System.out.println("LocalDateTime: " + dateTime);
        System.out.println("Instant:       " + instant);

        // All java.time objects are immutable
        LocalDate tomorrow = today.plusDays(1);  // returns NEW object, today unchanged
        LocalDate lastYear = today.minusYears(1);
        System.out.println("Tomorrow: " + tomorrow);
        System.out.println("Last year: " + lastYear);
    }
}`,
  codeTitle: 'Old vs New Date/Time API',
  points: [
    'java.util.Date and Calendar are mutable and error-prone — avoid them in new code',
    'Calendar months are 0-indexed (January = 0) — a constant source of off-by-one bugs',
    'SimpleDateFormat is not thread-safe — do not share instances between threads',
    'Java 8 introduced java.time with LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Instant',
    'All java.time classes are immutable — methods like plusDays() return a new object, never modifying the original',
    'LocalDate holds date only; LocalTime holds time only; LocalDateTime holds both, but no timezone',
    'ZonedDateTime adds timezone information; Instant is a machine timestamp (nanoseconds since Unix epoch)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'In the old Calendar API, January is month 0 and December is month 11. Always use Calendar.JANUARY, Calendar.DECEMBER constants to avoid this bug.',
    },
    {
      type: 'interview',
      content: 'Q: Why was the old java.util.Date/Calendar API replaced?\nA: It is mutable (thread-unsafe), has 0-based month indexing, conflates date and time in one class, and has an unintuitive API. Java 8 introduced java.time which is immutable, clear, and comprehensive.',
    },
    {
      type: 'tip',
      content: 'When working with legacy code that uses Date, convert: Date.toInstant() to get an Instant, then convert to LocalDate with Instant.atZone(ZoneId.systemDefault()).toLocalDate().',
    },
  ],
}
