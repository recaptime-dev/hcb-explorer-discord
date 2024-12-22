// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import config from "../config";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: config.sentryDSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
Sentry.profiler.startProfiler();

// log console api calls as events
Sentry.captureConsoleIntegration();

export default Sentry;
