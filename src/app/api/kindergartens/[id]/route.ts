import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@/utils/supabase/server';
import { kindergartenSchema } from '../utils';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const kindergarten = await prisma.kindergarten.findUnique({
      where: { id: params.id },
      include: {
        userRoles: {
          where: { userId: user.id },
          select: { role: true }
        }
      }
    });

    if (!kindergarten) {
      return NextResponse.json({ error: 'Kindergarten not found' }, { status: 404 });
    }

    // Check if user has access to this kindergarten
    if (!kindergarten.userRoles.length) {
      return NextResponse.json({ error: 'Not authorized to view this kindergarten' }, { status: 403 });
    }

    return NextResponse.json(kindergarten);
  } catch (error) {
    console.error('Error fetching kindergarten:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin rights for this kindergarten
    const userRole = await prisma.userKindergartenRole.findFirst({
      where: {
        userId: user.id,
        kindergartenId: params.id,
        role: 'admin'
      }
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Not authorized to edit this kindergarten' }, { status: 403 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = kindergartenSchema.parse(body);

    // Update the kindergarten
    const kindergarten = await prisma.kindergarten.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        address: validatedData.address,
        country: validatedData.country,
        city: validatedData.city,
      },
      include: {
        userRoles: true
      }
    });

    return NextResponse.json(kindergarten);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating kindergarten:', { error: errorMessage });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin rights for this kindergarten
    const userRole = await prisma.userKindergartenRole.findFirst({
      where: {
        userId: user.id,
        kindergartenId: params.id,
        role: 'admin'
      }
    });

    if (!userRole) {
      return NextResponse.json({ error: 'Not authorized to delete this kindergarten' }, { status: 403 });
    }

    await prisma.kindergarten.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting kindergarten:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}