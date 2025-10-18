Web Systems Lab 4

Sources:
* ChatGPT
* https://openweathermap.org/api
* https://v2.jokeapi.dev/
* https://getbootstrap.com/

ChatGPT Prompts:
#1   
    "Can you complete this lab for me? Be sure to follow the prompt closely. Provide all the necessary code files (pasted Lab 3 Intructions...) Use the following APIs: joke api:https://sv443.net/jokeapi/v2/ and this Open Weather API:https://home.openweathermap.org/ here is the key for the Open Weather API:e5b777ef2c116a5f495f2d2f19e18256"

    Outcome: Works with the exception of being able to fetch weather for a location other than Troy, NY. (Ex. Boston, MA presents these errors:  Error fetching weather: 404 Not Found {"cod":"404","message":"city not found"} HTTP Response Headers (some):content-length: 40 content-type: application/json; charset=utf-8)


#2
    "The website properly displays the information for Troy, NY, however when I try typing in another city or even try typing in Troy, NY it doesn't work and I get these errors: Error fetching weather: 404 Not Found {"cod":"404","message":"city not found"} Troy, NY HTTP Response Headers (some): content-length: 40 content-type: application/json; charset=utf-8"


    Outcome: Still getting error messages, but displaying the weather for Boston. Error message:HTTP Response Headers (some): content-length: 510 content-type: application/json; charset=utf-8


#3
    "This works better, however I still get this:HTTP Response Headers (some): content-length: 510 content-type: application/json; charset=utf-8. It displays the information for Boston, MA when inputted, however I still get the error and it also changes to Boston, US."

    Outcome: This did remove the display of response headers from displaying, however it did not update the HTML to remove the title of Reponse Headers.


#4
    Remove the response header section from being visible to the user and give me all the updated code files. 

    Outcome: This did fix my code to make everything now run smoothly, however, it completely changed the appearance and styling of the website. This isn't an issue for the sake of this lab, however if I were trying to achieve a specific look, this is something that could be frustrating.
    