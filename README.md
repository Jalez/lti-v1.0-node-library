# lti-v1.0-node-library

TypeScript library for LTI 1.0/1.1 integration with LMS platforms, including Basic Outcomes grade submission. Focused on LTI 1.0/1.1 support for platforms like older versions of A-Plus that don't support LTI 1.3.

## Quick Start

### Installation

```bash
npm install lti-v1.0-node-library
```

**Note:** The examples below use Express.js, but you can adapt the library to work with other Node.js frameworks. The library uses Express types for convenience, but the core functionality is framework-agnostic.

### Express.js Example

```typescript
import express, { Request, Response } from 'express';
import session from 'express-session';
import { handleLti10Launch, submitGrade } from 'lti-v1.0-node-library';

const app = express();
app.use(express.urlencoded({ extended: true }));
// SESSION_SECRET is for Express session encryption (separate from LTI consumer secret)
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'your-session-secret', 
  resave: true, 
  saveUninitialized: true 
}));

// Set LTI environment variables (required for LTI authentication)
// CONSUMER_KEY and CONSUMER_SECRET authenticate communication with your LMS
process.env.CONSUMER_KEY = 'your-consumer-key';
process.env.CONSUMER_SECRET = 'your-consumer-secret';

// LTI launch endpoint
app.post('/lti-launch', (req: Request, res: Response) => {
  handleLti10Launch(req, res, {
    onSuccess: (ltiData, userInfo, outcomeService) => {
      // User is logged in, session data is stored in req.session
      res.redirect('/app');
    }
  });
});

// Grade submission endpoint
app.post('/submit-grade', async (req: Request, res: Response) => {
  const outcomeService = req.session.outcomeService;
  if (!outcomeService) {
    return res.status(400).json({ error: 'Outcome service not available' });
  }

  const result = await submitGrade(outcomeService, req.body.grade, req.body.maxScore);
  res.json(result);
});
```

## Configuration

### Environment Variables

**Required:**

```bash
CONSUMER_KEY=your-consumer-key-from-lms
CONSUMER_SECRET=your-consumer-secret-from-lms
```

**Why these are needed:**

- **`CONSUMER_KEY`**: A unique identifier for your LTI tool in the LMS. The LMS sends this key with each launch request to identify which tool is being launched. It must match exactly what you configure in your LMS.

- **`CONSUMER_SECRET`**: A shared secret used for OAuth 1.0 signature verification. The LMS signs launch requests using this secret, and your tool verifies the signature to ensure the request is authentic and hasn't been tampered with. It's also used when submitting grades back to the LMS.

**Security Note:** These credentials authenticate communication between your LMS and your LTI tool. Keep them secure and never commit them to version control. Use environment variables or a secure secrets manager.

### LMS Configuration (A-Plus Example)

1. **Launch URL**: `http://your-server:port/lti-launch`
2. **Consumer Key**: Must match your `CONSUMER_KEY` environment variable exactly
3. **Consumer Secret**: Must match your `CONSUMER_SECRET` environment variable exactly
4. **Privacy Notice URL**: `http://your-server:port/privacy` (mandatory for external services)
5. **Enable**: "Send grades back to LMS" option (required for grade submission)

### Privacy Notice URL

**Required for external services:** A link to your service's privacy notice is mandatory for LTI tools outside your organization.

- **Privacy Notice URL**: `http://your-server:port/privacy`
- This URL should point to a page that explains your data collection and usage practices
- Configure this in your LMS admin panel alongside the Launch URL
- Users may be required to accept the privacy notice before accessing your tool
- The privacy notice page should be publicly accessible (no authentication required)

## API

### `handleLti10Launch(req, res, options?)`

Handles LTI 1.0/1.1 launch. Uses Express `Request` and `Response` types, and stores data in `req.session` (requires Express with session middleware).

**Stores in `req.session`:**
- `lti10Data` - Complete LTI launch data
- `userInfo` - User information
- `outcomeService` - Grade submission configuration (if available)

**Options:**
- `consumerKey?: string` - Override env var (default: `process.env.CONSUMER_KEY`)
- `consumerSecret?: string` - Override env var (default: `process.env.CONSUMER_SECRET`)
- `onSuccess?: (ltiData, userInfo, outcomeService?) => void` - Success callback
- `onError?: (error: Error) => void` - Error callback

### `submitGrade(outcomeService, grade, maxScore?)`

Submits grade using LTI Basic Outcomes.

**Parameters:**
- `outcomeService` - From `req.session.outcomeService`
- `grade` - Grade value (e.g., 85)
- `maxScore` - Maximum score (default: 1.0)

**Returns:** `Promise<{ success: boolean, response?: any, status?: number, error?: string }>`


## Types

```typescript
import { 
  Lti10Data, 
  OutcomeService, 
  UserInfo, 
  GradeSubmissionResult 
} from '1.0-lti-node-library';
```

## Framework Support

The library currently uses Express.js types (`Request`, `Response`) and accesses `req.session` for session storage. This makes it convenient for Express.js applications, but you can adapt it for other frameworks by:

1. Using the utility functions directly (`extractUserInfo`, `extractOutcomeService`, `submitGrade`)
2. Implementing your own session storage mechanism
3. Adapting the request/response handling to your framework

## Examples

### Express.js App

```typescript
import express from 'express';
import session from 'express-session';
import { handleLti10Launch, submitGrade } from '1.0-lti-node-library';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'secret',
  resave: true,
  saveUninitialized: true 
}));

// LTI launch
app.post('/lti-launch', (req, res) => {
  handleLti10Launch(req, res, {
    onSuccess: (ltiData, userInfo) => {
      console.log('User:', userInfo.name);
      res.redirect('/app');
    }
  });
});

// Submit grade
app.post('/submit-grade', async (req, res) => {
  const result = await submitGrade(
    req.session.outcomeService,
    req.body.grade,
    req.body.maxScore
  );
  res.json(result);
});

app.listen(3000);
```

## License

MIT
