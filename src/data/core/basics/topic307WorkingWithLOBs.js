export default {
  id: 'working-with-lobs-image-and-text-file',
  title: '307. Working with LOBs (Image and text file)',
  explanation: `Sometimes you need to store large data directly in the database — an image, a PDF, or a long block of text. These are called **LOBs (Large Objects)**. Hibernate supports them with the JPA \`@Lob\` annotation, mapping to two database types:

**Two kinds of LOB:**
- **BLOB (Binary Large Object)** — binary data: images, audio, PDFs, any \`byte[]\` or file bytes.
- **CLOB (Character Large Object)** — large text: articles, descriptions, JSON/XML documents stored as \`String\`.

**The @Lob annotation:**
Put \`@Lob\` on the field. Hibernate infers BLOB vs CLOB from the Java type:
- \`byte[]\` or \`java.sql.Blob\` → **BLOB**.
- \`String\` or \`char[]\` or \`java.sql.Clob\` → **CLOB**.

**Storing an image (BLOB):**
Read the file into a \`byte[]\`, set it on the \`@Lob\` field, and persist. Hibernate writes the bytes to a BLOB column.

**Storing large text (CLOB):**
Put the text in a \`@Lob String\` field; Hibernate maps it to a CLOB / TEXT column instead of a length-limited VARCHAR.

**Fetch considerations:**
LOBs can be huge, so loading them eagerly on every query is wasteful. Consider \`@Basic(fetch = FetchType.LAZY)\` alongside \`@Lob\` so the large data loads only when accessed (support varies by provider/type). Often it is cleaner to keep LOBs in a separate entity/table so normal queries do not drag the big data around.

**Reading it back:**
Retrieve the entity, get the \`byte[]\` or \`String\`, and write it to a file or stream it to the client.

**Design caution — should LOBs live in the database at all?**
Storing large files in the database bloats it, slows backups, and increases memory pressure. A common alternative is to store files on disk or object storage (e.g. S3) and keep only the **path/URL** in the database. Use database LOBs for moderate sizes or when transactional consistency with the file is essential; otherwise prefer external storage with a reference.`,
  code: `import jakarta.persistence.*;
import java.nio.file.*;

@Entity
public class Document {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    // BLOB: binary data such as an image or PDF
    @Lob
    @Basic(fetch = FetchType.LAZY)   // load the big bytes only when accessed
    private byte[] image;

    // CLOB: large text mapped to TEXT/CLOB instead of VARCHAR
    @Lob
    private String content;
    // getters / setters
}

// ---- Store an image file (BLOB) and large text (CLOB) ----
byte[] imageBytes = Files.readAllBytes(Path.of("photo.jpg"));
String longText   = Files.readString(Path.of("article.txt"));

Document doc = new Document();
doc.setTitle("Report");
doc.setImage(imageBytes);
doc.setContent(longText);
session.persist(doc);

// ---- Read it back and write the image to disk ----
Document loaded = session.get(Document.class, doc.getId());
Files.write(Path.of("out.jpg"), loaded.getImage());

/* Tip: for large files, storing a path/URL to object storage (e.g. S3)
   and keeping the file outside the database is often the better design. */`,
  codeTitle: 'Storing images (BLOB) and text (CLOB) with @Lob',
  points: [
    'LOBs are Large Objects: BLOB for binary data (images, PDFs) and CLOB for large text',
    'The @Lob annotation maps the field; Hibernate infers BLOB vs CLOB from the Java type (byte[] vs String)',
    'To store an image, read it into a byte[]; for large text, use a @Lob String mapped to TEXT/CLOB',
    'Consider @Basic(fetch = FetchType.LAZY) or a separate table so large data is not loaded on every query',
    'For big files, storing a path/URL to external storage (like S3) is often better than a database LOB',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Eagerly loading LOB columns on every query can wreck performance and memory: a query for a list of documents would pull every image into memory. Either mark the LOB lazy, or better, move large binary data to its own entity/table so normal queries touch only the lightweight metadata.',
    },
    {
      type: 'interview',
      content: 'Q: How do you store an image or a large text in a database with Hibernate?\nA: You annotate the field with @Lob. A byte[] field maps to a BLOB for binary data like images or PDFs, and a String field maps to a CLOB/TEXT for large text. You read the file into a byte[] (or String) and persist the entity. Because LOBs can be large, it is best to load them lazily or keep them in a separate table — and for very large files, storing them in external storage with only a reference in the database is often preferable.',
    },
  ],
}
