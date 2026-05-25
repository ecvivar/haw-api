import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const character = await prisma.character.create({
    data: {
      firstName: 'Eleven',
      lastName: 'Jane',
      nicknames: ['El', 'The Girl', 'Maggie'],
      gender: 1,
      birthDate: new Date('1971-01-01'),
      actor: 'Millie Bobby Brown',
      images: ['https://example.com/eleven.jpg'],
      sources: ['https://strangerthings.fandom.com/wiki/Eleven'],
      href: '/api/v1/characters/' + crypto.randomUUID(),
    },
  });

  const actor = await prisma.actor.create({
    data: {
      firstName: 'Millie',
      lastName: 'Bobby Brown',
      nicknames: ['Millie'],
      gender: 1,
      birthDate: new Date('2004-02-19'),
      nationality: 'British',
      character: 'Eleven',
      seasons: ['1', '2', '3', '4'],
      images: ['https://example.com/millie.jpg'],
      sources: ['https://en.wikipedia.org/wiki/Millie_Bobby_Brown'],
      href: '/api/v1/actors/' + crypto.randomUUID(),
      socials: {
        create: [
          { social: 'instagram', handle: '@milliebobbybrown', url: 'https://instagram.com/milliebobbybrown' },
          { social: 'twitter', handle: '@milliebbrown', url: 'https://twitter.com/milliebbrown' },
        ],
      },
    },
  });

  const episode = await prisma.episode.create({
    data: {
      duration: 47,
      episodeNum: 1,
      season: '1',
      images: ['https://example.com/ep1.jpg'],
      sources: [],
      href: '/api/v1/episodes/' + crypto.randomUUID(),
      translation: {
        create: {
          language: 'en-US',
          title: 'Chapter One: The Vanishing of Will Byers',
          description: 'On his way home from a friend\'s house, young Will Byers is attacked by a creature.',
        },
      },
    },
  });

  const season = await prisma.season.create({
    data: {
      durationTotal: 480,
      seasonNum: 1,
      releaseDate: new Date('2016-07-15'),
      episodes: ['1', '2', '3', '4', '5', '6', '7', '8'],
      budget: 36000000,
      images: ['https://example.com/s1.jpg'],
      sources: [],
      href: '/api/v1/seasons/' + crypto.randomUUID(),
      translation: {
        create: {
          language: 'en-US',
          title: 'Season 1',
          description: 'The first season of Stranger Things.',
          genres: ['Sci-Fi', 'Horror', 'Drama'],
          trailers: ['https://youtube.com/watch?v=bVq6sWnLM4M'],
        },
      },
    },
  });

  const soundtrack = await prisma.soundtrack.create({
    data: {
      name: 'Stranger Things Theme',
      duration: 120,
      artist: 'Kyle Dixon & Michael Stein',
      album: 'Stranger Things, Vol. 1',
      releaseDate: new Date('2016-08-12'),
      urls: ['https://open.spotify.com/track/0q2g5MnA8S6QHEJ4PkZeWB'],
      sources: [],
      href: '/api/v1/soundtracks/' + crypto.randomUUID(),
    },
  });

  const location = await prisma.location.create({
    data: {
      images: ['https://example.com/hawkins.jpg'],
      sources: [],
      href: '/api/v1/locations/' + crypto.randomUUID(),
      translation: {
        create: {
          language: 'en-US',
          name: 'Hawkins',
          description: 'Hawkins is a fictional town in Indiana.',
        },
      },
    },
  });

  const game = await prisma.game.create({
    data: {
      playtime: 480,
      ageRating: 'T',
      releaseDate: new Date('2019-07-04'),
      website: 'https://www.strangerthingsgame.com',
      stores: ['Steam', 'Xbox', 'PlayStation'],
      modes: ['Single-player'],
      platforms: ['PC', 'Xbox One', 'PS4', 'Nintendo Switch'],
      publishers: ['Netflix'],
      developers: ['BonusXP'],
      tags: ['Adventure', 'Puzzle'],
      images: ['https://example.com/game.jpg'],
      sources: [],
      href: '/api/v1/games/' + crypto.randomUUID(),
      translation: {
        create: {
          language: 'en-US',
          name: 'Stranger Things 3: The Game',
          description: 'A video game based on the third season.',
          genres: ['Adventure', 'Puzzle'],
          trailer: 'https://youtube.com/watch?v=example',
        },
      },
    },
  });

  const overview = await prisma.overview.create({
    data: {
      languages: ['en-US', 'pt-BR'],
      creators: ['The Duffer Brothers'],
      sources: [],
      href: '/api/v1/overview/' + crypto.randomUUID(),
      translation: {
        create: {
          language: 'en-US',
          title: 'Stranger Things',
          description: 'A Free and Open Source API for Stranger Things.',
        },
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log({ character, actor, episode, season, soundtrack, location, game, overview });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
