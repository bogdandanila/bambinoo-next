import { createClient } from '@/utils/supabase/server';
import { kindergartenSchema } from './utils';
import prisma from "@/utils/prisma";

export async function getKindergarten(kindergartenId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  try {
    const kindergarten = await prisma.kindergarten.findFirst({
      where: {
        id: kindergartenId,
        userRoles: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        userRoles: {
          where: {
            userId: user.id
          },
          select: {
            role: true
          }
        }
      }
    });

    if (!kindergarten) {
      throw new Error('Kindergarten not found or access denied');
    }

    return kindergarten;
  } catch (error) {
    console.error('Error fetching kindergarten:', error);
    throw new Error('Failed to fetch kindergarten');
  }
}

export async function getKindergartens() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  try {
    const kindergartens = await prisma.kindergarten.findMany({
      where: {
        userRoles: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        userRoles: {
          where: {
            userId: user.id
          },
          select: {
            role: true
          }
        }
      }
    });

    return kindergartens;
  } catch (error) {
    console.error('Error fetching kindergartens:', error);
    throw new Error('Failed to fetch kindergartens');
  }
}

export type KindergartenData = { 
  name: string;
  address: string;
  city: string;
  country: string;
}

export async function createKindergarten(data: KindergartenData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  // Validate the input data
  const validatedData = kindergartenSchema.parse(data);

  // Create or get the user in Prisma first
  const prismaUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email || '',
      firstName: user.user_metadata?.firstName || '',
      lastName: user.user_metadata?.lastName || '',
    },
  });

  // Create the kindergarten with the relationship
  const kindergarten = await prisma.kindergarten.create({
    data: {
      name: validatedData.name,
      address: validatedData.address,
      country: validatedData.country,
      city: validatedData.city,
      userRoles: {
        create: {
          user: {
            connect: {
              id: prismaUser.id
            }
          },
          role: 'admin',
        },
      },
    },
    include: {
      userRoles: true
    }
  });

  return kindergarten;
}

export async function updateKindergarten(id: string, data: KindergartenData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  try {
    // Check if user has admin rights for this kindergarten
    const userRole = await prisma.userKindergartenRole.findFirst({
      where: {
        userId: user.id,
        kindergartenId: id,
        role: 'admin'
      }
    });

    if (!userRole) {
      throw new Error('Not authorized to update this kindergarten');
    }

    // Validate the input data
    const validatedData = kindergartenSchema.parse(data);

    const kindergarten = await prisma.kindergarten.update({
      where: {
        id: id
      },
      data: {
        name: validatedData.name,
        address: validatedData.address,
        city: validatedData.city,
        country: validatedData.country
      },
      include: {
        userRoles: {
          where: {
            userId: user.id
          },
          select: {
            role: true
          }
        }
      }
    });

    return kindergarten;
  } catch (error) {
    console.error('Error updating kindergarten:', error);
    throw new Error('Failed to update kindergarten');
  }
}

export async function deleteKindergarten(id: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  try {
    // Check if user has admin rights for this kindergarten
    const userRole = await prisma.userKindergartenRole.findFirst({
      where: {
        userId: user.id,
        kindergartenId: id,
        role: 'admin'
      }
    });

    if (!userRole) {
      throw new Error('Not authorized to delete this kindergarten');
    }

    // Delete all related records first
    await prisma.$transaction(async (tx) => {
      // Delete all user roles for this kindergarten
      await tx.userKindergartenRole.deleteMany({
        where: { kindergartenId: id }
      });

      // Delete all menus for this kindergarten
      await tx.menu.deleteMany({
        where: { kindergartenId: id }
      });

      // Delete all events for classrooms in this kindergarten
      await tx.event.deleteMany({
        where: {
          classroom: {
            kindergartenId: id
          }
        }
      });

      // Delete all children in classrooms of this kindergarten
      await tx.child.deleteMany({
        where: {
          classroom: {
            kindergartenId: id
          }
        }
      });

      // Delete all classrooms for this kindergarten
      await tx.classroom.deleteMany({
        where: { kindergartenId: id }
      });

      // Finally, delete the kindergarten itself
      await tx.kindergarten.delete({
        where: { id }
      });
    });

    return { message: 'Kindergarten deleted successfully' };
  } catch (error) {
    console.error('Error deleting kindergarten:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete kindergarten');
  }
} 