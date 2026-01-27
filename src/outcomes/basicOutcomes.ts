import axios, { AxiosError } from 'axios';
import { Parser } from 'xml2js';
import { OutcomeService, GradeSubmissionResult, GradeSubmissionOptions } from '../types';
import { createOAuthInstance } from '../oauth/oauth1';
import { buildBasicOutcomesXml } from '../utils/xmlBuilder';

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
export async function submitGrade(
  outcomeService: OutcomeService,
  grade: number,
  maxScore: number = 1.0,
  options?: GradeSubmissionOptions
): Promise<GradeSubmissionResult> {
  // Validate outcome service
  if (!outcomeService || !outcomeService.url || !outcomeService.sourcedid) {
    throw new Error('Outcome service information missing');
  }

  if (!outcomeService.consumerKey || !outcomeService.consumerSecret) {
    throw new Error('Consumer key or secret missing. Make sure the consumer secret matches what was configured in A-Plus.');
  }

  // Create OAuth instance
  const oauth = createOAuthInstance(outcomeService.consumerKey, outcomeService.consumerSecret);

  // Build XML payload
  const xmlBody = buildBasicOutcomesXml(outcomeService.sourcedid, grade, maxScore);

  // Prepare request data with body hash
  const requestData = {
    url: outcomeService.url,
    method: 'POST' as const,
    includeBodyHash: true, // This tells the library to calculate and include oauth_body_hash
    data: xmlBody // Pass as string - library will use body_hash_function on this
  };

  // Generate OAuth authorization
  // The library will automatically:
  // 1. Call getBodyHash() which uses body_hash_function(xmlBody, signingKey)
  // 2. Include oauth_body_hash in OAuth params
  // 3. Include oauth_body_hash in signature base string
  // No token for LTI Basic Outcomes - pass empty object
  const authParams = oauth.authorize(requestData, {} as any);
  
  // Convert to header format
  const authHeader = oauth.toHeader(authParams);

  try {
    const response = await axios.post(
      outcomeService.url,
      xmlBody,
      {
        headers: {
          'Content-Type': 'application/xml',
          ...authHeader
        }
      }
    );

    // Parse response XML
    const parser = new Parser();
    const result = await parser.parseStringPromise(response.data);
    
    return {
      success: true,
      response: result,
      status: response.status
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    
    return {
      success: false,
      error: axiosError.message,
      details: axiosError.response ? axiosError.response.data : null,
      status: axiosError.response?.status
    };
  }
}
