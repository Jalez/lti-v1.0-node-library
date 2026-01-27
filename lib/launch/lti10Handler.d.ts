import { Request, Response } from 'express';
import { Lti10Data, Lti10LaunchOptions } from '../types';
/**
 * Detect if request is an LTI 1.0 launch
 *
 * @param body - Request body
 * @returns True if this appears to be an LTI 1.0 launch
 */
export declare function isLti10Launch(body: any): body is Lti10Data;
/**
 * Handle LTI 1.0 launch request
 *
 * Extracts LTI data, validates consumer key, stores session data,
 * and extracts outcome service information for grade submission.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param options - Launch handler options
 */
export declare function handleLti10Launch(req: Request, res: Response, options?: Lti10LaunchOptions): void;
//# sourceMappingURL=lti10Handler.d.ts.map