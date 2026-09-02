import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from "../src/lib/env";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient() {
    const connectionString = env.DATABASE_URL

    if (!connectionString) {
        throw new Error(
            'DATABASE_URL environment variable is not defined. ' +
            'Make sure you have a .env file with DATABASE_URL set.'
        )
    }

    const adapter = new PrismaPg({
        connectionString,
    })

    return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


async function seedApartments(condominiumId: string) {

    const torres = 10;
    const pisos = 5;
    const aptosPorPiso = 4;

    const apartments = [];

    for (let torre = 1; torre <= torres; torre++) {

        for (let piso = 1; piso <= pisos; piso++) {

            for (let apto = 1; apto <= aptosPorPiso; apto++) {

                const number = `${piso}0${apto}`; // 101,102,103,104

                apartments.push({
                    number,
                    tower: torre.toString(),
                    level: piso,
                    condominiumId
                });

            }

        }

    }

    await prisma.apartment.createMany({
        data: apartments,
        skipDuplicates: true
    });

    console.log("Apartments created:", apartments.length);
}

async function main() {
    if (!env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID) {
        console.log(env);
        throw new Error("NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID is not defined")
    } else {
        console.log(env);
    }
    // create condominium and associate admin in one step using upsert
    const condominium = await prisma.condominium.upsert({
        where: { id: env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID },
        update: {},
        create: {
            id: env.NEXT_PUBLIC_DEFAULT_CONDOMINIUM_ID,
            name: "Unidad Residencial Ejemplo",
        }
    });

    console.log("Initial condominium created");

    // create admin user and associate with condominium
    await prisma.user.upsert({
        where: { email: "admin@ejemplo.com" },
        update: {
            condominiumId: condominium.id
        },
        create: {
            id: "admin_007",
            name: "admin",
            email: "admin@ejemplo.com",
            password: "admin123",
            role: "ADMIN",
            condominiumId: condominium.id
        }
    });

    console.log("Initial admin created");

    if (!condominium) {
        throw new Error("Condominium not found")
    }

    await seedApartments(condominium.id)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());