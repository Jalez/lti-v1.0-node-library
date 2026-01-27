import OAuth from 'oauth-1.0a';
/**
 * Create OAuth 1.0 instance configured for LTI Basic Outcomes
 *
 * This includes the critical body_hash_function that calculates SHA1 hash
 * of the request body (not HMAC) for oauth_body_hash parameter.
 *
 * @param consumerKey - OAuth consumer key
 * @param consumerSecret - OAuth consumer secret
 * @returns Configured OAuth instance
 */
export declare function createOAuthInstance(consumerKey: string, consumerSecret: string): OAuth;
//# sourceMappingURL=oauth1.d.ts.map