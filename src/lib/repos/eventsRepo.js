import { SupabaseEventsAdapter } from '../adapters/supabase/eventsAdapter';

// Repository interface - swap adapter to change database
export class EventsRepository {
  constructor() {
    this.adapter = new SupabaseEventsAdapter();
  }

  async getAll(options) {
    return this.adapter.findAll(options);
  }

  async getById(id) {
    return this.adapter.findById(id);
  }

  async create(eventData, userId) {
    return this.adapter.create(eventData, userId);
  }

  async update(id, eventData, userId) {
    return this.adapter.update(id, eventData, userId);
  }

  async delete(id, userId) {
    return this.adapter.delete(id, userId);
  }

  async addParticipant(eventId, participant, userId) {
    return this.adapter.addParticipant(eventId, participant, userId);
  }

  async removeParticipant(eventId, userId) {
    return this.adapter.removeParticipant(eventId, userId);
  }

  async updateParticipant(eventId, userId, updates) {
    return this.adapter.updateParticipant(eventId, userId, updates);
  }
}
