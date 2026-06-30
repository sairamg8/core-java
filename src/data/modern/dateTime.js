export default {
  id: 'date-time-api',
  title: '2. Date & Time API (Java 8+)',
  explanation: `Java 8 replaced the broken \`Date\` and \`Calendar\` classes with a complete, immutable date/time API in \`java.time\`.

**Key classes:**
- \`LocalDate\` — date only (2024-01-15), no time, no timezone
- \`LocalTime\` — time only (14:30:00), no date, no timezone
- \`LocalDateTime\` — date + time, no timezone
- \`ZonedDateTime\` — date + time + timezone (use for scheduling across zones)
- \`Instant\` — machine timestamp (epoch millis, UTC)
- \`Duration\` — amount of time in seconds/nanos (hours, minutes, seconds)
- \`Period\` — amount of time in years/months/days`,
  code: `import java.time.*;
import java.time.format.*;
import java.time.temporal.*;

// ─── LocalDate ────────────────────────────────────────────────────────────
LocalDate today = LocalDate.now();
LocalDate birthday = LocalDate.of(1995, Month.JUNE, 15);
LocalDate parsed  = LocalDate.parse("2024-01-15");  // ISO format default

System.out.println(today.getYear());        // 2024
System.out.println(today.getMonth());       // JUNE
System.out.println(today.getDayOfWeek());   // MONDAY
System.out.println(today.isLeapYear());     // false/true

LocalDate nextWeek  = today.plusDays(7);
LocalDate lastMonth = today.minusMonths(1);
LocalDate firstDay  = today.withDayOfMonth(1);  // first of current month

boolean isBefore = birthday.isBefore(today);  // true
Period age = Period.between(birthday, today);
System.out.println(age.getYears() + " years old");

// ─── LocalTime ───────────────────────────────────────────────────────────
LocalTime now  = LocalTime.now();
LocalTime noon = LocalTime.of(12, 0, 0);
LocalTime t    = LocalTime.parse("14:30:00");

now.getHour(); now.getMinute(); now.getSecond();
LocalTime later = now.plusHours(2).plusMinutes(30);

// ─── LocalDateTime ───────────────────────────────────────────────────────
LocalDateTime ldt = LocalDateTime.now();
LocalDateTime meeting = LocalDateTime.of(2024, 3, 15, 10, 30);
LocalDateTime fromParts = LocalDateTime.of(birthday, noon);

Duration diff = Duration.between(LocalDateTime.now(), meeting);
diff.toHours(); diff.toMinutes();

// ─── ZonedDateTime ───────────────────────────────────────────────────────
ZoneId nyZone  = ZoneId.of("America/New_York");
ZoneId lonZone = ZoneId.of("Europe/London");

ZonedDateTime nyTime  = ZonedDateTime.now(nyZone);
ZonedDateTime lonTime = nyTime.withZoneSameInstant(lonZone); // convert tz

// ─── Instant — machine time ───────────────────────────────────────────────
Instant start = Instant.now();
// ... do work ...
Instant end   = Instant.now();
Duration elapsed = Duration.between(start, end);
System.out.println(elapsed.toMillis() + " ms");

long epochMs = Instant.now().toEpochMilli();
Instant fromMs = Instant.ofEpochMilli(epochMs);

// ─── Formatting & Parsing ─────────────────────────────────────────────────
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
String formatted = meeting.format(fmt);              // "15/03/2024 10:30"
LocalDateTime parsed2 = LocalDateTime.parse("15/03/2024 10:30", fmt);

DateTimeFormatter isoFmt = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
LocalDateTime parsed3 = LocalDateTime.parse("2024-03-15T10:30:00", isoFmt);

// ─── Period vs Duration ───────────────────────────────────────────────────
Period period   = Period.of(1, 6, 10);      // 1 year, 6 months, 10 days
Duration duration = Duration.ofHours(36).plusMinutes(30);

// Period: between two dates (calendar-aware — months have different lengths)
// Duration: between two times (exact — always seconds/nanos)`,
  points: [
    'All java.time classes are IMMUTABLE — plus/minus/with methods return new instances',
    'Month.JUNE is 6 (1-based), unlike the old Calendar.JUNE which was 5 (0-based) — a classic source of off-by-one bugs',
    'Use ZonedDateTime for user-facing scheduling. Use Instant for machine timestamps in logs/databases',
    'DateTimeFormatter is thread-safe (unlike old SimpleDateFormat which is NOT)',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What was wrong with the old java.util.Date and Calendar?\nA: Date is mutable (thread-unsafe), months are 0-indexed (January=0), no timezone support, no date-only or time-only types, and SimpleDateFormat is not thread-safe. java.time fixes all of this with immutable, thread-safe, clearly named classes.',
    },
    {
      type: 'gotcha',
      content: 'LocalDateTime.now() uses the system clock and system timezone. In tests, inject a Clock: LocalDateTime.now(Clock.fixed(instant, zone)) for deterministic results. Never use new Date() in new code.',
    },
  ],
}
