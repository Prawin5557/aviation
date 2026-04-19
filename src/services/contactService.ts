import apiClient from './apiClient';

export interface ContactPayload {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

class ContactService {
  async submitContact(payload: ContactPayload): Promise<void> {
    await apiClient.post('/contact', payload);
  }
}

export const contactService = new ContactService();
