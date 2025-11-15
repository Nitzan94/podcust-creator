/**
 * API Client for frontend
 * Centralized API calls with type safety
 */

import type { Food, Meal } from '@/types';

const API_BASE = '/api';

// Error handling
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new APIError(response.status, error.error || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error('Network error');
  }
}

// Foods API
export const foodsAPI = {
  /**
   * Search foods by query
   */
  search: async (query: string, limit: number = 20): Promise<{ foods: Food[]; count: number }> => {
    return fetchAPI(`${API_BASE}/foods/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },
};

// Meals API
export const mealsAPI = {
  /**
   * Get meals (optionally filtered by date)
   */
  getAll: async (date?: string): Promise<{ meals: Meal[]; count: number }> => {
    const url = date
      ? `${API_BASE}/meals?date=${date}`
      : `${API_BASE}/meals`;
    return fetchAPI(url);
  },

  /**
   * Create a new meal
   */
  create: async (meal: {
    name?: string;
    mealType?: string;
    parsedText?: string;
    items: Array<{ foodId: string; quantity: number; unit: string }>;
    timestamp?: string;
  }): Promise<{ meal: Meal; message: string }> => {
    return fetchAPI(`${API_BASE}/meals`, {
      method: 'POST',
      body: JSON.stringify(meal),
    });
  },

  /**
   * Delete a meal
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return fetchAPI(`${API_BASE}/meals?id=${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Parse natural language input with AI
   */
  parse: async (text: string, provider?: string): Promise<{
    parsed: unknown;
    matched: unknown;
    nutrition: unknown;
    mealData: {
      parsedText: string;
      mealType?: string;
      items: unknown;
      totals: unknown;
    };
  }> => {
    return fetchAPI(`${API_BASE}/meals/parse`, {
      method: 'POST',
      body: JSON.stringify({ text, provider }),
    });
  },
};

// Stats API
export const statsAPI = {
  /**
   * Get daily nutrition statistics
   */
  getDaily: async (date?: string): Promise<{
    date: string;
    totals: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    goals: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    progress: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    meals: Meal[];
    mealCount: number;
  }> => {
    const url = date
      ? `${API_BASE}/stats/daily?date=${date}`
      : `${API_BASE}/stats/daily`;
    return fetchAPI(url);
  },
};

// Export all
export default {
  foods: foodsAPI,
  meals: mealsAPI,
  stats: statsAPI,
};
