"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuthInstance = createOAuthInstance;
const oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
const crypto_1 = __importDefault(require("crypto"));
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
function createOAuthInstance(consumerKey, consumerSecret) {
    return new oauth_1_0a_1.default({
        consumer: {
            key: consumerKey,
            secret: consumerSecret
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto_1.default.createHmac('sha1', key).update(base_string).digest('base64');
        },
        // Body hash function: SHA1 hash of body (not HMAC, just SHA1)
        // The library passes (body, signingKey) but for body hash we only use body
        // This is critical for LTI Basic Outcomes - oauth_body_hash must be SHA1(body), not HMAC(body, key)
        body_hash_function(body, key) {
            // Ignore key parameter - OAuth body hash is just SHA1 of body
            return crypto_1.default.createHash('sha1').update(body, 'utf8').digest('base64');
        }
    });
}
//# sourceMappingURL=oauth1.js.map