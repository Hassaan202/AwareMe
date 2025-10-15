// API Configuration and Utility Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Authentication APIs
export const authAPI = {
  signup: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Profile APIs
export const profileAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getChildren: async () => {
    const response = await fetch(`${API_BASE_URL}/api/profile/children`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  linkChild: async (childEmail) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/link-child`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ childEmail }),
    });
    return response.json();
  },
};

// Chat APIs
export const chatAPI = {
  childChat: async (message) => {
    const response = await fetch(`${API_BASE_URL}/api/chat/child`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    return response.json();
  },

  parentChat: async (message) => {
    const response = await fetch(`${API_BASE_URL}/api/chat/parent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });
    return response.json();
  },
};


// Learning APIs
export const learningAPI = {
  getProgress: async () => {
    const response = await fetch(`${API_BASE_URL}/api/learning/progress`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  /**
   * Get learning progress for a specific child (parent access)
   * @param {string} childId - The ID of the child
   * @returns {Promise} Progress data with statistics
   */
  getChildProgress: async (childId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/learning/progress/${childId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch child progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching child progress:', error);
      throw error;
    }
  },

  /**
   * Get current user's learning progress (for children)
   * @returns {Promise} Progress data with statistics
   */
  getMyProgress: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/learning/progress`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  /**
   * Get all available lessons
   * @returns {Promise} List of lessons with questions
   */
  getLessons: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/learning/lessons`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  },

  /**
   * Submit quiz answers
   * @param {string} lessonId - The ID of the lesson
   * @param {number[]} answers - Array of answer indices
   * @returns {Promise} Quiz result with score
   */
  submitQuiz: async (lessonId, answers) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/learning/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },
};

// Emergency APIs
export const emergencyAPI = {
  sendAlert: async (message, location) => {
    const response = await fetch(`${API_BASE_URL}/api/emergency/alert`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, location }),
    });
    return response.json();
  },

  getAlerts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/emergency/alerts`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Resources APIs
export const resourcesAPI = {
  getResources: async () => {
    const response = await fetch(`${API_BASE_URL}/api/resources`);
    return response.json();
  },

  requestCounseling: async () => {
    const response = await fetch(`${API_BASE_URL}/api/counseling/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// User utility functions
export const userUtils = {
  saveToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  saveUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};
