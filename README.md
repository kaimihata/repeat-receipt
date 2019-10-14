## Inspiration
We starting cooking our own food when we came to college, and it started to become really important to consider where to buy groceries to save money. Trying to save the locations where you got the cheapest food is incredibly tedious to do by hand, especially if you frequent multiple stores. We came up with the idea for this app looking for ways to make that process of finding cheap food easier.

## What it does
Users can scan receipts using the camera on their phone. The receipts are parsed using Google Cloud Vision, and items and their prices are located using keywords and the coordinates of the text in the image. Purchased items are automatically added to a Firestore database, where they can then be retrieved and searched through to find the best prices the user has bought the item for in the past. The app supports authenticating multiple users and maintaining a separate database for each one.

## How we built it
The receipts are parsed using Google Cloud Vision, the database is hosted on Firebase, and React Native was used to build the mobile app.

## Challenges we ran into
Parsing many different receipts formats proved to be extremely difficult, and trying to generalize a way to find items and store in the database required a detailed algorithm. 

## Accomplishments that we're proud of
Most of the features are automated, only requiring the user to take pictures and search through items. The rest is done automatically.

## What we learned
We learned that prioritizing the important features is really important for finishing on time.

## What's next for Repeat Receipt
Perhaps a more sophisticated algorithm for grouping similar items in the database and retrieving them together.

https://devpost.com/software/repeat-receipt-bkz86p
