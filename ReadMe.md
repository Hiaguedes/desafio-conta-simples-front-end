# Desafio FRONTEND da Conta Simples

![Banner Conta Simples](https://cdn.fintechs.com.br/wp-content/uploads/2019/09/conta-simples-banner.jpg)

## Desenvolvido com
<center>
    <img src="https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB">
    <img src="https://img.shields.io/badge/typescript%20-%23007ACC.svg?&style=for-the-badge&logo=typescript&logoColor=white">
</center>

## Para rodar o projeto

Vá no seu terminal favorito e clone o projeto na pasta que você quiser com o

```git
git clone https://github.com/Hiaguedes/desafio-conta-simples-front-end.git
```

Vá a pasta do projeto com

```cmd
cd conta-simples-client
```

Instale as dependencias do projeto com o node (necessário o node instalado)

```cmd
npm install
```

Aí você poderá ver a aplicação rodando com

```cmd
npm start
```

Aí você se deparará com a tela de login, que somente pede o cnpj e para isso você pode escolher qualquer cnpj que está presente no arquivo `empresas.json` e que são

```cnpj
13182905000171
77253158000106
46410071000163
```

E você pode se mover pela uri também somente mudando o id das rotas, o que seria uma baita falha de segurança mas como só tem o front end aqui eu não sei se teria como eu prevenir isso

## Desafio

Criar uma single page application que cumpra os seguintes desafios

1. Criar tela de Login para um Internet Banking;

2. Criar a Home do Internet Banking da Conta Simples (dados da empresa, saldo, grafico de entrada e saida);

3. Criar extrato da empresa e detalhe do extrato;

4. Permitir filtrar extrato por Tipo de Transação e flag de "Crédito" e "Débito";

5. Criar um tela para mostrar transações agrupadas por cartão, apresentar finalCartao e valor;

Sendo oferecidas pela conta simples dois arquivos JSON com os dados das empresas cadastradas e das transações feitas por elas

E esses dados das empresas e das transações feitas pelas empresas cadastradas na aplicação devem ser mockadas (para que seja possível simular a resposta do back end) e para isso foi optado o serviço gratuito do [Mocklab](https://get.mocklab.io/)

## Créditos para os ícones usados no projeto

Alert icon: <https://dinosoftlabs.com/>

icone extrato: <https://www.flaticon.com/br/autores/photo3idea-studio>

Home Icon: <https://www.flaticon.com/authors/freepik>

Card Icon: <https://www.flaticon.com/authors/pixel-perfect>

Filter: <https://www.flaticon.com/authors/becris>

## MUST DO

Testes: Infelizmente não foi possível colocar os testes para as funcionalidades e para os comportamentos da função. Confesso que o que sei de testes é insuficiente para testar toda essa aplicação

## TODO (coisas a mais que seria interessante fazer)

Criar um botão que filtre os dados de entrada e saída por semana (pois os dados da entrada não ficaram muito visíveis, já que os horários das entradas ficaram muito juntos)

Componetizar os filtros na tabela do extrato

Validador de CNPJ para o usuário digitar um cnpj válido

Deixar mais responsivo

Estilizar mais

Comentários

Ver uma forma de fazer apenas uma requisição só ao entrar na aplicação e transferir as informações entre os componentes

Fazer shimmer efect no carregamento da página
