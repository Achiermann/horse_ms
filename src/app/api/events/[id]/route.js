import { NextResponse } from 'next/server';
import { EventsRepository } from '../../../../lib/repos/eventsRepo';
import { requireAuth } from '../../../../lib/authServer';

const eventsRepo = new EventsRepository();

export async function GET(request, { params }) {
  try {
    await requireAuth();

    const event = await eventsRepo.getById(params.id);

    if (!event) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Event not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ item: event });
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

export async function PATCH(request, { params }) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { name, location, date, time, info } = body;

    const eventData = {};
    if (name !== undefined) eventData.name = name;
    if (location !== undefined) eventData.location = location;
    if (date !== undefined) eventData.date = date;
    if (time !== undefined) eventData.time = time;
    if (info !== undefined) eventData.info = info;

    const event = await eventsRepo.update(params.id, eventData, user.id);

    if (!event) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Event not found or not authorized' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ item: event });
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

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();

    await eventsRepo.delete(params.id, user.id);

    return new NextResponse(null, { status: 204 });
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
