# News Automation AI

Automação de curadoria de notícias semanais sobre Inteligência Artificial e Desenvolvimento de Software, com geração de artigo para LinkedIn e roteiro para YouTube Short usando OpenAI.

## Estrutura do Projeto

```
news/
├── index.js                # Ponto de entrada do app (manual)
├── package.json            # Dependências e scripts
├── src/
│   ├── main.js             # Orquestra o fluxo principal
│   ├── scheduler.js        # Agendamento automático (cron)
│   ├── services/
│   │   ├── newsService.js      # Busca/processa notícias de fontes RSS
│   │   └── openaiService.js    # Integração e prompts com OpenAI
│   └── utils/
│       ├── logger.js           # Logger padronizado
│       └── rssParser.js        # (Opcional) Utilitário para parse RSS
```

## Como Funciona

1. **Busca notícias** das principais fontes de IA/Dev (RSS).
2. **Seleciona as 5 mais impactantes** usando análise da OpenAI.
3. **Gera automaticamente:**
   - Artigo otimizado para LinkedIn (Markdown)
   - Roteiro dinâmico para YouTube Short
4. Exibe tudo no console (ou pode ser adaptado para salvar/compartilhar).

## Como Rodar

### Pré-requisitos
- Node.js >= 16
- Chave da API da OpenAI (opcional, para resultados reais)

### Instalação
```bash
npm install
```

### Configuração
Crie um arquivo `.env` na raiz com:
```
OPENAI_API_KEY=sua-chave-aqui
```

### Execução Manual
```bash
node index.js
```

### Execução Agendada (cron)
Descomente a linha no `index.js`:
```js
// require('./src/scheduler');
```
O agendamento padrão é toda sexta-feira às 09:00 (fuso: America/Sao_Paulo).

## Customização
- Adicione novas fontes RSS em `src/services/newsService.js`.
- Ajuste prompts e formatos em `src/services/openaiService.js`.
- Adapte para salvar em arquivos, enviar por e-mail, etc.

## Boas Práticas
- Código modular, fácil de manter e expandir.
- Separação clara de responsabilidades (serviços, utilitários, agendamento).
- Uso de variáveis de ambiente para segurança.

## Licença
MIT

---

**Dúvidas ou sugestões? Abra uma issue ou contribua!**
