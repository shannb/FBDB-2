# FBDB

The code in this repo contains logic to implement an in-memory database as specified in the coding challenge doc.
As it stands the following features do not work according to spec: 
1. No end-of-file detection
2. No print outs for `GET` and `NUMEQUALTO` commands during transactions (transactions work otherwise)

# How to run
 1. Clone repository
 2. npm install
 3. tsc ./src/app.ts
 4. ts-node ./src/app.ts
 5. Enter commands from coding challenge doc
