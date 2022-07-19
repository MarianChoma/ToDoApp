# ToDoApp

ToDoApp API is created with Express and SQL database MySQL. Sequelize is use to connect to database.  

## Installation

Download the code. You need to have user called root with password root or you can change it in config.json. Then you type these command. 

```bash
sequelize db:create
sequelize db:migrate
npm start
```



##Functional requirements
- Authentication (login, registration)
- Creating lists (1 user can have multiple lists, one list can belong to multiple users)
- The list must contain a title
- Adding list items (only users linked to the list)
- It must contain a title, free text, deadline, info about who created the record
- Marking items with flags (active, completed, cancelled...) (only for users linked to the list)
- View list and items (anyone, even not logged in)
- Sharing the list with other users (only users linked to the list)



```
##Documentation
Swagger documentation [here](https://app.swaggerhub.com/apis-docs/MarianChoma/ToDoApp/1.0.0)
