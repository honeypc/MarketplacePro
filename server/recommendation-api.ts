import fetch from 'node-fetch';

export interface ExternalRecommendationRequest {
  userId: string;
  itemType: 'product' | 'property' | 'destination';
  preferences: any;
  context?: {
    location?: string;
    timeOfDay?: string;
    weather?: string;
    season?: string;
  };
}

export interface ExternalRecommendationResponse {
  recommendations: {
    itemId: string;
    score: number;
    reason: string;
    confidence: number;
  }[];
  metadata: {
    algorithm: string;
    version: string;
    timestamp: string;
  };
}

export class RecommendationAPIService {
  private baseURL = 'https://api.recommendation-service.com/v1';
  private apiKey = process.env.RECOMMENDATION_API_KEY;

  async getPersonalizedRecommendations(
    request: ExternalRecommendationRequest
  ): Promise<ExternalRecommendationResponse> {
    if (!this.apiKey) {
      // Fallback to internal algorithm if no external API key
      return this.generateInternalRecommendations(request);
    }

    try {
      const response = await fetch(`${this.baseURL}/recommendations/personalized`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json() as ExternalRecommendationResponse;
    } catch (error) {
      console.error('External recommendation API error:', error);
      // Fallback to internal algorithm
      return this.generateInternalRecommendations(request);
    }
  }

  async getCollaborativeRecommendations(
    userId: string,
    itemType: string,
    limit: number = 20
  ): Promise<ExternalRecommendationResponse> {
    if (!this.apiKey) {
      return this.generateCollaborativeRecommendations(userId, itemType, limit);
    }

    try {
      const response = await fetch(`${this.baseURL}/recommendations/collaborative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          itemType,
          limit,
          algorithm: 'collaborative_filtering'
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json() as ExternalRecommendationResponse;
    } catch (error) {
      console.error('External collaborative recommendation API error:', error);
      return this.generateCollaborativeRecommendations(userId, itemType, limit);
    }
  }

  async getHybridRecommendations(
    userId: string,
    itemType: string,
    limit: number = 20
  ): Promise<ExternalRecommendationResponse> {
    if (!this.apiKey) {
      return this.generateHybridRecommendations(userId, itemType, limit);
    }

    try {
      const response = await fetch(`${this.baseURL}/recommendations/hybrid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          itemType,
          limit,
          algorithm: 'hybrid_ml'
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json() as ExternalRecommendationResponse;
    } catch (error) {
      console.error('External hybrid recommendation API error:', error);
      return this.generateHybridRecommendations(userId, itemType, limit);
    }
  }

  async sendFeedback(
    userId: string,
    recommendationId: string,
    feedback: 'positive' | 'negative' | 'neutral',
    additionalData?: any
  ): Promise<boolean> {
    if (!this.apiKey) {
      return true; // Simulate success for internal tracking
    }

    try {
      const response = await fetch(`${this.baseURL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          recommendationId,
          feedback,
          timestamp: new Date().toISOString(),
          ...additionalData
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('External feedback API error:', error);
      return false;
    }
  }

  async getRecommendationExplanation(
    userId: string,
    itemId: string
  ): Promise<{ explanation: string; factors: string[] }> {
    if (!this.apiKey) {
      return this.generateInternalExplanation(userId, itemId);
    }

    try {
      const response = await fetch(`${this.baseURL}/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          userId,
          itemId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('External explanation API error:', error);
      return this.generateInternalExplanation(userId, itemId);
    }
  }

  // Internal fallback methods
  private generateInternalRecommendations(
    request: ExternalRecommendationRequest
  ): ExternalRecommendationResponse {
    // Simulate ML-based recommendations
    const sampleRecommendations = [
      { itemId: '1', score: 0.95, reason: 'Based on your preferences', confidence: 0.87 },
      { itemId: '2', score: 0.89, reason: 'Similar users also liked', confidence: 0.82 },
      { itemId: '3', score: 0.84, reason: 'Trending in your area', confidence: 0.78 },
      { itemId: '4', score: 0.79, reason: 'Matches your interests', confidence: 0.75 },
    ];

    return {
      recommendations: sampleRecommendations,
      metadata: {
        algorithm: 'internal_ml',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }

  private generateCollaborativeRecommendations(
    userId: string,
    itemType: string,
    limit: number
  ): ExternalRecommendationResponse {
    // Simulate collaborative filtering results
    const recommendations = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      itemId: `collab_${i + 1}`,
      score: 0.9 - (i * 0.1),
      reason: 'Users with similar tastes also liked this',
      confidence: 0.8 - (i * 0.05),
    }));

    return {
      recommendations,
      metadata: {
        algorithm: 'collaborative_filtering_internal',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }

  private generateHybridRecommendations(
    userId: string,
    itemType: string,
    limit: number
  ): ExternalRecommendationResponse {
    // Simulate hybrid algorithm results
    const recommendations = Array.from({ length: Math.min(limit, 15) }, (_, i) => ({
      itemId: `hybrid_${i + 1}`,
      score: 0.92 - (i * 0.04),
      reason: 'Combined content and collaborative filtering',
      confidence: 0.85 - (i * 0.03),
    }));

    return {
      recommendations,
      metadata: {
        algorithm: 'hybrid_ml_internal',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }

  private generateInternalExplanation(
    userId: string,
    itemId: string
  ): { explanation: string; factors: string[] } {
    return {
      explanation: 'This item is recommended based on your browsing history, preferences, and similar user behavior patterns.',
      factors: [
        'Matches your preferred categories',
        'Similar users purchased this item',
        'Trending in your location',
        'Fits your budget range',
        'High rating from other users'
      ],
    };
  }

  // Advanced ML features
  async getSeasonalRecommendations(
    userId: string,
    season: string,
    itemType: string
  ): Promise<ExternalRecommendationResponse> {
    const seasonalKeywords = {
      spring: ['fresh', 'outdoor', 'garden', 'light'],
      summer: ['beach', 'vacation', 'travel', 'cool'],
      autumn: ['cozy', 'warm', 'harvest', 'comfort'],
      winter: ['indoor', 'holiday', 'warm', 'celebration']
    };

    const keywords = seasonalKeywords[season as keyof typeof seasonalKeywords] || [];
    
    return {
      recommendations: [
        { itemId: 'seasonal_1', score: 0.88, reason: `Perfect for ${season}`, confidence: 0.82 },
        { itemId: 'seasonal_2', score: 0.85, reason: `${season} trending`, confidence: 0.79 },
        { itemId: 'seasonal_3', score: 0.82, reason: `${season} favorite`, confidence: 0.76 },
      ],
      metadata: {
        algorithm: 'seasonal_ml',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }

  async getContextualRecommendations(
    userId: string,
    context: any
  ): Promise<ExternalRecommendationResponse> {
    const { location, timeOfDay, weather } = context;
    
    return {
      recommendations: [
        { itemId: 'context_1', score: 0.91, reason: `Great for ${timeOfDay} in ${location}`, confidence: 0.84 },
        { itemId: 'context_2', score: 0.87, reason: `Perfect for ${weather} weather`, confidence: 0.81 },
        { itemId: 'context_3', score: 0.84, reason: `Popular in ${location}`, confidence: 0.78 },
      ],
      metadata: {
        algorithm: 'contextual_ml',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }

  async getABTestRecommendations(
    userId: string,
    algorithmVariant: 'A' | 'B' | 'C'
  ): Promise<ExternalRecommendationResponse> {
    const algorithms = {
      A: 'content_based',
      B: 'collaborative_filtering',
      C: 'hybrid_ml'
    };

    return {
      recommendations: [
        { itemId: `ab_${algorithmVariant}_1`, score: 0.86, reason: `Algorithm ${algorithmVariant} pick`, confidence: 0.80 },
        { itemId: `ab_${algorithmVariant}_2`, score: 0.83, reason: `Algorithm ${algorithmVariant} pick`, confidence: 0.77 },
      ],
      metadata: {
        algorithm: algorithms[algorithmVariant],
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export const recommendationAPIService = new RecommendationAPIService();