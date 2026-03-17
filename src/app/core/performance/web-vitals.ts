import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

/**
 * Reports a single web-vitals metric to the console and as a custom browser event.
 * @param metric Web-vitals metric payload.
 * @returns Nothing.
 */
function reportMetric(metric: Metric): void {
  const metricValue = Math.round(metric.value);

  console.info(`[web-vitals] ${metric.name}: ${metricValue}`);

  window.dispatchEvent(
    new CustomEvent('app:web-vital', {
      detail: metric,
    }),
  );
}

/**
 * Initializes web-vitals listeners for production monitoring.
 * @returns Nothing.
 */
export function initWebVitalsReporting(): void {
  onCLS(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
}
