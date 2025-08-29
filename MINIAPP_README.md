# Vaquita MiniApp - Test Project

## 🚀 Descripción

Este es el proyecto de prueba para la miniapp de Vaquita en Base mainnet. Incluye toda la funcionalidad de staking de USDC con período de bloqueo de 1 minuto.

## 📋 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Base MiniKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Vaquita MiniApp
NEXT_PUBLIC_ICON_URL=https://test-vaquita.vercel.app/logo_vaquita.png

# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_VAQUITA_POOL_ADDRESS=0x2bC60217Aa862696e96eB831B8b67BF0BB14D407
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Farcaster Frame Configuration
NEXT_PUBLIC_FRAME_URL=https://test-vaquita.vercel.app/miniapp/frame
NEXT_PUBLIC_FRAME_IMAGE=https://test-vaquita.vercel.app/logo_vaquita.png
```

### Obtener API Key de Base MiniKit

1. Ve a [Coinbase Developer Platform](https://developer.coinbase.com)
2. Crea una nueva aplicación
3. Copia tu API key
4. Configúrala en las variables de entorno

## 🏗️ Estructura del Proyecto

```
test-vaquita/
├── app/
│   ├── miniapp/
│   │   ├── layout.tsx          # Layout de la miniapp
│   │   ├── page.tsx            # Página principal
│   │   └── frame/
│   │       ├── layout.tsx      # Layout del frame
│   │       └── page.tsx        # Página del frame
│   └── providers.tsx           # Providers de wagmi
├── lib/
│   ├── config.ts               # Configuración general
│   ├── abis/
│   │   ├── VaquitaPool.json    # ABI del contrato pool
│   │   └── USDC.json           # ABI del token USDC
│   └── hooks/
│       ├── useVaquitaPool.ts   # Hook para el pool
│       └── useUSDC.ts          # Hook para USDC
└── public/
    └── logo_vaquita.png        # Logo de la app
```

## 🚀 Funcionalidades

### ✅ Implementado:

- **Conexión de Wallet** con wagmi
- **Depósitos de USDC** con aprobación automática
- **Retiros de USDC** después del período de bloqueo
- **Lista de depósitos** con estado en tiempo real
- **Farcaster Frame** para integración social
- **UI responsive** optimizada para móviles
- **Integración completa** con Base mainnet

### 🔧 Características Técnicas:

- **Red**: Base mainnet (Chain ID: 8453)
- **Contrato Pool**: `0x2bC60217Aa862696e96eB831B8b67BF0BB14D407`
- **Token USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Período de bloqueo**: 1 minuto
- **Mínimo depósito**: 0.1 USDC

## 🛠️ Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 📱 URLs

- **Miniapp principal**: `http://localhost:3000/miniapp`
- **Frame para Farcaster**: `http://localhost:3000/miniapp/frame`

## 🔗 Enlaces Útiles

- **Base Explorer**: https://basescan.org
- **Contrato Pool**: https://basescan.org/address/0x2bC60217Aa862696e96eB831B8b67BF0BB14D407
- **USDC en Base**: https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push

### Variables de Entorno en Vercel

Asegúrate de configurar todas las variables de entorno en el dashboard de Vercel:

- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`
- `NEXT_PUBLIC_ICON_URL`
- `NEXT_PUBLIC_BASE_RPC_URL`
- `NEXT_PUBLIC_VAQUITA_POOL_ADDRESS`
- `NEXT_PUBLIC_USDC_ADDRESS`
- `NEXT_PUBLIC_FRAME_URL`
- `NEXT_PUBLIC_FRAME_IMAGE`

## 📋 Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] API key de Base MiniKit obtenida
- [ ] Logo subido a `/public/logo_vaquita.png`
- [ ] Proyecto desplegado en Vercel
- [ ] URLs actualizadas en configuración
- [ ] Frame probado en Farcaster
- [ ] Funcionalidad de depósitos/retiros probada

## 🐛 Solución de Problemas

### Error de conexión de wallet

- Verifica que MetaMask esté instalado
- Asegúrate de estar en la red Base mainnet

### Error de transacción

- Verifica que tengas suficiente USDC
- Asegúrate de tener ETH para gas fees
- Verifica que el contrato esté desplegado en mainnet

### Error de Frame

- Verifica las URLs en la configuración
- Asegúrate de que la imagen esté accesible públicamente
