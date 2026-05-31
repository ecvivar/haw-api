import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  loadOverview, loadActors, loadCharacters,
  loadSeasons, loadEpisodes, loadLocations,
  loadGames, loadSoundtracks, loadUsers,
} from './import';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Delete all data in reverse dependency order
  await prisma.actorSocial.deleteMany();
  await prisma.episodeTranslation.deleteMany();
  await prisma.seasonTranslation.deleteMany();
  await prisma.gameTranslation.deleteMany();
  await prisma.locationTranslation.deleteMany();
  await prisma.overviewTranslation.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.season.deleteMany();
  await prisma.game.deleteMany();
  await prisma.location.deleteMany();
  await prisma.soundtrack.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.character.deleteMany();
  await prisma.overview.deleteMany();
  console.log('  Cleared existing data');

  const basePath = '/api/v1';

  // 1. Overview
  const overviewData = loadOverview();
  const overview = await prisma.overview.create({
    data: {
      href: `${basePath}/overview/overview`,
      languages: overviewData.data.languages,
      creators: overviewData.data.creators,
      sources: overviewData.data.sources,
      thumbnail: overviewData.data.thumbnail || null,
      translations: {
        create: overviewData.data.translations.map(t => ({
          language: t.language,
          title: t.title || '',
          description: t.description,
        })),
      },
    },
  });
  console.log(`  Overview: ${overview.uuid}`);

  // 2. Characters
  const characters = loadCharacters();
  for (const c of characters) {
    await prisma.character.create({
      data: {
        uuid: c.uuid,
        href: `${basePath}/characters/${c.uuid}`,
        firstName: c.firstName || null,
        lastName: c.lastName || null,
        nicknames: c.nicknames || [],
        gender: c.gender ?? null,
        birthDate: c.birthDate ? new Date(c.birthDate) : null,
        deathDate: c.deathDate ? new Date(c.deathDate) : null,
        actor: c.actor || null,
        images: c.images || [],
        sources: c.sources || [],
      },
    });
  }
  console.log(`  Characters: ${characters.length} records`);

  // 3. Actors (with socials)
  const actors = loadActors();
  for (const a of actors) {
    await prisma.actor.create({
      data: {
        uuid: a.uuid,
        href: `${basePath}/actors/${a.uuid}`,
        firstName: a.firstName,
        lastName: a.lastName,
        nicknames: a.nicknames || [],
        gender: a.gender ?? null,
        birthDate: a.birthDate ? new Date(a.birthDate) : null,
        deathDate: a.deathDate ? new Date(a.deathDate) : null,
        nationality: a.nationality || null,
        character: a.character,
        seasons: a.seasons || [],
        images: a.images || [],
        sources: a.sources || [],
        socials: a.socials ? { create: a.socials } : undefined,
      },
    });
  }
  console.log(`  Actors: ${actors.length} records`);

  // 4. Seasons
  const seasons = loadSeasons();
  for (const s of seasons) {
    await prisma.season.create({
      data: {
        uuid: s.uuid,
        href: `${basePath}/seasons/${s.uuid}`,
        durationTotal: s.durationTotal,
        seasonNum: s.seasonNum,
        releaseDate: new Date(s.releaseDate),
        episodes: s.episodes || [],
        budget: s.budget ?? null,
        images: s.images || [],
        sources: s.sources || [],
        nextSeason: s.nextSeason || null,
        prevSeason: s.prevSeason || null,
        translations: {
          create: s.translations.map(t => ({
            language: t.language,
            title: t.title || '',
            description: t.description,
            genres: t.genres || [],
            trailers: t.trailers || [],
          })),
        },
      },
    });
  }
  console.log(`  Seasons: ${seasons.length} records`);

  // 5. Episodes
  const episodes = loadEpisodes();
  for (const e of episodes) {
    await prisma.episode.create({
      data: {
        uuid: e.uuid,
        href: `${basePath}/episodes/${e.uuid}`,
        duration: e.duration,
        episodeNum: e.episodeNum,
        season: e.season,
        images: e.images || [],
        sources: e.sources || [],
        nextEpisode: e.nextEpisode || null,
        prevEpisode: e.prevEpisode || null,
        translations: {
          create: e.translations.map(t => ({
            language: t.language,
            title: t.title || '',
            description: t.description,
          })),
        },
      },
    });
  }
  console.log(`  Episodes: ${episodes.length} records`);

  // 6. Soundtracks
  const soundtracks = loadSoundtracks();
  for (const s of soundtracks) {
    await prisma.soundtrack.create({
      data: {
        uuid: s.uuid,
        href: `${basePath}/soundtracks/${s.uuid}`,
        name: s.name,
        duration: s.duration,
        artist: s.artist,
        album: s.album || null,
        releaseDate: new Date(s.releaseDate),
        urls: s.urls || [],
        sources: s.sources || [],
      },
    });
  }
  console.log(`  Soundtracks: ${soundtracks.length} records`);

  // 7. Locations
  const locations = loadLocations();
  for (const l of locations) {
    await prisma.location.create({
      data: {
        uuid: l.uuid,
        href: `${basePath}/locations/${l.uuid}`,
        images: l.images || [],
        sources: l.sources || [],
        translations: {
          create: l.translations.map(t => ({
            language: t.language,
            name: t.name || '',
            description: t.description,
          })),
        },
      },
    });
  }
  console.log(`  Locations: ${locations.length} records`);

  // 8. Users (admin)
  const users = loadUsers();
  for (const u of users) {
    const exists = await prisma.user.findUnique({ where: { username: u.username } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await prisma.user.create({
        data: {
          uuid: u.uuid,
          firstName: u.firstName,
          lastName: u.lastName,
          username: u.username,
          email: u.email,
          password: hashedPassword,
          role: u.role,
        },
      });
    }
  }
  console.log(`  Users: ${users.length} records (admin)`);

  // 9. Games
  const games = loadGames();
  for (const g of games) {
    await prisma.game.create({
      data: {
        uuid: g.uuid,
        href: `${basePath}/games/${g.uuid}`,
        playtime: g.playtime ?? null,
        ageRating: g.ageRating || null,
        releaseDate: new Date(g.releaseDate),
        website: g.website,
        stores: g.stores || [],
        modes: g.modes || [],
        platforms: g.platforms || [],
        publishers: g.publishers || [],
        developers: g.developers || [],
        tags: g.tags || [],
        images: g.images || [],
        sources: g.sources || [],
        translations: {
          create: g.translations.map(t => ({
            language: t.language,
            name: t.name || '',
            description: t.description,
            genres: t.genres || [],
            trailer: t.trailer || null,
          })),
        },
      },
    });
  }
  console.log(`  Games: ${games.length} records`);

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
