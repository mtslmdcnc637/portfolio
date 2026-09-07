# Portfólio

Site estático (HTML + CSS + JS puro, sem build). Design dark editorial com acento verde-limão.

## Editar o conteúdo

Tudo está no `index.html` — procure pelos comentários `<!-- EDITE -->`:

- **Nome**: usei "Mateus" como placeholder. Busque e substitua `Mateus` / `mateus` pelo seu nome.
- **E-mail**: `contato@mateus.dev` (aparece 3x: menu mobile, contato e mailto).
- **Redes sociais**: seção `#contato`, links com `href="#"` — coloque as URLs reais.
- **Projetos**: seção `#projetos`. Para usar suas imagens, substitua os arquivos `assets/projeto-1.jpg` … `assets/projeto-6.jpg` (e `assets/foto-perfil.jpg`) pelas suas — mantendo os mesmos nomes, não precisa mexer no HTML. As imagens atuais são placeholders abstratos gerados por script e ficam em preto e branco até o hover — proposital.
- **Textos**: sobre, serviços e rodapé estão direto no HTML.

## Rodar local

Abra o `index.html` no navegador, ou:

```bash
npx serve .
```

## Deploy (Vercel)

Push em `main` → a Vercel publica sozinha. Primeira vez:

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório do GitHub
3. Framework preset: **Other** (sem build command, output = raiz)
4. Deploy

## Estrutura

```
index.html      → todo o conteúdo (edite aqui)
css/style.css   → todo o visual (cores nas variáveis do :root)
js/main.js      → menu, acordeão, glitch do logo, rolagem com inércia,
                  parallax, letreiro reativo, cursor, relógio
assets/         → favicon e suas imagens
```
