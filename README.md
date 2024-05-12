# XML Editor

## Table of Contents

1. [What is this website?](#What-is-this-website)
2. [How does it work?](#how-does-it-work)
3. [Tech Stack](#tech-stack)
4. [Commands](#commands)

## What is this website?

The object of this site is to be used in one of the activities carried out by the development team of the Substation Supervision and Control system in the company where I currently work.

One of the stages of the project consists of adapting the size of the operation screens of the substations to the new size of the monitors that will be installed in the control rooms. The problem is that to edit this information it would be necessary to open one by one and change the dimension and position parameters of each object on the screen. This work would take days to edit more than 800 screens.

Knowing that this information is stored in XML files and that the format of these files is very simple, it was possible to develop an application that allows the editing of these attributes in a simple and fast way. With this application developed in Next together with the table resources and some components of Ant Design, the work was reduced from days to a few hours and also allows the attributes to be easily re-edited in a few seconds.

## How does it work?

The application is very simple and intuitive. The user only needs to select the XML file to be edited and the application will load the information in a table. The user can then edit the attributes of each object in the table and save the changes to the XML file.

## Tech Stack

-   Frontend: JavaScript (Next)
              Styled Components
                Ant Design
-   Backend (API):  JavaScript (Next)
-   Database: PostgreSQL            


NOTE: To use this app, you need an provide a connection URL set in the .env file .

1. Frontend / Backend: Next
    > The frontend is build with Next.js, I chose it because it's a framework that I'm familiar with and it's easy to set up with Ant Design and the possibility to use an database PostgreSQL to store data from XML files. I also used Styled Components to style the app.
    
2. Database: PostgreSQL
    > I chose PostgreSQL because it's a relational database and it's easy to set up with Next.js. I also used Prisma to connect to the database and to create the models.

## Commands

To install (from home directory)

1. npm install

To create database (from home directory):

1. npx prisma db push --preview-feature
2. npx prisma migrate dev --preview-feature
3. npx prisma generate
4. npx prisma studio

To start commands (from home directory):

1. npm run dev
