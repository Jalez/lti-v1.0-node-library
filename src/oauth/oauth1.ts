import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

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
export function createOAuthInstance(consumerKey: string, consumerSecret: string): OAuth {
  return new OAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string: string, key: string): string {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
    // Body hash function: SHA1 hash of body (not HMAC, just SHA1)
    // The library passes (body, signingKey) but for body hash we only use body
    // This is critical for LTI Basic Outcomes - oauth_body_hash must be SHA1(body), not HMAC(body, key)
    body_hash_function(body: string, key: string): string {
      // Ignore key parameter - OAuth body hash is just SHA1 of body
      return crypto.createHash('sha1').update(body, 'utf8').digest('base64');
    }
  });
}
