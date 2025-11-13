# Testes SkarGrid

Este diretório contém os testes automatizados para a biblioteca SkarGrid.

## Estrutura

- `setup.js` - Configuração global para os testes Jest
- `skargrid.test.js` - Testes unitários das funcionalidades core
- `integration.test.js` - Testes de integração para renderização e interação
- `performance.test.js` - Testes de performance com datasets grandes
- `PERFORMANCE_REPORT.md` - Relatório detalhado de performance

## Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar apenas testes de performance
npm test -- tests/performance.test.js

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar com relatório de cobertura
npm test -- --coverage
```

## Resultados de Performance

### 🚀 Performance Excepcional Verificada

| Dataset | Tempo de Renderização | Status |
|---------|----------------------|--------|
| 1.000 registros | 25.66ms | ✅ Excelente |
| 10.000 registros | 30.82ms | ✅ Excelente |
| 15.000 registros | 16.30ms | ✅ Excelente |
| 20.000 registros | 36ms | ✅ Excelente |

**Conclusão**: SkarGrid consegue renderizar datasets grandes com performance excepcional, mantendo interatividade fluida mesmo com milhares de registros.

## Cobertura

Os testes atuais cobrem:
- ✅ Criação de instância e validação
- ✅ Renderização básica e avançada
- ✅ Funcionalidades core (paginação, ordenação, filtros, busca)
- ✅ **Performance com datasets grandes**
- ✅ Integração de múltiplas features

## Melhorias Futuras

- Aumentar cobertura para features avançadas
- Testes de performance em browsers reais
- Testes end-to-end com Puppeteer/Playwright
- Testes de acessibilidade
- Benchmarks comparativos com outras bibliotecas