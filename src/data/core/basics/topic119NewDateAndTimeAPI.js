export default {
  id: 'new-date-and-time-api',
  title: '119. New Date and Time API in Java',
  explanation: `The java.time package (introduced in Java 8) provides a comprehensive, immutable, thread-safe date and time API. Here is a deeper look at its core classes and operations.

**LocalDate** — date only, no time, no timezone
- Creating: LocalDate.now(), LocalDate.of(2024, Month.MARCH, 15), LocalDate.parse("2024-03-15")
- Querying: getYear(), getMonth(), getDayOfMonth(), getDayOfWeek(), isLeapYear()
- Arithmetic: plusDays(), minusMonths(), plusYears()
- Comparison: isBefore(), isAfter(), isEqual()

**LocalTime** — time only, no date, no timezone
- Creating: LocalTime.now(), LocalTime.of(14, 30, 0), LocalTime.parse("14:30:00")
- Querying: getHour(), getMinute(), getSecond(), getNano()

**LocalDateTime** — date + time, no timezone. Use for storing timestamps in a local context.

**ZonedDateTime** — date + time + timezone. Use for events that need timezone awareness (meetings, appointments).

**DateTimeFormatter** — immutable, thread-safe formatting (unlike SimpleDateFormat).

**Period vs Duration:**
- Period represents date-based amount: years, months, days (between LocalDates)
- Duration represents time-based amount: hours, minutes, seconds, nanoseconds (between LocalTimes or Instants)

**ChronoUnit** — enum for measuring between two temporal objects: ChronoUnit.DAYS.between(date1, date2)`,
  code: `import java.time.*;
import java.time.format.*;
import java.time.temporal.*;

public class NewDateTimeAPIDemo {
    public static void main(String[] args) {
        // LocalDate
        LocalDate date = LocalDate.of(2024, Month.MARCH, 15);
        System.out.println("Date: " + date);
        System.out.println("Year: " + date.getYear());
        System.out.println("Month: " + date.getMonth());       // MARCH
        System.out.println("Day: " + date.getDayOfMonth());    // 15
        System.out.println("Day of week: " + date.getDayOfWeek()); // FRIDAY
        System.out.println("Leap year: " + date.isLeapYear()); // true (2024)

        LocalDate future = date.plusDays(10).plusMonths(2);
        System.out.println("Future: " + future);
        System.out.println("Is before future: " + date.isBefore(future));

        // LocalTime
        LocalTime time = LocalTime.of(14, 30, 0);
        System.out.println("Time: " + time);
        LocalTime later = time.plusHours(3).plusMinutes(45);
        System.out.println("Later: " + later);

        // LocalDateTime
        LocalDateTime ldt = LocalDateTime.of(date, time);
        System.out.println("LocalDateTime: " + ldt);

        // ZonedDateTime
        ZonedDateTime zdt = ZonedDateTime.now(ZoneId.of("America/New_York"));
        System.out.println("NY time: " + zdt);
        ZonedDateTime ist = zdt.withZoneSameInstant(ZoneId.of("Asia/Kolkata"));
        System.out.println("IST time: " + ist);

        // DateTimeFormatter — thread-safe
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm");
        System.out.println("Formatted: " + ldt.format(fmt));
        LocalDateTime parsed = LocalDateTime.parse("15-Mar-2024 14:30", fmt);
        System.out.println("Parsed: " + parsed);

        // Period — date-based difference
        LocalDate dob = LocalDate.of(1990, 6, 15);
        LocalDate today = LocalDate.now();
        Period age = Period.between(dob, today);
        System.out.println("Age: " + age.getYears() + " years, " + age.getMonths() + " months");

        // Duration — time-based difference
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(17, 30);
        Duration shift = Duration.between(start, end);
        System.out.println("Shift: " + shift.toHours() + "h " + shift.toMinutesPart() + "m");

        // ChronoUnit
        long days = ChronoUnit.DAYS.between(dob, today);
        System.out.println("Days alive: " + days);
    }
}`,
  codeTitle: 'New java.time API Deep Dive',
  points: [
    'LocalDate (date only), LocalTime (time only), LocalDateTime (both), ZonedDateTime (with timezone) — pick the right type',
    'All java.time objects are immutable — arithmetic returns new instances',
    'Month enum is 1-based: Month.JANUARY is 1, no more 0-based confusion',
    'DateTimeFormatter is thread-safe — create one instance and share it, unlike SimpleDateFormat',
    'Period measures date-based differences (years/months/days); Duration measures time-based (hours/minutes/seconds)',
    'ZoneId.of("Asia/Kolkata") for Indian Standard Time, ZoneId.systemDefault() for the system timezone',
    'ChronoUnit.DAYS.between(date1, date2) gives the difference in exact days — simple and readable',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'LocalDate.parse() uses ISO format (yyyy-MM-dd) by default. Parsing "15/03/2024" without specifying a formatter throws DateTimeParseException. Always pass a DateTimeFormatter when using non-ISO formats.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between Period and Duration?\nA: Period is for date-based amounts (years, months, days) — used with LocalDate. Duration is for time-based amounts (hours, minutes, seconds, nanos) — used with LocalTime or Instant. You cannot use Duration.between() with LocalDate.',
    },
    {
      type: 'tip',
      content: 'Define DateTimeFormatter constants as static final fields. They are thread-safe, so sharing them across threads is perfectly fine and avoids repeated compilation of the pattern string.',
    },
  ],
}
