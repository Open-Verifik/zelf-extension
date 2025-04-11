import { HttpContextToken } from "@angular/common/http";

export const DISABLE_GLOBAL_EXCEPTION_HANDLING = new HttpContextToken<boolean>(() => false);
