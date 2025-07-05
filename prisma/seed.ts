import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "john.doe@nexobiiz.devlincon.com.br" },
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@nexobiiz.devlincon.com.br",
        password: "securepassword",
        company: "NexoBiiz",
        cnpj: "12345678901234",
        phone: "1234567890",
      },
    });
    console.log(user);
  } else {
    console.log("Usuário já existe:", existingUser);
  }
}

async function seedScriptEvents() {
  const event = await prisma.scriptEvents.create({
    data: {
      scriptName: "init.js",
      eventType: "EXECUTION",
    },
  });
  console.log(event);
}

main()
  .then(() => seedScriptEvents())
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
