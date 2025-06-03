# News Automation AI

Automação de curadoria de notícias semanais sobre Inteligência Artificial e Desenvolvimento de Software, com geração de artigo para LinkedIn e roteiro para YouTube Short usando LLMs (OpenAI, Gemini, Ollama, etc).

## Requisitos

- **Node.js 22 ou superior** (o projeto usa recursos modernos de ES Modules)
- npm >= 9

## Estrutura do Projeto

```
news/
├── index.js                # Ponto de entrada do app (manual ou agendado)
├── package.json            # Dependências e scripts
├── src/
│   ├── main.js             # Orquestra o fluxo principal
│   ├── scheduler.js        # Agendamento automático (cron)
│   ├── services/
│   │   ├── newsService.js      # Busca/processa notícias de fontes RSS
│   │   └── llmService.js       # Integração e prompts com qualquer LLM
│   ├── providers/              # Drivers para cada LLM
│   │   ├── openaiProvider.js
│   │   ├── geminiProvider.js
│   │   ├── ollamaProvider.js
│   │   └── llmProviderFactory.js
│   └── utils/
│       ├── logger.js           # Logger padronizado
│       └── rssParser.js        # (Opcional) Utilitário para parse RSS
```

## Como Funciona

1. **Busca notícias** das principais fontes de IA/Dev (RSS).
2. **Seleciona as 5 mais impactantes** usando análise de LLM (OpenAI, Gemini, Ollama, etc).
3. **Gera automaticamente:**
   - Artigo otimizado para LinkedIn (Markdown)
   - Roteiro dinâmico para YouTube Short
4. Exibe tudo no console (ou pode ser adaptado para salvar/compartilhar).

## Como Rodar

### Pré-requisitos
- Node.js **22 ou superior** (obrigatório)
- Chave da API do provedor LLM desejado (OpenAI, Gemini, Ollama, etc)

### Instalação

```bash
npm install
```

### Configuração
Crie um arquivo `.env` na raiz com as variáveis necessárias (veja `.env.example`).

### Execução Manual

```bash
node index.js
```

### Execução Agendada (cron)
Para ativar o agendamento automático, basta definir no seu `.env`:

```bash
ENABLE_SCHEDULE=true
```

O agendamento padrão é toda sexta-feira às 09:00 (fuso: America/Sao_Paulo), mas pode ser customizado pelas variáveis `CRON_SCHEDULE` e `TIMEZONE`.

## Suporte a múltiplos provedores de LLM

O projeto suporta OpenAI, Gemini (Google) e Ollama. Para escolher o provedor, defina a variável de ambiente `LLM_PROVIDER`:

```env
LLM_PROVIDER=openai   # ou gemini, ollama
```

- Para OpenAI: configure `OPENAI_API_KEY` e (opcional) `OPENAI_MODEL`.
- Para Gemini: configure `GEMINI_API_KEY`.
- Para Ollama: configure `OLLAMA_API_URL` (ex: http://localhost:11434/api/chat) e `OLLAMA_MODEL`.

Para simular respostas sem custo, use a variável de ambiente `LLM_MOCK=1` ou `LLM_MOCK=true`. Assim, o sistema retorna respostas mockadas e não consome créditos de nenhum provedor.

Exemplo no seu `.env`:

```env
LLM_MOCK=true
```

Quando quiser usar respostas reais, basta remover ou comentar essa linha.

Para adicionar novos provedores, crie um arquivo em `src/providers/` seguindo o padrão dos existentes.

## Customização

- Adicione novas fontes RSS em `src/services/newsService.js`.
- Ajuste prompts e formatos em `src/services/llmService.js`.
- Adapte para salvar em arquivos, enviar por e-mail, etc.

## Boas Práticas

- Código modular, fácil de manter e expandir.
- Separação clara de responsabilidades (serviços, utilitários, agendamento, providers).
- Uso de variáveis de ambiente para segurança e flexibilidade.
- Totalmente ES Modules (import/export), aproveitando Node.js moderno.

## Licença
MIT

---

**Dúvidas ou sugestões? Abra uma issue ou contribua!**
