# 🚀 Como subir para o GitHub

## 1️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `scargrid`
3. Descrição: `Biblioteca JavaScript moderna para tabelas interativas com filtros avançados, busca, ordenação e seleção múltipla`
4. Escolha: **Public** (para ser código aberto)
5. ❌ **NÃO** marque nenhuma opção de README, .gitignore ou LICENSE (já temos esses arquivos)
6. Clique em **Create repository**

## 2️⃣ Conectar e Enviar o Código

Após criar o repositório, copie a URL que aparecerá (algo como: `https://github.com/SEU_USUARIO/scargrid.git`)

Execute estes comandos no terminal (substitua a URL pela sua):

```bash
# Adicionar o remote (substitua pela URL do seu repositório)
git remote add origin https://github.com/ScarpelliniGilmar/scargrid.git

# Renomear a branch para main (padrão do GitHub)
git branch -M main

# Enviar o código
git push -u origin main
```

## 3️⃣ Pronto! 🎉

Seu código estará no GitHub em:
`https://github.com/SEU_USUARIO/scargrid`

---

## 📝 Comandos Úteis para o Futuro

### Adicionar novas mudanças
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

### Criar uma nova versão (tag)
```bash
git tag -a v0.6.0 -m "Versão 0.6.0 - Filtros avançados"
git push --tags
```

### Ver status
```bash
git status
```

### Ver histórico
```bash
git log --oneline
```

---

## 🏷️ Badges para o README

Após publicar, você pode atualizar as badges no README.md:

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/SEU_USUARIO/scargrid.svg)](https://github.com/SEU_USUARIO/scargrid/releases)
[![GitHub stars](https://img.shields.io/github/stars/SEU_USUARIO/scargrid.svg)](https://github.com/SEU_USUARIO/scargrid/stargazers)
```

---

## 📦 Próximos Passos (Opcional)

### Publicar no NPM
1. Crie conta em: https://www.npmjs.com/signup
2. No terminal:
```bash
npm login
npm publish
```

### Criar GitHub Pages para Demo
1. No GitHub, vá em Settings > Pages
2. Source: Deploy from a branch
3. Branch: main > /examples
4. Save

Sua demo estará em: `https://SEU_USUARIO.github.io/scargrid`
