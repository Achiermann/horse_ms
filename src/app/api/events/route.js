import { NextResponse } from 'next/server';
import { EventsRepository } from '../../../lib/repos/eventsRepo';
import { requireAuth } from '../../../lib/authServer';

const eventsRepo = new EventsRepository();

export async function GET(request) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const startDate = searchParams.get('from') || null;
    const endDate = searchParams.get('to') || null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

    const result = await eventsRepo.getAll({
      search,
      filters: { startDate, endDate },
      page,
      pageSize,
      userId: user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { name, location, date, time, info } = body;

    // Validation
    if (!name || !location || !date || !time) {
      return NextResponse.json(
        {
          error: { code: 'INVALID_INPUT', message: 'Name, location, date, and time are required' },
        },
        { status: 400 }
      );
    }

    const eventData = {
      name,
      location,
      date,
      time,
      info: info || null,
      participants: [],
    };

    const event = await eventsRepo.create(eventData, user.id);

    return NextResponse.json({ item: event }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
