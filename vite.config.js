import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import imagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Log environment variables for debugging
  console.log('Environment Variables:', {
    VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY ? 'Present' : 'Missing',
    VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing',
    VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID ? 'Present' : 'Missing',
    VITE_FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET ? 'Present' : 'Missing',
    VITE_FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Present' : 'Missing',
    VITE_FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID ? 'Present' : 'Missing',
    VITE_RAWG_API_KEY: env.VITE_RAWG_API_KEY ? 'Present' : 'Missing'
  })

  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [
      react(),
      imagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 70
        },
        pngquant: {
          quality: [0.7, 0.9],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      })
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  }
})
