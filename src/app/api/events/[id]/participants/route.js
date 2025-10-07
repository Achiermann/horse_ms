import { NextResponse } from 'next/server';
import { EventsRepository } from '../../../../../lib/repos/eventsRepo';
import { requireAuth } from '../../../../../lib/authServer';

const eventsRepo = new EventsRepository();

export async function POST(request, { params }) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { userId, displayName, comment } = body;

    // Ensure users can only add themselves
    if (userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You can only add yourself as a participant' } },
        { status: 403 }
      );
    }

    const participant = {
      userId,
      displayName,
      comment: comment || '',
    };

    const event = await eventsRepo.addParticipant(params.id, participant, user.id);

    return NextResponse.json({ item: event });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    if (error.message === 'Participant already added') {
      return NextResponse.json(
        { error: { code: 'CONFLICT', message: error.message } },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
