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


async function seedApartamentos(clienteId: string) {

    const torres = 10;
    const pisos = 5;
    const aptosPorPiso = 4;

    const apartamentos = [];

    for (let torre = 1; torre <= torres; torre++) {

        for (let piso = 1; piso <= pisos; piso++) {

            for (let apto = 1; apto <= aptosPorPiso; apto++) {

                const numero = `${piso}0${apto}`; // 101,102,103,104

                apartamentos.push({
                    numero,
                    torre: torre.toString(),
                    nivel: piso,
                    clienteId
                });

            }

        }

    }

    await prisma.apartamento.createMany({
        data: apartamentos,
        skipDuplicates: true
    });

    console.log("Apartamentos creados:", apartamentos.length);
}

async function main() {

    // create cliente and associate admin in one step using upsert
    const cliente = await prisma.cliente.upsert({
        where: { id: env.NEXT_PUBLIC_DEFAULT_CLIENT_ID },
        update: {},
        create: {
            id: env.NEXT_PUBLIC_DEFAULT_CLIENT_ID,
            nombre: "Unidad Residencial Ejemplo",
        }
    });

    console.log("cliente inicial creado");

    // create admin user and associate with cliente
    await prisma.user.upsert({
        where: { email: "admin@ejemplo.com" },
        update: {
            clienteId: cliente.id
        },
        create: {
            id: "admin_007",
            name: "admin",
            email: "admin@ejemplo.com",
            password: "admin123",
            role: "ADMIN",
            clienteId: cliente.id
        }
    });

    console.log("admin inicial creado");

    if (!cliente) {
        throw new Error("Cliente no encontrado");
    }

    await seedApartamentos(cliente.id);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());