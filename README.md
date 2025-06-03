![Tests](https://img.shields.io/badge/tests-PASS-brightgreen.svg)
![Tests](https://img.shields.io/badge/tests-PASS-brightgreen.svg)
![Tests](https://img.shields.io/badge/tests-PASS-brightgreen.svg)

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
│       ├── persistence.js      # Persistência de notícias usadas (MongoDB ou JSON)
│       └── rssParser.js        # (Opcional) Utilitário para parse RSS
```

## Como Funciona

1. **Busca notícias** das principais fontes de IA/Dev (RSS).
2. **Seleciona as 5 mais impactantes** usando análise de LLM (OpenAI, Gemini, Ollama, etc).
3. **Gera automaticamente:**
   - Artigo otimizado para LinkedIn (Markdown)
   - Roteiro dinâmico para YouTube Short
4. Exibe tudo no console (ou pode ser adaptado para salvar/compartilhar).

## Persistência de Notícias Utilizadas

O projeto permite evitar o reuso de notícias já processadas, com duas opções de persistência:

- **Local (JSON):** padrão, salva em `used_news.json` na raiz do projeto.
- **MongoDB:** para uso compartilhado ou em produção.

Configure no `.env`:

```env
# Persistência local (JSON)
USED_NEWS_STORAGE=local

# Persistência em MongoDB
# USED_NEWS_STORAGE=mongo
# MONGODB_URI=mongodb://localhost:27017
# MONGODB_DB=news
# MONGODB_COLLECTION=used_news
```

Se `USED_NEWS_STORAGE` não for definido, o padrão é local (JSON).

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
- Configure a quantidade de notícias impactantes com `TOP_NEWS_COUNT` no `.env`.

## Como gerar apenas LinkedIn ou YouTube Short

Você pode controlar o que será gerado usando as variáveis no `.env`:

```env
# Geração de conteúdos (defina como true ou false)
GENERATE_LINKEDIN=true         # Gera artigo para LinkedIn (default: true)
GENERATE_YOUTUBE_SHORT=true    # Gera roteiro para YouTube Short (default: true)
```

- Para gerar apenas o LinkedIn: coloque `GENERATE_LINKEDIN=true` e `GENERATE_YOUTUBE_SHORT=false`.
- Para gerar apenas o YouTube Short: coloque `GENERATE_LINKEDIN=false` e `GENERATE_YOUTUBE_SHORT=true`.
- Para gerar ambos, deixe ambos como `true` (ou remova, pois o padrão é gerar ambos).

Se ambos estiverem como `false`, nada será gerado.

## Output dos Conteúdos Gerados

- O artigo do LinkedIn é salvo em `outputs/linkedin_<data>.md`.
- O roteiro do YouTube Short é salvo em `outputs/youtube_short_<data>.txt`.

Esses arquivos são gerados automaticamente a cada execução, facilitando o uso, publicação ou histórico dos conteúdos.

Você pode customizar o local ou formato desses arquivos alterando o código em `src/main.js`.

## Boas Práticas

- Código modular, fácil de manter e expandir.
- Separação clara de responsabilidades (serviços, utilitários, agendamento, providers).
- Uso de variáveis de ambiente para segurança e flexibilidade.
- Totalmente ES Modules (import/export), aproveitando Node.js moderno.

## Licença
MIT

---

**Dúvidas ou sugestões? Abra uma issue ou contribua!**
