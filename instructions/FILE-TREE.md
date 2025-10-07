## FILE-TREE

'Feel free to delete or add routes if needed but if possible try to include as much of this file tree.As far as Zustand stores go you are invited to add as many as you think is senseful.'

src
├─ app
│ ├─ api
│ │ ├─ users
│ │ │ ├─ login
│ │ │ │ └─ route.js
│ │ │ ├─ logout
│ │ │ │ └─ route.js
│ │ │ ├─ me
│ │ │ │ └─ route.js
│ │ │ ├─ events
│ │ │ │ └─ [id]
│ │ │ │ │ └─ route.js
│ │ │ │ └─ route.js
│ ├─ events
│ │ └─ [id]
│ │ │ └─ page.js
│ ├─ page.js // SSR shell
│ ├─ clientWrapper.js // client providers, Toaster
│ ├─ stores
│ │ └─ useEventsStore.js
├─ components
├─ lib
│ ├─ auth.js
│ ├─ authServer.js
│ ├─ db.js
│ └─ supabaseServerClient.js
└─ styles
├─ main.css
└─ STYLE-GUIDE.md

'If a file thats in the project atm is not mentioned in the file tree, it doesn`t mean you should delete it. For example i didn`t mention ".md" files. Never delete those.'
