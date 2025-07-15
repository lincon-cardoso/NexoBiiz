import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "linkon789@gmail.com" },
  });

  if (!existingUser) {
    const hashedPassword = await argon2.hash("link2502");
    await prisma.user.create({
      data: {
        name: "Lincon Cardoso ",
        email: "linkon789@gmail.com",
        password: hashedPassword,
        company: "NexoBiiz-suporte",
        cnpj: "1334513564364",
        phone: "1234567830",
      },
    });
  }
}

async function seedScriptEvents() {
  await prisma.scriptEvents.create({
    data: {
      scriptName: "init.js",
      eventType: "EXECUTION",
    },
  });
}

main()
  .then(() => seedScriptEvents())
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
