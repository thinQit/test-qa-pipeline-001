import { prisma } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth';

async function main() {
  const existingTasks = await prisma.task.count();
  if (existingTasks === 0) {
    await prisma.task.create({
      data: {
        title: 'Welcome to your task list',
        description: 'Create, update, and complete tasks to stay productive.',
        completed: false
      }
    });
    await prisma.task.create({
      data: {
        title: 'Mark this task complete',
        description: 'Try toggling the completion status.',
        completed: true
      }
    });
  }

  const existingUsers = await prisma.user.count();
  if (existingUsers === 0) {
    const passwordHash = await hashPassword('password123');
    await prisma.user.create({
      data: {
        email: 'demo@todo.app',
        name: 'Demo User',
        passwordHash,
        role: 'customer'
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
