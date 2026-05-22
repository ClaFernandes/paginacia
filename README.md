# 📚 Página & Cia

Página & Cia é uma livraria online desenvolvida em React, com foco numa experiência de compra completa: navegação por categorias, pesquisa, favoritos, carrinho persistente e checkout em múltiplos passos.

🔗 **Demo ao vivo:** [https://clafernandes.github.io/paginacia/](https://clafernandes.github.io/paginacia/)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias e Bibliotecas](#tecnologias-e-bibliotecas)
- [Arquitetura e Decisões Técnicas](#arquitetura-e-decisões-técnicas)
- [Como Correr Localmente](#como-correr-localmente)
- [Autora](#autora)

---

## Sobre o Projeto

Página & Cia é um projeto frontend desenvolvido como exercício prático de React. Simula uma loja de livros com fluxo completo de utilizador: registo, login, navegação pelo catálogo, gestão de favoritos, carrinho de compras e checkout com morada e método de pagamento.

Todo o estado é gerido no frontend com Context API e persistido em `localStorage`, sem backend.

---

## Funcionalidades

### 🏠 Catálogo e Navegação

- Listagem de todos os livros na página inicial
- Filtro por preço (slider) e ordenação por nome ou preço
- Pesquisa em tempo real por título e autor (barra no header)
- Paginação responsiva (12 livros por página em desktop, 4 em mobile)

### 📂 Coleções

- **Categorias** — navegação por género com suporte a slugs na URL
- **Lançamentos** — livros recentemente adicionados
- **Mais Vendidos** — destaques de maior procura
- **Promoções** — livros com desconto ativo

### 📖 Detalhe do Livro

- Página individual por livro (`/books/:id`)
- Exibição de preço com desconto e preço original riscado
- Ações de adicionar ao carrinho e aos favoritos

### 🛒 Carrinho

- Sidebar deslizante acessível a partir do ícone no header
- Adição, aumento, diminuição e remoção de itens
- Quantidade total visível no badge do ícone
- Persistência em `localStorage` entre sessões
- Cálculo automático do total

### ❤️ Favoritos

- Adicionar/remover livros dos favoritos (requer login)
- Lista de favoritos em página dedicada (`/favorites`)
- Persistência em `localStorage`
- Ícone de coração com estado visual ativo/inativo

### 👤 Autenticação

- Registo com dados completos: nome, apelido, NIF, telemóvel e morada
- Login com email e password
- Recuperação de password em dois passos (verificação de identidade + nova password)
- Toggle de visibilidade da password
- Validação de formulários com React Hook Form
- Redireccionamento automático após login/logout
- Sessão persistida em `localStorage`

### ✅ Checkout

- Protegido por autenticação (redireciona para `/auth` se não estiver logado)
- Fluxo em 3 etapas com stepper visual:
  1. **Entrega** — morada pré-preenchida com os dados do utilizador, editável
  2. **Pagamento** — seleção entre MB WAY, Multibanco e Cartão
  3. **Confirmação** — resumo da encomenda antes de finalizar
- Sidebar lateral com resumo dos itens e total visível em todas as etapas
- Limpa o carrinho após confirmação

### 🔐 Rotas Protegidas

- `/profile`, `/favorites` e `/checkout` redirecionam para `/auth` se não houver sessão ativa
- `/auth` redireciona para `/` se o utilizador já estiver autenticado

### 📄 Páginas Institucionais

- Sobre (`/about`)
- Contacto (`/contact`)
- Termos de Uso (`/terms`)
- Política de Privacidade (`/privacy`)
- Página 404 personalizada

---

## Tecnologias e Bibliotecas

| Tecnologia                                                  | Utilização                             |
| ----------------------------------------------------------- | -------------------------------------- |
| [React 18](https://react.dev/)                              | Biblioteca principal de UI             |
| [React Router DOM v6](https://reactrouter.com/)             | Roteamento SPA com rotas protegidas    |
| [Vite](https://vitejs.dev/)                                 | Bundler e servidor de desenvolvimento  |
| [React Hook Form](https://react-hook-form.com/)             | Gestão e validação de formulários      |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | Notificações de feedback ao utilizador |
| [React Icons](https://react-icons.github.io/react-icons/)   | Biblioteca de ícones (MD, FA, GR, RX)  |
| CSS                                                         | Estilização por componente             |

---

## Arquitetura e Decisões Técnicas

**`useReducer` no carrinho** — O `CartContext` usa `useReducer` para gerir as ações do carrinho (ADD, INCREASE, DECREASE, REMOVE, CLEAR), tornando a lógica de estado previsível e centralizada. O `useMemo` evita re-renders desnecessários nos componentes consumidores.

**Persistência com `localStorage`** — O carrinho, os favoritos e a sessão do utilizador são guardados automaticamente no `localStorage`, permitindo que o estado seja recuperado ao recarregar a página.

**Rotas protegidas por composição** — As rotas privadas são protegidas diretamente no `AppRoutes.jsx` usando o `isLoggedIn` do `AuthContext`, com `<Navigate>` a redirecionar quando necessário.

**Formulários com React Hook Form** — O `Auth.jsx` e o `Checkout.jsx` usam RHF para validação, registo de campos e gestão de erros, incluindo campos condicionais que são desregistados ao mudar de modo (login/registo).

**Layout com Outlet** — O `AppLayout` envolve todas as páginas e usa o `<Outlet>` do React Router para renderizar o conteúdo, passando `searchTerm` via `useOutletContext` para a página `Home`.

---

## Como Correr Localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/ClaFernandes/paginacia.git

# 2. Entrar na pasta
cd paginacia

# 3. Instalar dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

Para gerar o build de produção:

```bash
npm run build
```

---

## Autora

Desenvolvido por **[ClaFernandes](https://github.com/ClaFernandes)**
