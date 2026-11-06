# PRD - Documento de Requisitos de Produto (Product Requirements Document)
## Sistema: Doe Vida (doevida.com.br)

---

## 1. Visão Geral do Produto

### 1.1 Missão e Propósito
O **Doe Vida** (`doevida.com.br`) é uma plataforma web humanizada e de utilidade pública projetada para conectar de forma ágil, segura e descentralizada pacientes que necessitam de doação de sangue com potenciais doadores voluntários em todo o Brasil.

### 1.2 Objetivos Principais
- **Agilidade:** Permitir que familiares e amigos criem um pedido oficial de doação em menos de 2 minutos, sem necessidade de cadastro burocrático inicial ou senhas complexas.
- **Viralização e Compartilhamento:** Gerar automaticamente materiais de divulgação de alto impacto (Cards para Feed do Instagram/Facebook, Stories com QR Code, texto pronto para WhatsApp com links e rotas).
- **Acessibilidade e Descentralização:** Permitir acesso rápido a rotas para hemocentros (Google Maps e Waze) e filtros precisos por Estado, Cidade e Tipo Sanguíneo.
- **Segurança e Privacidade:** Conformidade com a LGPD (Termos de Consentimento explícito) e controle de edição/finalização por Token Seguro exclusivo (`edit_token`).

---

## 2. Arquitetura Técnica do Sistema

### 2.1 Stack Tecnológico
- **Framework:** Next.js 15 (App Router, Server Components e Server Actions).
- **Linguagem:** TypeScript (tipagem estrita em ponta a ponta).
- **Estilização:** Tailwind CSS, Lucide Icons, animações e gradientes customizados.
- **Banco de Dados & Backend:** Supabase (PostgreSQL, Row Level Security, RPC Functions).
- **Armazenamento de Mídia (Storage):** Supabase Storage (Bucket público `campaigns` para fotos de pacientes).
- **Geração de Imagens & Social:** `html-to-image` (client-side 2x pixel ratio para cards PNG) e `@vercel/og` / Next.js Image Response (OpenGraph dinâmico na rota `/c/[slug]/opengraph-image`).
- **Validação de Schemas:** Zod com React Hook Form (`@hookform/resolvers/zod`).
- **Manipulação de Imagens:** `react-easy-crop` com compressão e canvas nativo no browser.

### 2.2 Rotas da Aplicação
| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Landing page principal com Hero, estatísticas, requisitos de doação e Feed com filtros | Público |
| `/novo` | Formulário de criação de campanha com upload/corte de foto e aceite de termos | Público |
| `/c/[slug]` | Página de detalhes da campanha, ações de doação, rotas e painel do autor | Público (Gestão restrita com `?token=`) |
| `/c/[slug]/compartilhar` | Central de geração e download de cards (Feed e Stories) e WhatsApp | Público (Gestão preservada se token presente) |
| `/c/[slug]/opengraph-image` | Endpoint dinâmico Edge para geração de imagem de pré-visualização social | Público |

---

## 3. Modelo de Dados (Supabase / PostgreSQL)

### 3.1 Tabela `public.campaigns`
| Campo | Tipo | Nulo? | Padrão | Descrição |
|---|---|---|---|---|
| `id` | `uuid` | Não | `gen_random_uuid()` | Identificador único da campanha |
| `slug` | `text` | Não | - | Identificador amigável para URL (único) |
| `patient_name` | `text` | Não | - | Nome completo do paciente |
| `blood_type` | `text` | Não | - | Tipo sanguíneo (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`, `QUALQUER`) |
| `donation_type` | `text` | Não | `'Sangue Total'` | Modalidade de doação (`Sangue Total`, `Plaquetas`, `Plasma`, `Eritrócitos`) |
| `hospital_name` | `text` | Não | - | Hospital onde o paciente está internado |
| `hemocenter_name` | `text` | Não | - | Nome do hemocentro/banco de sangue onde doar |
| `city` | `text` | Não | - | Cidade do hemocentro |
| `state` | `char(2)`| Não | - | Unidade Federativa (UF, ex: SP, RJ, BA) |
| `patient_code` | `text` | Sim | `null` | Código interno do paciente, prontuário ou leito |
| `urgent_until` | `date` | Sim | `null` | Data limite de urgência para a doação |
| `patient_photo_url` | `text` | Sim | `null` | URL pública da foto hospedada no Supabase Storage |
| `status` | `text` | Não | `'active'` | Status da campanha (`active` ou `completed`) |
| `edit_token` | `text` | Não | `encode(gen_random_bytes(16), 'hex')` | Token criptográfico de autenticação do criador |
| `pledges_count` | `integer`| Não | `0` | Contador de compromissos ("Eu Vou Doar") |
| `terms_accepted_at`| `timestamptz` | Sim | `now()` | Registro de data/hora do aceite dos Termos e LGPD |
| `created_at` | `timestamptz` | Sim | `now()` | Timestamp de criação da campanha |

---

## 4. Funcionalidades e Regras de Negócio Detalhadas

### 4.1 Criação de Pedidos de Doação (`/novo`)
- **Validações Obrigatórias (Zod):**
  - Nome do paciente: Mínimo 3 caracteres, máximo 100 caracteres.
  - Tipo sanguíneo: Deve pertencer ao enum válido (incluindo `QUALQUER`).
  - Tipo de doação: `Sangue Total`, `Plaquetas`, `Plasma` ou `Eritrócitos`.
  - Hospital e Hemocentro: Mínimo 3 caracteres, máximo 150 caracteres.
  - Cidade: Mínimo 2 caracteres, máximo 100 caracteres.
  - Estado: Sigla com exatamente 2 caracteres (UF brasileira válida).
  - Termos de Uso e LGPD: Checkbox obrigatório (`terms_accepted === true`).
- **Geração do Slug:**
  - Gerado a partir do nome do paciente com sanitização de acentos, caracteres especiais e sufixo alfanumérico curto para garantir unicidade sem colisões (ex: `joao-silva-a8f3`).

### 4.2 Processamento e Upload de Fotos
- **Limites e Regras:**
  - Limite do seletor client-side: até 15MB.
  - Compressão no navegador: Redimensionamento para largura/altura máxima de 1200px via Canvas em JPEG (85% de qualidade).
  - Modal de Recorte (`ImageCropModal`): Proporção quadrada 1:1 com zoom interativo.
  - Validação server-side no upload: Formatos permitidos (`image/jpeg`, `image/png`, `image/webp`), limite de 5MB por requisição.
  - Storage: Nome de arquivo com UUID v4 no bucket público `campaigns`.
  - Comportamento sem foto: Se o usuário não enviar foto, o sistema exibe ícone estilizado de gota de sangue com o tipo sanguíneo em destaque ("Qualquer Tipo" ou o tipo específico).

### 4.3 Gestão e Edição de Campanhas (`edit_token`)
- **Autenticação Descentralizada:**
  - Ao criar o anúncio, o criador recebe um link exclusivo contendo o `edit_token` na query string (`/c/[slug]/compartilhar?token=XXXX` ou `/c/[slug]?token=XXXX`).
  - Quando acessado com o token correto, o sistema ativa os botões de gestão na página:
    - **Editar Campanha (`EditCampaignModal`):** Permite alterar hospital, hemocentro, cidade, estado, código de leito e data limite de urgência. Não permite alterar o nome do paciente para evitar fraudes de identidade.
    - **Concluir Campanha (`CompleteCampaignButton`):** Permite ao autor marcar a campanha como concluída ("Meta atingida!"), desativando o botão de novos compromissos de doação.
- **Proteção Server-side:**
  - A verificação do token ocorre exclusivamente no servidor via Server Action `verifyCampaignToken(slug, token)`. O `edit_token` nunca é retornado em queries públicas para o navegador.

### 4.4 Feed Principal e Filtros de Busca (`/`)
- **Filtragem Dinâmica:**
  - Filtro por Estado (UF): Dropdown com todas as 27 UFs do Brasil.
  - Filtro por Cidade: Campo de busca textual com correspondência case-insensitive (`ilike`).
  - Filtro por Tipo Sanguíneo: Seleção de tipos específicos (`A+`, `O-`, etc.) e opção "Qualquer Tipo".
  - Botão "Limpar filtros": Restaura a listagem padrão.
- **Regra de Exibição Temporal (30 dias):**
  - Apenas campanhas criadas nos últimos 30 dias com `status = 'active'` são exibidas no feed inicial.

### 4.5 Página da Campanha (`/c/[slug]`)
- **Informações Exibidas:**
  - Foto do paciente ou avatar com tipo sanguíneo.
  - Tag de urgência (`🚨 URGENTE` se `urgent_until >= hoje`, ou `PRECISA-SE DE DOAÇÃO`).
  - Nome do paciente e código de leito/prontuário.
  - Tipo sanguíneo em destaque e modalidade de doação.
  - Hospital e Hemocentro com cidade/UF.
  - Contador de doadores confirmados ("X pessoas já confirmaram doação").
- **Ações Disponíveis:**
  - **"Eu Vou Doar":** Incrementa o contador de compromissos no banco via RPC atômica `increment_pledge`.
  - **Google Maps e Waze:** Links diretos com endereço codificado para abrir o GPS.
  - **Copiar Dados:** Copia para a área de transferência uma mensagem resumida e formatada com todos os dados e link direto.
  - **Gerar e Compartilhar Cards:** Redireciona para a central de compartilhamento.

### 4.6 Central de Compartilhamento e Cards (`/c/[slug]/compartilhar`)
- **Formatos Disponíveis:**
  - **Stories (9:16 - 1080x1920):** Layout vertical com degradê, tipografia de alta legibilidade, foto do paciente, dados completos e QR Code escaneável apontando diretamente para `https://doevida.com.br/c/[slug]`.
  - **Feed (1:1 - 1080x1080):** Layout quadrado ideal para postagens no Instagram, Facebook e LinkedIn.
- **Ações de Compartilhamento:**
  - **Baixar Imagem:** Converte o componente React em imagem PNG de alta resolução (`pixelRatio: 2`, `cacheBust: true`) via `html-to-image` e faz download local com o nome `doe-vida-[slug]-[formato].png`.
  - **Compartilhar no WhatsApp:**
    - Em dispositivos móveis compatíveis: Dispara a `navigator.share` nativa com o arquivo de imagem anexado e a mensagem de texto pré-formatada.
    - Em desktop/fallback: Faz o download automático da imagem, copia a mensagem para o clipboard com instrução amigável e abre o link `https://wa.me/?text=...`.

---

## 5. Matriz de Casos de Teste (Test Plan Geral)

### 5.1 Testes de Criação de Anúncios e Validações de Formulário
- **TC-01: Criação com dados completos e foto válida:**
  - Acessar `/novo`, preencher todos os campos válidos, selecionar foto JPG/PNG, aceitar termos e submeter.
  - *Resultado esperado:* Redirecionamento para `/c/[slug]/compartilhar?token=...`, registro persistido no banco com status `active`, pledges `0`, e slug único gerado.
- **TC-02: Criação sem foto (comportamento padrão):**
  - Criar campanha sem selecionar foto.
  - *Resultado esperado:* Criação bem-sucedida, avatar exibe tipo sanguíneo ou "Qualquer Tipo" com estilização correta.
- **TC-03: Validação de campos obrigatórios e tamanhos:**
  - Submeter formulário com nome menor que 3 letras, hospital vazio, UF inválida ou sem aceitar os termos LGPD.
  - *Resultado esperado:* O formulário não submete; mensagens de erro de validação Zod aparecem nos campos correspondentes.
- **TC-04: Teste de Upload de Fotos (Tamanhos e Formatos):**
  - **Foto pequena (< 100KB):** Upload e corte devem funcionar sem distorção.
  - **Foto grande (> 15MB no seletor):** Alerta bloqueando antes da leitura ("A foto selecionada é muito grande").
  - **Foto entre 5MB e 15MB:** A compressão client-side deve reduzi-la adequadamente e o upload deve ser aceito.
  - **Arquivo não-imagem (ex: PDF ou TXT renomeado):** Validação server-side em `createCampaign` deve rejeitar com erro "Formato de imagem inválido".
- **TC-05: Modal de Recorte de Foto (Crop):**
  - Selecionar imagem retangular ou desproporcional; ajustar zoom e posição no modal; confirmar corte.
  - *Resultado esperado:* O preview na página de criação deve exibir a imagem cortada em formato circular/quadrado 1:1.

### 5.2 Testes de Edição e Permissões do Publicador
- **TC-06: Edição com Token Válido:**
  - Acessar `/c/[slug]?token=[TOKEN_CORRETO]`.
  - O painel "Acesso de Gestão Ativo" e o botão "Editar Dados da Campanha" devem estar visíveis.
  - Abrir modal de edição, alterar hospital, hemocentro, cidade ou código do leito e salvar.
  - *Resultado esperado:* Notificação de sucesso, modal fecha, página recarrega com dados atualizados no Supabase.
- **TC-07: Tentativa de Edição sem Token ou Token Inválido:**
  - Acessar `/c/[slug]` sem query parameter ou com `?token=invalido123`.
  - *Resultado esperado:* Botões de edição e conclusão NÃO devem aparecer. Chamadas diretas à Server Action `updateCampaign` com token falso devem falhar com erro.
- **TC-08: Conclusão da Campanha pelo Autor:**
  - Acessar com token válido e clicar em "Concluir Campanha".
  - *Resultado esperado:* Status muda para `completed`; banner verde "Meta de doação atingida!" é exibido; botão de pledge é desativado.

### 5.3 Testes de Filtros e Busca no Feed
- **TC-09: Filtro por Estado (UF):**
  - Selecionar uma UF (ex: `SP`); verificar se apenas campanhas do estado aparecem.
- **TC-10: Filtro por Cidade (Search com correspondência parcial):**
  - Digitar o nome parcial da cidade no campo de busca; verificar filtragem imediata.
- **TC-11: Filtro por Tipo Sanguíneo (incluindo "Qualquer Tipo"):**
  - Filtrar por `QUALQUER` e por tipos específicos (`O-`, `AB+`); verificar se os cards correspondentes são filtrados corretamente.
- **TC-12: Combinação de Filtros e Reset:**
  - Aplicar filtros simultâneos (UF + Cidade + Tipo); clicar no botão "Limpar filtros"; verificar restauração da lista completa.
- **TC-13: Estado Vazio (Nenhum resultado encontrado):**
  - Filtrar por critérios inexistentes (ex: cidade inexistente); verificar mensagem amigável "Nenhuma campanha encontrada com esses filtros".

### 5.4 Testes de Compartilhamento, Cards e Navegação
- **TC-14: Geração e Download dos Cards (Stories e Feed):**
  - Acessar `/c/[slug]/compartilhar`.
  - Alternar entre aba "Stories" e "Feed".
  - Clicar em "Baixar Imagem".
  - *Resultado esperado:* Download de arquivo PNG de alta qualidade com texto legível, sem cortes nas bordas e com QR Code nítido.
- **TC-15: Compartilhamento WhatsApp:**
  - Clicar em "Enviar no WhatsApp".
  - *Resultado esperado:* Em desktop, baixa a imagem, copia a mensagem com o link completo para a área de transferência e abre o WhatsApp Web. Em mobile, dispara o compartilhador nativo com a imagem anexada.
- **TC-16: Botão "Copiar Dados do Paciente":**
  - Clicar em "Copiar Dados" na página da campanha.
  - *Resultado esperado:* Feedback visual de sucesso ("Copiado!") e clipboard contendo texto formatado com nome, tipo sanguíneo, hospital, hemocentro e link direto da campanha.
- **TC-17: Links de Rotas (Google Maps e Waze):**
  - Clicar nos botões de GPS; verificar se as URLs contêm o endereço e cidade codificados corretamente em `maps.google.com` e `waze.com`.
- **TC-18: Botão "Eu Vou Doar" (Pledge):**
  - Clicar no botão na página da campanha.
  - *Resultado esperado:* Contador incrementa imediatamente, persistido via RPC no banco, e estado visual muda para confirmado com bloqueio de cliques repetidos na mesma sessão.

---

## 6. Análise de Segurança e APIs Expostas

### 6.1 Políticas de Segurança de Dados (Supabase RLS)
- **Vulnerabilidade Identificada / Status Atual:**
  - Na tabela `campaigns`, a política `SELECT` está liberada publicamente para a role `anon`. Como a coluna `edit_token` pertence à mesma tabela, uma chamada direta do front-end usando `supabase.from('campaigns').select('*')` poderia expor todos os tokens de edição.
- **Medida de Proteção Implementada no Código:**
  - As leituras públicas do sistema utilizam a constante `PUBLIC_CAMPAIGN_COLUMNS` no Server Component, explicitamente omitindo a coluna `edit_token`.
  - A verificação de permissão de edição é executada de forma restrita no servidor (`verifyCampaignToken`).
- **Recomendação de Reforço em Produção:**
  - Criar uma View pública no PostgreSQL (ex: `public_campaigns`) sem a coluna `edit_token`, ou aplicar Column-Level Privileges revogando `SELECT (edit_token)` para a role `anon`.

### 6.2 Segurança do Supabase Storage
- **Bucket `campaigns`:**
  - Configurado como público para permitir que o WhatsApp, redes sociais e navegadores carreguem as fotos livremente.
  - Políticas RLS no Storage: `SELECT` liberado para `public`, `INSERT` permitido para uploads.
  - Proteção de integridade: Geração de nomes aleatórios com `UUIDv4` para evitar sobrescrita ou descoberta sequencial de fotos de outros pacientes.
  - Validação rigorosa de MIME types (`image/jpeg`, `image/png`, `image/webp`) e tamanho máximo de 5MB nas Server Actions.

### 6.3 Prevenção contra Abusos e SPAM
- Schemas Zod sanitizam strings antes de qualquer inserção.
- Não há campos abertos de comentários ou HTML livre, prevenindo ataques de XSS armazenado.
- Contadores de doação (`pledges_count`) utilizam função RPC atômica (`increment_pledge`) prevenindo race conditions e manipulação indevida de valores arbitrários pelo cliente.

### 6.4 Chaves e Variáveis de Ambiente
- `NEXT_PUBLIC_SUPABASE_URL`: Pública (usada pelo cliente SSR).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Pública (chaves públicas do Supabase com restrição via RLS).
- `NEXT_PUBLIC_SITE_URL`: Configurada como `https://doevida.com.br`.
- Nenhuma `service_role_key` ou credencial secreta é exposta no cliente ou commitada no repositório.

---

## 7. Conformidade e Aspectos Legais (LGPD)
- **Termos de Uso e Consentimento:** Diálogo obrigatório (`TermsDialog.tsx`) onde o autor declara ter autorização do paciente ou responsável legal para divulgação do nome e dados médicos básicos estritamente para fins de doação de sangue.
- **Registro do Consentimento:** O timestamp exato do aceite é registrado na coluna `terms_accepted_at`.
- **Direito de Encerramento:** O autor tem controle total para finalizar a campanha a qualquer momento através do seu link exclusivo de edição.
- **Prazo de Expiração Automática:** Campanhas com mais de 30 dias expiram e são removidas automaticamente para proteger dados de saúde obsoletos.
