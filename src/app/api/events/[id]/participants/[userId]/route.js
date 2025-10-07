import { NextResponse } from 'next/server';
import { EventsRepository } from '../../../../../../lib/repos/eventsRepo';
import { requireAuth } from '../../../../../../lib/authServer';

const eventsRepo = new EventsRepository();

export async function PATCH(request, { params }) {
  try {
    const user = await requireAuth();

    // Ensure users can only update their own participation
    if (params.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You can only update your own participation' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { comment } = body;

    const event = await eventsRepo.updateParticipant(params.id, params.userId, { comment });

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

    // Ensure users can only remove their own participation
    if (params.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You can only remove your own participation' } },
        { status: 403 }
      );
    }

    const event = await eventsRepo.removeParticipant(params.id, params.userId);

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
