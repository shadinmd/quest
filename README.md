# Quest

quest is a application made for increasing your productivity by letting you keep track of what needs to be done

[visit the site](https://quest.shadinmhd.in)

## stack

- nextjs
- mongoose
- bcrypt
- jsonwebtoken
- tailwindcss


## Run locally

#### pre-requisites

- node : v21.6.1
- npm : 10.4.0
- mongodb: 7.0.1

#### clone the repo

close this repository to your preferred direcory

```bash
    git clone https://github.com/shadinmhd/quest
```

#### install libraries

install the required javascript libraries using your preferred package manger 

for npm:
```bash
    npm install 
```

#### create environment variables

create .env.local file

```bash
    touch .env.local
```

use the [.env.example](/.env.example) file and populate with appropriate variables

#### start server

start the server:
```bash
    npm run dev
```

>[!WARNING]
> by default nextjs uses 3000 port for the server make sure you are not using it or run the below command with your preffered port number

```bash
    npm run dev - --p <port number here>
```

now open your browser and visit http://localhost:3000 and wait for some seconds
