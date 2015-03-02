TSDJ
====
![TSDJ Screenshot](/screenshot.png?raw=true "TSDJ Screenshot")

TSDJ is an intelligent, customizable , data-driven DJ engine. Created for the Emory Robotics Club Share a Hack With Coke 2014 Hackathon held at Emory University. TSDJ uses the Spotify API to authenticate users, retrieve playlists, and play music samples. The Echonest API is used to retrieve song attributes. It won 3rd place at the hackathon.

The DJ works by allowing the users to match up a timeseries to a musical attribute such as "Danceability" or "Energy". Some timeseries functions currently implemented include a sine wave, a random function, the bitcoin price, and the weather temperature. It is easily extendable. The datasource is really up to your imagination. 

Some Example Use Cases
---
* Map the energy of your songs to a sine wave with a 20 minute period to regulate the flow of your party.
* If you're a coffee shop owner, map the valence attribute to the precipitation. 
* Create a custom function to regulate the energy of the songs played depending on the time of day.
* I don't know... use your imagination.

Implementing Your Own Datasource
---
1. Add the function name into /public/assets/js/allSources.js
2. Define a function with the same name, and have it return a value between 0 and 1. This function will be checked every second.

