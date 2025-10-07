import { createSupabaseServerClient } from '../../supabaseServerClient';
import { withSchema } from '../../db';

export class SupabaseEventsAdapter {
  getSupabaseClient() {
    return createSupabaseServerClient();
  }

  async findAll({ search, filters = {}, page = 1, pageSize = 20, userId }) {
    const supabase = this.getSupabaseClient();
    let query = supabase.from(withSchema('events')).select('*', { count: 'exact' });

    // Filter by owner
    if (userId) {
      query = query.eq('owner_id', userId);
    }

    // Search by name or location
    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }

    // Date range filters
    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }

    // Sorting: date ASC, time ASC, name ASC, id ASC
    query = query
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .order('name', { ascending: true })
      .order('id', { ascending: true });

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      items: data || [],
      total: count || 0,
      page,
      pageSize,
    };
  }

  async findById(id) {
    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from(withSchema('events'))
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    return data;
  }

  async create(eventData, userId) {
    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from(withSchema('events'))
      .insert({
        ...eventData,
        owner_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async update(id, eventData, userId) {
    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from(withSchema('events'))
      .update(eventData)
      .eq('id', id)
      .eq('owner_id', userId) // Ensure user owns the event
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async delete(id, userId) {
    const supabase = this.getSupabaseClient();
    const { error } = await supabase
      .from(withSchema('events'))
      .delete()
      .eq('id', id)
      .eq('owner_id', userId); // Ensure user owns the event

    if (error) {
      throw error;
    }

    return true;
  }

  async addParticipant(eventId, participant, userId) {
    // First get the event
    const event = await this.findById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    // Check if participant already exists
    const existingParticipant = event.participants.find((p) => p.userId === participant.userId);

    if (existingParticipant) {
      throw new Error('Participant already added');
    }

    // Add participant
    const participants = [...event.participants, participant];

    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from(withSchema('events'))
      .update({ participants })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async removeParticipant(eventId, userId) {
    // First get the event
    const event = await this.findById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    // Remove participant
    const participants = event.participants.filter((p) => p.userId !== userId);

    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from(withSchema('events'))
      .update({ participants })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updateParticipant(eventId, userId, updates) {
    // First get the event
    const event = await this.findById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    // Update participant
    const participants = event.participants.map((p) =>
      p.userId === userId ? { ...p, ...updates } : p
    );

    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from(withSchema('events'))
      .update({ participants })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}
