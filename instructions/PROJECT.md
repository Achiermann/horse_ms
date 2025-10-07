## General description of the Project

This is the Instruction file for Horse-MS App. The Horse-MS App is a CMS for a horse stable. There
are 3 people in charge of the staple, and many who rent spaces to put there horses there. Every now and then they attend horse concours (horse riding events). This app should provide a CMS where the owners can insert the events they will attend. Further functionality will be added later.

## users and auth

The auth process happenes via a seperate window, thats rendered if no user is loged in. Also include a "remember me" function. The app will save a global state available across every component (theoretically) that keeps the info weather the user is an "admin" or not (via user.isAdmin stord in the DB).

## layout.js

The layout renderes sone login/logout and account infos and logic.

## src/app/page.js

The main page (src/app/page.js) will just show an overview of all the events. The events are shown as a list of elements that display the date, and the location.  
When the user clicks on a event he will be linked to src/app/events/[id]/page.js via the corresponding event-id.

## src/app/events/[id]/page.js

This page will show all the info about the event meaning the date, the location, and further info.
If the user is admin, it can also add info, create a generous text field for that with possibilities to insert links, make font bold, or underline, ect.
Then theres a section that says "Participants". Here every user can click a button that says "Participate" that will then add this user to the participants list. The list can be edited completely by the admin. A non-admin-user can simply edit his or her own status. Every user can also insert a short comment that will also be shown next to the participant element.

## account

There should be a section where a user can edit its account infos, acessabe through the top of the layout. There the user can edit his/her email.

## Additional comments

Don`t invent unasked functionality, unless tighly related with or necessary for mentioned goals.
