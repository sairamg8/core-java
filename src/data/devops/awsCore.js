export default {
  id: 'aws-core',
  title: '1. AWS Core Services',
  explanation: `**AWS (Amazon Web Services)** is the leading cloud platform. Java/Spring Boot developers commonly use a specific subset of AWS services.

**Regions & Availability Zones:**
- A **Region** is a geographic location (us-east-1, eu-west-1, ap-south-1)
- Each region has multiple **Availability Zones** (AZs) — physically separate data centers
- Deploy across multiple AZs for high availability

**The services you will touch most as a Java developer:**

| Service | Category | What it does |
|---|---|---|
| **EC2** | Compute | Virtual machines (instances) — you manage the OS |
| **S3** | Storage | Object storage — files, images, JARs, backups |
| **RDS** | Database | Managed relational DB (MySQL, PostgreSQL) |
| **IAM** | Security | Users, roles, permissions for AWS resources |
| **VPC** | Networking | Your private virtual network in AWS |
| **CloudWatch** | Monitoring | Logs, metrics, alarms |`,
  code: `// AWS SDK v2 for Java — add to pom.xml:
// software.amazon.awssdk:s3, software.amazon.awssdk:rds, etc.

import software.amazon.awssdk.regions.*;
import software.amazon.awssdk.services.s3.*;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.core.sync.*;
import java.nio.file.*;

// === S3 — Object Storage ===
S3Client s3 = S3Client.builder()
    .region(Region.US_EAST_1)
    .build();   // uses DefaultCredentialsProvider (env vars, ~/.aws/credentials, EC2 role)

// Upload a file
s3.putObject(PutObjectRequest.builder()
    .bucket("my-bucket")
    .key("uploads/profile/alice.jpg")
    .contentType("image/jpeg")
    .build(),
    RequestBody.fromFile(Path.of("/tmp/alice.jpg")));

// Download a file
ResponseBytes<GetObjectResponse> bytes = s3.getObjectAsBytes(
    GetObjectRequest.builder().bucket("my-bucket").key("uploads/profile/alice.jpg").build()
);
Files.write(Path.of("/tmp/downloaded.jpg"), bytes.asByteArray());

// Generate a pre-signed URL (time-limited, publicly accessible)
S3Presigner presigner = S3Presigner.builder().region(Region.US_EAST_1).build();
PresignedGetObjectRequest presigned = presigner.presignGetObject(b -> b
    .signatureDuration(Duration.ofMinutes(60))
    .getObjectRequest(r -> r.bucket("my-bucket").key("uploads/profile/alice.jpg")));
String url = presigned.url().toString();   // share with user for direct download

// List objects in a bucket
ListObjectsV2Response resp = s3.listObjectsV2(
    ListObjectsV2Request.builder().bucket("my-bucket").prefix("uploads/").build());
resp.contents().forEach(obj -> System.out.println(obj.key() + " (" + obj.size() + " bytes)"));

// Delete an object
s3.deleteObject(DeleteObjectRequest.builder()
    .bucket("my-bucket").key("uploads/profile/old.jpg").build());

// === IAM — credentials best practices ===
// NEVER hardcode AWS credentials in code or properties files
// Use IAM Roles:
// - On EC2: attach an IAM role with the necessary permissions to the instance
// - In Spring Boot (local dev): use ~/.aws/credentials or environment variables:
//   AWS_ACCESS_KEY_ID=...
//   AWS_SECRET_ACCESS_KEY=...`,
  points: [
    'Never hardcode AWS credentials in code or commit them to git — use IAM roles (on EC2/ECS) or environment variables',
    'IAM follows least-privilege principle: grant only the specific permissions needed (e.g., s3:PutObject on a specific bucket only)',
    'RDS handles backups, patching, and failover automatically — prefer it over self-managing a MySQL/PostgreSQL on EC2',
    'S3 is not a filesystem — there are no real directories. Keys like "uploads/alice.jpg" are just object names with "/" in them',
    'Pre-signed URLs let you grant temporary, public access to private S3 objects without making the bucket public',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between S3 and EBS?\nA: S3 (Simple Storage Service) is object storage — you access files via HTTP/API from anywhere. It is highly durable, virtually unlimited, and billed per GB stored. EBS (Elastic Block Storage) is a virtual hard disk attached to a single EC2 instance — accessed as a block device, not via HTTP. Use S3 for application assets (images, files, backups); use EBS for the OS disk and database files.',
    },
    {
      type: 'gotcha',
      content: 'S3 bucket names are globally unique across ALL AWS accounts — "my-bucket" is first-come-first-served. Use company name or project prefix to namespace your buckets (e.g., "mycompany-myproject-uploads-prod").',
    },
  ],
}
