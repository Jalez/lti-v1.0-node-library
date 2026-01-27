import { OutcomeService, GradeSubmissionResult, GradeSubmissionOptions } from '../types';
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
export declare function submitGrade(outcomeService: OutcomeService, grade: number, maxScore?: number, options?: GradeSubmissionOptions): Promise<GradeSubmissionResult>;
//# sourceMappingURL=basicOutcomes.d.ts.map