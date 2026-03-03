export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface EvaluationDetail {
    score: number;
    reasoning: string;
}

export interface ValidAIResponse {
    score: number;
    problem_clarity: EvaluationDetail;
    icp_definition: EvaluationDetail;
    market_saturation: EvaluationDetail;
    differentiation: EvaluationDetail;
    strategic_risks: string[];
    blind_spots: string[];
    confidence: ConfidenceLevel;
}

export interface ValidAIRequest {
    idea: string;
}
