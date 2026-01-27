import { Lti10Data, UserInfo, OutcomeService } from '../types';
/**
 * Extract user information from LTI 1.0 launch data
 *
 * @param ltiBody - LTI 1.0 launch body data
 * @returns Extracted user information
 */
export declare function extractUserInfo(ltiBody: Lti10Data): UserInfo;
/**
 * Extract outcome service information from LTI 1.0 launch data
 *
 * @param ltiBody - LTI 1.0 launch body data
 * @param consumerKey - Consumer key (from launch or environment)
 * @param consumerSecret - Consumer secret (from environment)
 * @returns Outcome service configuration or undefined if not available
 */
export declare function extractOutcomeService(ltiBody: Lti10Data, consumerKey: string, consumerSecret: string): OutcomeService | undefined;
/**
 * Create complete session data structure from LTI 1.0 launch
 *
 * @param ltiBody - LTI 1.0 launch body data
 * @param consumerKey - Consumer key (from launch or environment)
 * @param consumerSecret - Consumer secret (from environment)
 * @returns Complete session data structure
 */
export declare function createSessionData(ltiBody: Lti10Data, consumerKey: string, consumerSecret: string): {
    lti10Data: Lti10Data;
    ltiVersion: string;
    userLoggedIn: boolean;
    userInfo: UserInfo;
    outcomeService?: OutcomeService;
};
//# sourceMappingURL=sessionHelpers.d.ts.map