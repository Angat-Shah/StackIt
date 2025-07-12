const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(firebaseUid) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ firebaseUid }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Questions endpoints
  async getQuestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/questions?${queryString}`);
  }

  async getQuestion(id) {
    return this.request(`/questions/${id}`);
  }

  async createQuestion(questionData) {
    return this.request('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async updateQuestion(id, questionData) {
    return this.request(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  }

  async deleteQuestion(id) {
    return this.request(`/questions/${id}`, {
      method: 'DELETE',
    });
  }

  async voteQuestion(id, voteType) {
    return this.request(`/questions/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  }

  async getPopularTags() {
    return this.request('/questions/tags/popular');
  }

  // Answers endpoints
  async getAnswers(questionId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/answers/question/${questionId}?${queryString}`);
  }

  async createAnswer(answerData) {
    return this.request('/answers', {
      method: 'POST',
      body: JSON.stringify(answerData),
    });
  }

  async updateAnswer(id, answerData) {
    return this.request(`/answers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(answerData),
    });
  }

  async deleteAnswer(id) {
    return this.request(`/answers/${id}`, {
      method: 'DELETE',
    });
  }

  async voteAnswer(id, voteType) {
    return this.request(`/answers/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  }

  async acceptAnswer(id) {
    return this.request(`/answers/${id}/accept`, {
      method: 'POST',
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async getUserQuestions(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/${id}/questions?${queryString}`);
  }

  async getUserAnswers(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/${id}/answers?${queryString}`);
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAdminUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`);
  }

  async banUser(id, isBanned, reason) {
    return this.request(`/admin/users/${id}/ban`, {
      method: 'PUT',
      body: JSON.stringify({ isBanned, reason }),
    });
  }

  async changeUserRole(id, isAdmin) {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ isAdmin }),
    });
  }

  async getAdminQuestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/questions?${queryString}`);
  }

  async moderateQuestion(id, action, reason) {
    return this.request(`/admin/questions/${id}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason }),
    });
  }

  async getAdminAnswers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/answers?${queryString}`);
  }

  async moderateAnswer(id, action, reason) {
    return this.request(`/admin/answers/${id}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason }),
    });
  }

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  // Notification endpoints
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications?${queryString}`);
  }

  async getUnreadCount() {
    return this.request('/notifications/unread-count');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 