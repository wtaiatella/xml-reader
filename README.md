# XML Editor

## Table of Contents

1. [What is this website?](#What-is-this-website)
2. [How does it work?](#how-does-it-work)
3. [Tech Stack](#tech-stack)
4. [Commands](#commands)
5. [Planned Updates](#Planned-updates)

## What is this website?

Este é o meu proprio site que desenvolvi para apresentar alguns de meus trabalhos e os conhecimentos adquiridos ao longo de meus estudos.

Programei este aplicativo para ser utilizado em uma das atividades realizada pela equipe de desenvolvimento do sistema de Supervisão e Controle de Subestações na empresa onde trabalho atualmente.
O projeto que estamos trabalhando faz parte da modernização do centro de operação de uma grande transmissora de energia e será preciso editar as telas de operação das subestações pois os novos monitores possuem nova dimenções. Para realizar esta edição pode ser feita de uas maneiras, utilizando o software proprio e abrir mais de 800 telas uma por uma para editar a nova dimensão e reposicionar alguns objetos em tela ou fazer edição diretamente no arquivo XML.

Abrir as telas 
A atividade original em questão, consite em editar a nova dimensão da tela 

A atividade em questão, demandaria muitos dias de trabalho pois seria preciso editar varios atributos de posição e dimensão de objetos em mais de 800 arquivos xml.  ou então utilizar o software de parametrização de telas para abrir uma por uma e fazer as devidas edições.

Com esta aplicação desenvolvida em Next juntamente com os recursos de tabela e alguns componentes da Ant Design, o trabalho foi reduzido de dias para algumas horas além de permitir facilmente a reedição dos atributos em poucos segundos. 



## How does it work?

Os arquivos 

Superficially, this is a somewhat-shoddily made corporate website (that I made using Vue). On it (thematically because the corporate overlords are out of touch), there are a number of superfluous features. A circle expands from wherever the user clicks. The header will show waves of expanding circles when moused over. There's a hidden score called the breakpoint. These (and their properties) can all be modified from the about page--the only page relatively safe from the 'ghost'.

Otherwise, breakpoint grows over time and as pages are changed. The higher it is, the more likely for certain events to occur (possible actions are under src/utils/enums.js, how they work is in src/store/breakpoint/actions.js lines 67-224). Other actions occur inside of the components, such as the hero splash image gainin random filter properties.

## Tech Stack

-   Frontend: JavaScript (TypesScript/React)
-   Backend: Node (TypeScript/Express)
-   Database: MongoDB

NOTE: To use this app, you need an active MongoDB server and a connection URL set in the .env file in the backend folder. There is a backup that assumes there is an unsecured MongoDB running locally.

1. To run the backend and the frontend simultaneously: concurrently
    > I chose this package to run items concurrently from a base folder so only one command was needed. Alternatives would include: a shell script, a npm command like "(cd backend && npm start) & cd ../frontend && yarn start" (note: I haven't tested these, so I don't know how they would work) or a few other packages I don't know.
2. Frontend: react, react-router-dom, jest, @testing-library/react
    > The frontend only really needed to output a simple input, a loading spinner and a button. I included react-router-dom because, though the project doesn't need pages, I think it makes the interface simpler and more indicative of its goals. The
3. Backend: express, mongoose, dotenv, mocha, chai, chai-http, typescript (and various types), ts-node and nodemon
    > I used mongoose rather than the normal MongoDB drivers because it was a little easier to set up.

## Commands

To install (from home directory)

1. npm install
2. cd backend && npm install
3. cd ../frontend && yarn install

To run both (from home directory):

1. npm start (with database as is)
2. npm run seed (with database seeded with 5 default URLs)
3. npm run reset (with all URLs deleted from the database)

Frontend commands (all other commands, like yarn eject, aren't included):

1. yarn start
2. yarn test

Backend commands:

1. npm start
2. npm run seed (seed the database with 5 default URLs)
3. npm run reset (remove all URLs from the database)

## Planned Updates

-   Media queries
-   Make the site look better
