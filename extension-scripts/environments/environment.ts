// Default to production environment
// This file will be replaced by environment.dev.ts during development builds via webpack NormalModuleReplacementPlugin
import { environment as prodEnvironment } from "./environment.prod";

export const environment = prodEnvironment;
