# Migração

Você já usa `skargrid` (1.0–1.4) e quer atualizar? Veja [1.x → Community 2.x](/migration/1x-to-community).

## Contexto

A versão 2.0 refatora o core (estado central, event bus, renderer seguro por padrão) e adiciona novas funcionalidades: server-side processing, persistência de estado, colunas congeladas e agregações no rodapé. Há uma mudança incompatível relevante — veja o guia de migração para o comportamento de segurança em `render()`/`formatter()`.
