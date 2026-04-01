
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

###