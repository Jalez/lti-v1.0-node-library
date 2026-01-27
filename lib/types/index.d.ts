import { Request } from 'express';
/**
 * LTI 1.0 launch data structure
 */
export interface Lti10Data {
    oauth_consumer_key?: string;
    oauth_signature?: string;
    oauth_signature_method?: string;
    oauth_timestamp?: string;
    oauth_nonce?: string;
    oauth_version?: string;
    lti_version?: string;
    lti_message_type?: string;
    resource_link_id?: string;
    user_id?: string;
    roles?: string;
    lis_person_name_given?: string;
    lis_person_name_family?: string;
    lis_person_contact_email_primary?: string;
    context_id?: string;
    context_label?: string;
    context_title?: string;
    launch_presentation_document_target?: string;
    launch_presentation_return_url?: string;
    lis_outcome_service_url?: string;
    lis_result_sourcedid?: string;
    [key: string]: any;
}
/**
 * Outcome service configuration for grade submission
 */
export interface OutcomeService {
    url: string;
    sourcedid: string;
    consumerKey: string;
    consumerSecret: string;
}
/**
 * Extracted user information from LTI launch
 */
export interface UserInfo {
    userId?: string;
    name?: string;
    email?: string;
    roles?: string;
    contextId?: string;
    contextLabel?: string;
    contextTitle?: string;
    resourceLinkId?: string;
}
/**
 * Complete session data structure
 */
export interface SessionData {
    lti10Data?: Lti10Data;
    ltiVersion?: string;
    userLoggedIn?: boolean;
    userInfo?: UserInfo;
    outcomeService?: OutcomeService;
    returnUrl?: string;
    rawRequest?: {
        method: string;
        url: string;
        headers: any;
        query: any;
        body: any;
        timestamp: string;
    };
}
/**
 * Grade submission result
 */
export interface GradeSubmissionResult {
    success: boolean;
    response?: any;
    status?: number;
    error?: string;
    details?: any;
}
/**
 * Options for LTI 1.0 launch handler
 */
export interface Lti10LaunchOptions {
    consumerKey?: string;
    consumerSecret?: string;
    onSuccess?: (ltiData: Lti10Data, userInfo: UserInfo, outcomeService?: OutcomeService) => void;
    onError?: (error: Error) => void;
}
/**
 * Options for grade submission
 */
export interface GradeSubmissionOptions {
    [key: string]: any;
}
/**
 * Express request with session
 */
export interface RequestWithSession extends Request {
    session: SessionData & {
        [key: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map