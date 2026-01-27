import { Request, Response } from 'express';
import { Lti10Data, Lti10LaunchOptions, RequestWithSession } from '../types';
import { createSessionData } from '../session/sessionHelpers';

/**
 * Detect if request is an LTI 1.0 launch
 * 
 * @param body - Request body
 * @returns True if this appears to be an LTI 1.0 launch
 */
export function isLti10Launch(body: any): body is Lti10Data {
  return !!(body && (body.oauth_consumer_key || body.lti_version));
}

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
export function handleLti10Launch(
  req: Request,
  res: Response,
  options?: Lti10LaunchOptions
): void {
  const body = req.body as Lti10Data;
  
  // Check if this is an LTI 1.0 launch
  if (!isLti10Launch(body)) {
    if (options?.onError) {
      options.onError(new Error('Not an LTI 1.0 launch'));
    }
    return;
  }

  const reqWithSession = req as RequestWithSession;
  
  // Get consumer key and secret from options or environment
  const expectedConsumerKey = options?.consumerKey || process.env.CONSUMER_KEY;
  const consumerSecret = options?.consumerSecret || process.env.CONSUMER_SECRET || '';
  const consumerKeyFromLaunch = body.oauth_consumer_key || '';

  // Validate consumer key if expected key is provided
  if (expectedConsumerKey && consumerKeyFromLaunch !== expectedConsumerKey) {
    const error = new Error('Consumer key mismatch');
    if (options?.onError) {
      options.onError(error);
    }
    return;
  }

  // Create session data
  const sessionData = createSessionData(
    body,
    consumerKeyFromLaunch || expectedConsumerKey || '',
    consumerSecret
  );

  // Store in session
  reqWithSession.session.lti10Data = body;
  reqWithSession.session.ltiVersion = sessionData.ltiVersion;
  reqWithSession.session.userLoggedIn = sessionData.userLoggedIn;
  reqWithSession.session.userInfo = sessionData.userInfo;
  reqWithSession.session.outcomeService = sessionData.outcomeService;
  
  // Store return URL if available
  if (body.launch_presentation_return_url) {
    reqWithSession.session.returnUrl = body.launch_presentation_return_url;
  }

  // Store raw request for debugging
  reqWithSession.session.rawRequest = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString()
  };

  // Call success callback if provided
  if (options?.onSuccess) {
    options.onSuccess(body, sessionData.userInfo, sessionData.outcomeService);
  }
}
