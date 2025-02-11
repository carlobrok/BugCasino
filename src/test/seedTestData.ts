import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Typdefinitionen (optional, helfen bei der Typprüfung)
type User = {
  name: string;
  email: string;
  password: string;
  avatar: string;
  score?: number;
};

type Ticket = {
  title: string;
  description: string;
  authorId: number;
  timeEstimate: Date;
};

type Bet = {
  amount: number;
  userId: number;
  ticketId: number;
  doneInTime: boolean;
};

// Testdaten
const testUsers: User[] = [
  {
    name: "Johnny Knoxville",
    email: "johhni@pommi.lol",
    password: "hallo",
    avatar: "🤡",
    score: 1000,
  },
  {
    name: "Jane Doe",
    email: "annjfi@najk.de",
    password: "hallo",
    avatar: "👩",
    score: 1000,
  },
  {
    name: "Donald Duck",
    email: "darmsalat@mooo.doo",
    password: "hallo",
    avatar: "🦆",
    score: 1000,
  },
  {
    name: "Angelo Merte",
    email: "angy@mouse.com",
    password: "hallo",
    avatar: "🐭",
    score: 1000,
  },
  {
    name: "Montana Black",
    email: "saftsack@arsch.nh",
    password: "hallo",
    avatar: "🍊",
    score: 1000,
  },
];

const testTicekts: Ticket[] = [
  {
    title: "Buying an Alligator",
    description: "I just need an alligator!!!",
    authorId: 1,
    timeEstimate: new Date(new Date().getTime() + 5 * 60 * 60 * 1000),
  },
  {
    title: "Selling an Alligator",
    description: "Who wants to buy an alligator?",
    authorId: 1,
    timeEstimate: new Date(new Date().getTime() + 6 * 60 * 60 * 1000),
  },
  {
    title: "Alligator BBQ",
    description: "I heard they taste like chicken",
    authorId: 2,
    timeEstimate: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
  },
  {
    title: "Be aware of spy pigeons",
    description: "They are everywhere",
    authorId: 3,
    timeEstimate: new Date(new Date().getTime() + 10 * 60 * 60 * 1000),
  },
  {
    title: "The truth about the moon",
    description: "It's made out of cheese",
    authorId: 4,
    timeEstimate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
  },
  {
    title: "Agatha hat gekocht",
    description: "Beste Frau der Welt",
    authorId: 5,
    timeEstimate: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
  },
];

const testBets: Bet[] = [
  {
    amount: 100,
    userId: 1,
    ticketId: 1,
    doneInTime: true,
  },
  {
    amount: 200,
    userId: 2,
    ticketId: 2,
    doneInTime: true,
  },
  {
    amount: 300,
    userId: 3,
    ticketId: 3,
    doneInTime: true,
  },
  {
    amount: 400,
    userId: 4,
    ticketId: 4,
    doneInTime: true,
  },
  {
    amount: 500,
    userId: 5,
    ticketId: 5,
    doneInTime: true,
  },
  {
    amount: 600,
    userId: 1,
    ticketId: 6,
    doneInTime: true,
  },
];

// Hauptfunktion, die die Testdaten in die Datenbank schreibt
async function main() {
  // Testuser einfügen
  for (const user of testUsers) {
    await prisma.user.create({
      data: user,
    });
  }

  // Testtickets einfügen
  for (const ticket of testTicekts) {
    await prisma.ticket.create({
      data: ticket,
    });
  }

  // Testbets einfügen
  for (const bet of testBets) {
    await prisma.bet.create({
      data: bet,
    });
  }

  console.log('Testdaten wurden erfolgreich in die Datenbank eingefügt!');
}

// Ausführung des Skripts mit Fehlerbehandlung
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
