# Guild Wars 2 Web Companion
Simple web app that keeps track of things the average [GW2](https://www.guildwars2.com) player cares about. I wrote this to practice working with Node.js and APIs so there may be some (hopefully temporary) rookie mistakes or suboptimal code herein.
### Features
* Accepts a GW2 public API key and stores it as a signed cookie (30 days) for convenience.
* Keeps track of daily PVE, PVP, WVW, and Fractal daily achievements (both current day and the next).
* Keeps track of users' Griffon mount achievement progress (other mounts coming soon).
* Users can search through the following, with results displayed in real time:
  * Trading post history (bought and sold) for a given account.
  * Current trading post orders (buy and sell).
  * Given account's bank inventory.
* View a given account's: 
  * Wallet info (Gold, karma, map currencies, etc.)
  * Unlocked dyes
  * Unlocked crafting recipes
### New
* Current orders now alert the user if they have been undercut or outbid.
* 'Item', 'currency' and 'achievement' details (name, id, icon URL, etc.) are now stored in a database, which avoids sending unnecessary requests and results in ~20% faster page loading for the current market listings page (and up to ~50% faster for some other pages).

### To Do
* Add ability to calculate expected profit and/or ROI for an item based on buy price, sell price and listing/exchange fees.
* More mount progress trackers (possibly more achievements as well).
* Add some logic to suggest high volume/margin items to flip.
* Add ability to view a given character's stored talent builds.
* Add crafting calculator to view recipes with material cost + profit estimates.
* More account stats!
