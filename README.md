# About
Dummy API Case Films

# Technologies & Libraries
1. nodejs version 20.11.0
2. nestjs version 10
3. typeorm
4. postgresql
5. jwt
6. passport
7. helmet
8. dotenv
9. mutler

# Engine
nestjs available 2 engines, and in project api, i use engine default(expressjs)

# Project API Architecture
i use DDD Pattern, and reference from: [https://bilaltehseen.medium.com/minimal-domain-driven-design-for-nest-js-b07152ec9970](https://bilaltehseen.medium.com/minimal-domain-driven-design-for-nest-js-b07152ec9970)

# How To Run
1. clone this repository to your local computer, and configure .env or copy .env.example and rename to .env
2. create directory public
3. move to directory, and run the following command:
```bash
npm install
```
4. running migration, for migrate all tables to database, with command in bellow:
```bash
npm run migration:run
```
5. after done step 1 to 3, next running project:
```bash
npm run start:dev
```