# Landing Page - Magia para Enamorar

Página de aterrizaje para servicios esotéricos y rituales de amor.

## Despliegue en Cloudflare Pages

### Opción 1: Despliegue Automático (Recomendado)

1. Conecta tu repositorio de GitHub a Cloudflare Pages
2. Configura el build:
   - **Framework preset**: None
   - **Build command**: (dejar vacío)
   - **Build output directory**: (dejar vacío)
   - **Root directory**: (dejar vacío)

### Opción 2: Despliegue Manual con Wrangler

1. Instala Wrangler:
```bash
npm install -g wrangler
```

2. Autentícate con Cloudflare:
```bash
wrangler login
```

3. Despliega:
```bash
wrangler deploy
```

## Estructura del Proyecto

- `index.html` - Página principal (copia de landing.html)
- `landing.html` - Página original
- `wrangler.toml` - Configuración de Wrangler
- `package.json` - Configuración del proyecto

## Configuración

El proyecto está configurado para desplegar una página HTML estática en Cloudflare Pages. No se requiere proceso de build ya que es contenido estático. 