web systems lab 6

**GRANTED AN EXTENSION FOR THE SUBMISSION OF THIS LAB (11/7)**

struggles:

my biggest struggle with this lab was the setup and environment. originally, i tried to use macOS’s built-in Apache server, but it repeatedly failed with permission and system errors. after multiple attempts using sudo apachectl start, i learned that newer macOS versions restrict access to system daemons, which can prevent users from running Apple’s built-in Apache directly. due to this, i installed Homebrew and then used Homebrew’s Apache (httpd) instead. through Homebrew, i also installed PHP separately to enable PHP execution. in the end, i found that the simplest solution was to use PHP’s built-in development server by running php -S localhost:8000 to host the project locally on my device. this was the most time-consuming and challenging part of the lab.


sources/resources:
* https://www.w3schools.com/php/
* https://stackoverflow.com/questions/5365055/where-is-localhost-folder-located-in-mac-or-mac-os-x
