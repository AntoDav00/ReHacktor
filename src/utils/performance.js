import { getCLS, getFID, getLCP } from 'web-vitals'

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry)
    getFID(onPerfEntry)
    getLCP(onPerfEntry)
  }
}

export const logPerformance = (metric) => {
  console.log(`${metric.name}: ${metric.value}`)
  
  // Puoi aggiungere qui la logica per inviare metriche a un servizio esterno
  // Esempio: sendToAnalytics(metric)
}
