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
Para ativar o agendamento automático, basta definir no seu `.env`:

```bash
ENABLE_SCHEDULE=1
```

O agendamento padrão é toda sexta-feira às 09:00 (fuso: America/Sao_Paulo), mas pode ser customizado pelas variáveis `CRON_SCHEDULE` e `TIMEZONE`.

## Suporte a múltiplos provedores de LLM

O projeto suporta OpenAI, Gemini (Google) e Ollama. Para escolher o provedor, defina a variável de ambiente `LLM_PROVIDER`:

```
LLM_PROVIDER=openai   # ou gemini, ollama
```

- Para OpenAI: configure `OPENAI_API_KEY` e (opcional) `OPENAI_MODEL`.
- Para Gemini: configure `GEMINI_API_KEY`.
- Para Ollama: configure `OLLAMA_API_URL` (ex: http://localhost:11434/api/chat) e `OLLAMA_MODEL`.

Para simular respostas sem custo, use a variável de ambiente `LLM_MOCK=1` ou `LLM_MOCK=true`. Assim, o sistema retorna respostas mockadas e não consome créditos de nenhum provedor.

Exemplo no seu `.env`:
```
LLM_MOCK=1
```

Quando quiser usar respostas reais, basta remover ou comentar essa linha.

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
