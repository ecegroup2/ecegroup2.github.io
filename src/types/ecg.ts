
export interface AnalysisResult {
  abnormal: boolean;
  confidenceScore: number;
  conditions: HeartCondition[];
  recommendations: string[];
}

export interface HeartCondition {
  name: string;
  probability: number;
}

// Additional types that might be useful for future expansion

export interface EcgMetrics {
  heartRate?: number;
  prInterval?: number;
  qrsWidth?: number;
  qtcInterval?: number;
  rrInterval?: number;
  stDeviation?: number;
}

export interface AnalysisRequest {
  imageUrl: string;
  patientId?: string;
  analysisType?: 'basic' | 'comprehensive';
  previousResults?: string;
}
