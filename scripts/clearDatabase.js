const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearDatabase() {
    try {
        await prisma.friendship.deleteMany({});
        // await prisma.user.deleteMany({});
        await prisma.post.deleteMany({});
        await prisma.comment.deleteMany({});
        await prisma.like.deleteMany({});
        await prisma.message.deleteMany({});
        console.log('All data has been deleted successfully.');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
