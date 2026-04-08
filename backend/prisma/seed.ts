import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding samples for Candidate autocompletion...');

  const candidatesData = [
    {
      firstName: 'Alba',
      lastName: 'García',
      email: 'alba.garcia@talentia.com',
      education: 'Universidad Autónoma de Madrid - Grado en ADE',
      experience: 'Project Manager en Amazon',
    },
    {
      firstName: 'Bruno',
      lastName: 'Díaz',
      email: 'bruno.diaz@wayne.com',
      education: 'EAE Business School - Master in Management',
      experience: 'Senior Executive at Wayne Enterprises',
    },
    {
      firstName: 'Carmen',
      lastName: 'Sánchez',
      email: 'carmen.sanchez@fintech.es',
      education: 'Universidad Complutense de Madrid - Ingeniería Informática',
      experience: 'Backend Developer en BBVA Next Technologies',
    },
    {
      firstName: 'David',
      lastName: 'López',
      email: 'david.lopez@cloudsolutions.com',
      education: 'UPM (Politécnica de Madrid) - Master en Cloud Computing',
      experience: 'Cloud Architect en Google Cloud',
    },
    {
      firstName: 'Elena',
      lastName: 'Vázquez',
      email: 'elena.vazquez@designlab.io',
      education: 'Istituto Europeo di Design (IED) - Grado en Diseño UX/UI',
      experience: 'Lead Product Designer en Glovo',
    },
  ];

  for (const candidate of candidatesData) {
    await prisma.candidate.upsert({
      where: { email: candidate.email },
      update: {},
      create: candidate,
    });
  }

  console.log('Seed completed. Added sample candidates for suggestions.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
