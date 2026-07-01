export default {
  id: 'basic-auth-using-postman',
  title: '452. Basic Auth Using Postman',
  explanation: `Form login (see [[default-login-form]]) is designed for browsers, and testing a secured REST API entirely through a browser form is impractical — this is exactly the gap **HTTP Basic Authentication** fills, and it's the natural way to authenticate requests from a tool like Postman while testing the Job app's endpoints.

**How Basic Auth actually works, at the protocol level:** the client sends an \`Authorization\` header formatted as \`Basic \` followed by the **Base64-encoded** string \`username:password\`. For username \`admin\` and password \`secret123\`, the header looks like:
\`\`\`
Authorization: Basic YWRtaW46c2VjcmV0MTIz
\`\`\`
where \`YWRtaW46c2VjcmV0MTIz\` is simply \`Base64("admin:secret123")\`.

**Using it in Postman:** the "Authorization" tab in a Postman request offers a "Basic Auth" type — entering the username and password there does the Base64 encoding automatically and adds the correct header before sending the request. No manual encoding is needed; Postman (and most HTTP clients) handle this transparently.

**Base64 is encoding, not encryption — this is the single most important thing to understand about Basic Auth.** Anyone who intercepts this header can decode it back to the plain username and password in one line of code; Base64 provides zero confidentiality. This is precisely why Basic Auth is only acceptable over HTTPS in any real deployment — TLS protects the header in transit, not Basic Auth itself. Sending Basic Auth credentials over plain HTTP means sending them in what is, functionally, plain text.

**Why Basic Auth is used here as a stepping stone, not the final answer.** It solves the "browser vs. API client" problem from the login form topic, but it still requires sending the actual password on *every single request* — there's no session, no expiring token, nothing to revoke if a client is compromised except changing the password itself (which breaks every other client using it too). This exact limitation — a long-lived, non-expiring, non-revocable credential sent on every call — is the specific problem JWT is introduced to solve later in this chapter (see [[why-jwt]]).`,
  code: `# Basic Auth header format:
# Authorization: Basic <Base64("username:password")>

# Manually constructing it for admin / secret123:
echo -n "admin:secret123" | base64
# YWRtaW46c2VjcmV0MTIz

curl -H "Authorization: Basic YWRtaW46c2VjcmV0MTIz" http://localhost:8080/jobs

# Equivalent, letting curl do the encoding:
curl -u admin:secret123 http://localhost:8080/jobs`,
  codeTitle: 'Sending a Basic Auth header manually and via curl -u',
  points: [
    'Basic Auth sends credentials as a Base64-encoded "username:password" string in the Authorization header, on every single request.',
    'The Basic Auth tab in Postman does the Base64 encoding automatically - no manual encoding is required when using it.',
    'Base64 is encoding, not encryption or hashing - anyone intercepting the header can decode the original username and password instantly.',
    'Basic Auth is only acceptable in practice over HTTPS, where TLS protects the header in transit - Basic Auth itself provides zero confidentiality on its own.',
    'Because Basic Auth sends the real password on every request with no expiration or revocation mechanism, it is a stepping stone this chapter later replaces with JWT.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Testing an API with Basic Auth over plain HTTP (not HTTPS), even just locally during development, builds a habit that is dangerous to carry into a real deployment - since Base64 is trivially reversible, sending it unencrypted is functionally the same as sending the raw password in the clear.' },
    { type: 'interview', content: 'Q: Is Base64 encoding in HTTP Basic Authentication a form of encryption, and what does that imply about when Basic Auth is safe to use?\nA: No - Base64 is a reversible encoding scheme, not encryption; anyone who intercepts a Basic Auth header can decode the original credentials in one step. Basic Auth is only safe to use in practice over HTTPS, where TLS encrypts the entire request including that header - the security comes entirely from the transport layer, not from Basic Auth itself.' },
  ],
}
