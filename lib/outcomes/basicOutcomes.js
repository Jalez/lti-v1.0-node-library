"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitGrade = submitGrade;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const oauth1_1 = require("../oauth/oauth1");
const xmlBuilder_1 = require("../utils/xmlBuilder");
/**
 * Submit a grade to A-Plus using LTI Basic Outcomes Service
 *
 * @param outcomeService - Outcome service configuration
 * @param grade - The grade value to submit
 * @param maxScore - Maximum possible score (default: 1.0)
 * @param options - Additional options (reserved for future use)
 * @returns Promise resolving to grade submission result
 * @throws Error if outcome service info is missing or submission fails
 */
async function submitGrade(outcomeService, grade, maxScore = 1.0, options) {
    // Validate outcome service
    if (!outcomeService || !outcomeService.url || !outcomeService.sourcedid) {
        throw new Error('Outcome service information missing');
    }
    if (!outcomeService.consumerKey || !outcomeService.consumerSecret) {
        throw new Error('Consumer key or secret missing. Make sure the consumer secret matches what was configured in A-Plus.');
    }
    // Create OAuth instance
    const oauth = (0, oauth1_1.createOAuthInstance)(outcomeService.consumerKey, outcomeService.consumerSecret);
    // Build XML payload
    const xmlBody = (0, xmlBuilder_1.buildBasicOutcomesXml)(outcomeService.sourcedid, grade, maxScore);
    // Prepare request data with body hash
    const requestData = {
        url: outcomeService.url,
        method: 'POST',
        includeBodyHash: true, // This tells the library to calculate and include oauth_body_hash
        data: xmlBody // Pass as string - library will use body_hash_function on this
    };
    // Generate OAuth authorization
    // The library will automatically:
    // 1. Call getBodyHash() which uses body_hash_function(xmlBody, signingKey)
    // 2. Include oauth_body_hash in OAuth params
    // 3. Include oauth_body_hash in signature base string
    // No token for LTI Basic Outcomes - pass empty object
    const authParams = oauth.authorize(requestData, {});
    // Convert to header format
    const authHeader = oauth.toHeader(authParams);
    try {
        const response = await axios_1.default.post(outcomeService.url, xmlBody, {
            headers: {
                'Content-Type': 'application/xml',
                ...authHeader
            }
        });
        // Parse response XML
        const parser = new xml2js_1.Parser();
        const result = await parser.parseStringPromise(response.data);
        return {
            success: true,
            response: result,
            status: response.status
        };
    }
    catch (error) {
        const axiosError = error;
        return {
            success: false,
            error: axiosError.message,
            details: axiosError.response ? axiosError.response.data : null,
            status: axiosError.response?.status
        };
    }
}
//# sourceMappingURL=basicOutcomes.js.map