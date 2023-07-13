Projeto base criado a partir do comando para criar React Next app

npx create-next-app@latest

Instalado Styled Components e adicionado um Title para teste
Para evitar erros de carregamento de pagina, é preciso informar ao next que esta sendo utilizado o styles components incluindo o seguinte código no arquivo next.config.js

// next.config.js
module.exports = {
compiler: {
// Enables the styled-components SWC transform
styledComponents: true
}
}

Instalado Ant Design habilitado para edição do Tema.
-> Adicionado um botão e alterado a cor padrão para teste

Adiicionado User Context

Configurado arquivo para GlobalStyles
