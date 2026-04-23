
# Lab: Blind SQL injection with out-of-band interaction

## Lab Information

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The SQL query is executed asynchronously and has no effect on the application's response. However, you can trigger out-of-band interactions with an external domain.

To solve the lab, exploit the SQL injection vulnerability to cause a DNS lookup to Burp Collaborator.

## Steps to Reproduce

### Checking Parameter Vulnerability

- The `TrackingID` parameter is vulnerable in the Web Application.

### DNS Lookup

- Using the below payload confirms DNS lookup is possible and we can perform Out of Band Interaction SQLi.

```sql

```

