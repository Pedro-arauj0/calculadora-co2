# 🌍 Calculadora de Emissão de CO2 - EcoTrack

Projeto desenvolvido como desafio técnico para a **DIO (Digital Innovation One)**. A aplicação calcula o impacto ambiental (pegada de carbono) com base em trajetos realizados, utilizando lógica de programação em JavaScript e uma interface responsiva.

## 🔗 Demonstração
O projeto está publicado e pode ser acessado através do GitHub Pages:
👉 [Acessar Calculadora de CO2](https://pedro-arauj0.github.io/calculadora-co2/)

## 🚀 Tecnologias e Conceitos Aplicados
Como estudante de **Análise e Desenvolvimento de Sistemas**, foquei na aplicação de conceitos fundamentais de engenharia de software:

- **HTML5 Semântico**: Estruturação de formulários e acessibilidade.
- **CSS3 Avançado**: Uso de variáveis, animações (`@keyframes`) e metodologia **BEM** (*Block Element Modifier*) para organização das classes.
- **JavaScript Moderno (ES6+)**: 
  - Manipulação de DOM.
  - Tratamento de eventos assíncronos.
  - Lógica de validação com blocos `try/catch/finally`.
  - Integração de dados entre múltiplos arquivos (Modularização).
- **Git & GitHub**: Fluxo de trabalho com commits semânticos e deploy via GitHub Pages.

## 🛠️ Funcionalidades
- **Cálculo por Rota**: Integração com base de dados local (`routes-data.js`) para distâncias pré-definidas.
- **Entrada Manual**: Opção para o usuário inserir a quilometragem exata.
- **Modos de Transporte**: Seleção dinâmica (Bicicleta, Carro, Ônibus) que altera os fatores de emissão.
- **Interface Responsiva**: Design adaptável para desktop e dispositivos móveis.

## 📂 Estrutura do Projeto
```text
├── css/
│   └── style.css          # Estilização e Animações
├── js/
│   ├── routes-data.js     # "Banco de dados" de rotas
│   ├── calculator.js      # Lógica matemática do CO2
│   ├── ui.js              # Manipulação da interface (Renderização)
│   └── app.js             # Orquestrador principal da aplicação
└── index.html             # Estrutura principal
