"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUserInfo = extractUserInfo;
exports.extractOutcomeService = extractOutcomeService;
exports.createSessionData = createSessionData;
/**
 * Extract user information from LTI 1.0 launch data
 *
 * @param ltiBody - LTI 1.0 launch body data
 * @returns Extracted user information
 */
function extractUserInfo(ltiBody) {
    return {
        userId: ltiBody.user_id,
        name: `${ltiBody.lis_person_name_given || ''} ${ltiBody.lis_person_name_family || ''}`.trim(),
        email: ltiBody.lis_person_contact_email_primary,
        roles: ltiBody.roles,
        contextId: ltiBody.context_id,
        contextLabel: ltiBody.context_label,
        contextTitle: ltiBody.context_title,
        resourceLinkId: ltiBody.resource_link_id
    };
}
/**
 * Extract outcome service information from LTI 1.0 launch data
 *
 * @param ltiBody - LTI 1.0 launch body data
 * @param consumerKey - Consumer key (from launch or environment)
 * @param consumerSecret - Consumer secret (from environment)
 * @returns Outcome service configuration or undefined if not available
 */
function extractOutcomeService(ltiBody, consumerKey, consumerSecret) {
    if (!ltiBody.lis_outcome_service_url || !ltiBody.lis_result_sourcedid) {
        return undefined;
    }
    return {
        url: ltiBody.lis_outcome_service_url,
        sourcedid: ltiBody.lis_result_sourcedid,
        consumerKey: consumerKey,
        consumerSecret: consumerSecret
    };
}
/**
 * Create complete session data structure from LTI 1.0 launch
 *
 * @param ltiBody - LTI 1.0 launch body data
 * @param consumerKey - Consumer key (from launch or environment)
 * @param consumerSecret - Consumer secret (from environment)
 * @returns Complete session data structure
 */
function createSessionData(ltiBody, consumerKey, consumerSecret) {
    const userInfo = extractUserInfo(ltiBody);
    const outcomeService = extractOutcomeService(ltiBody, consumerKey, consumerSecret);
    return {
        lti10Data: ltiBody,
        ltiVersion: '1.0',
        userLoggedIn: true,
        userInfo,
        outcomeService
    };
}
//# sourceMappingURL=sessionHelpers.js.map