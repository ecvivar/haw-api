/**
 * @openapi
 * tags:
 *   - name: API
 *     description: API information and health check
 *   - name: Auth
 *     description: Authentication and user management
 *   - name: Characters
 *     description: Character operations
 *   - name: Actors
 *     description: Actor operations
 *   - name: Episodes
 *     description: Episode operations
 *   - name: Games
 *     description: Game operations
 *   - name: Locations
 *     description: Location operations
 *   - name: Seasons
 *     description: Season operations
 *   - name: Soundtracks
 *     description: Soundtrack operations
 *   - name: Overview
 *     description: Overview operations
 *   - name: Translations
 *     description: Aggregate translations for all entities
 *
 * components:
 *   parameters:
 *     page:
 *       name: page
 *       in: query
 *       required: false
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Page number
 *     size:
 *       name: size
 *       in: query
 *       required: false
 *       schema:
 *         type: integer
 *         default: 10
 *       description: Items per page
 *     language:
 *       name: language
 *       in: query
 *       required: false
 *       schema:
 *         type: string
 *         default: en-US
 *       description: Language code (e.g. en-US, pt-BR)
 *     uuid:
 *       name: uuid
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: Entity UUID
 *     languagePath:
 *       name: language
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Language code (e.g. en-US, pt-BR)
 *     socialName:
 *       name: name
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *       description: Social network name
 *
 *   schemas:
 *     ApiInfo:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         version:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *         docs:
 *           type: string
 *           format: uri
 *         github:
 *           type: string
 *           format: uri
 *         githubHome:
 *           type: string
 *           format: uri
 *         apiVersion:
 *           type: string
 *         apiPath:
 *           type: string
 *         apiBaseUrl:
 *           type: string
 *           format: uri
 *         license:
 *           type: string
 *         licenseUrl:
 *           type: string
 *           format: uri
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *         defaultLanguage:
 *           type: string
 *         enableRegistration:
 *           type: boolean
 *     Endpoints:
 *       type: object
 *       properties:
 *         api:
 *           type: string
 *         characters:
 *           type: string
 *         actors:
 *           type: string
 *         episodes:
 *           type: string
 *         games:
 *           type: string
 *         locations:
 *           type: string
 *         seasons:
 *           type: string
 *         soundtracks:
 *           type: string
 *         translations:
 *           type: string
 *         overview:
 *           type: string
 *     Base:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         href:
 *           type: string
 *           format: uri
 *         sources:
 *           type: array
 *           items:
 *             type: string
 *         thumbnail:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Character:
 *       allOf:
 *         - $ref: '#/components/schemas/Base'
 *         - type: object
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             nicknames:
 *               type: array
 *               items:
 *                 type: string
 *             birth_date:
 *               type: string
 *             death_date:
 *               type: string
 *             gender:
 *               type: integer
 *             actor:
 *               type: string
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *     CharacterInput:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         nicknames:
 *           type: array
 *           items:
 *             type: string
 *         birth_date:
 *           type: string
 *         death_date:
 *           type: string
 *         gender:
 *           type: integer
 *         actor:
 *           type: string
 *         source:
 *           type: string
 *         thumbnail:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     Actor:
 *       allOf:
 *         - $ref: '#/components/schemas/Base'
 *         - type: object
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             nicknames:
 *               type: array
 *               items:
 *                 type: string
 *             birth_date:
 *               type: string
 *             death_date:
 *               type: string
 *             gender:
 *               type: integer
 *             nationality:
 *               type: string
 *             seasons:
 *               type: array
 *               items:
 *                 type: string
 *             awards:
 *               type: array
 *               items:
 *                 type: string
 *             character:
 *               type: string
 *             socials:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActorSocial'
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *     ActorInput:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         nicknames:
 *           type: array
 *           items:
 *             type: string
 *         birth_date:
 *           type: string
 *         death_date:
 *           type: string
 *         gender:
 *           type: integer
 *         nationality:
 *           type: string
 *         seasons:
 *           type: array
 *           items:
 *             type: string
 *         awards:
 *           type: array
 *           items:
 *             type: string
 *         character:
 *           type: string
 *         source:
 *           type: string
 *         thumbnail:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     ActorSocial:
 *       type: object
 *       properties:
 *         social:
 *           type: string
 *         handle:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *     ActorSocialInput:
 *       type: object
 *       properties:
 *         social:
 *           type: string
 *         handle:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *     Episode:
 *       allOf:
 *         - $ref: '#/components/schemas/Base'
 *         - type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             language:
 *               type: string
 *             duration:
 *               type: integer
 *             episode_num:
 *               type: integer
 *             next_episode:
 *               type: string
 *             prev_episode:
 *               type: string
 *             season:
 *               type: string
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *     EpisodeInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         language:
 *           type: string
 *         duration:
 *           type: integer
 *         episode_num:
 *           type: integer
 *         next_episode:
 *           type: string
 *         prev_episode:
 *           type: string
 *         season:
 *           type: string
 *         source:
 *           type: string
 *         thumbnail:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     EpisodeTranslation:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     EpisodeTranslationInput:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     Game:
 *       allOf:
 *         - $ref: '#/components/schemas/Base'
 *         - type: object
 *           properties:
 *             playtime:
 *               type: integer
 *             age_rating:
 *               type: string
 *             stores:
 *               type: array
 *               items:
 *                 type: string
 *             modes:
 *               type: array
 *               items:
 *                 type: string
 *             platforms:
 *               type: array
 *               items:
 *                 type: string
 *             publishers:
 *               type: array
 *               items:
 *                 type: string
 *             developers:
 *               type: array
 *               items:
 *                 type: string
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *             release_date:
 *               type: string
 *             website:
 *               type: string
 *               format: uri
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *     GameInput:
 *       type: object
 *       properties:
 *         playtime:
 *           type: integer
 *         age_rating:
 *           type: string
 *         stores:
 *           type: array
 *           items:
 *             type: string
 *         modes:
 *           type: array
 *           items:
 *             type: string
 *         platforms:
 *           type: array
 *           items:
 *             type: string
 *         publishers:
 *           type: array
 *           items:
 *             type: string
 *         developers:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         release_date:
 *           type: string
 *         website:
 *           type: string
 *           format: uri
 *         source:
 *           type: string
 *         thumbnail:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     GameTranslation:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         trailer:
 *           type: string
 *           format: uri
 *     GameTranslationInput:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         trailer:
 *           type: string
 *           format: uri
 *     Location:
 *       allOf:
 *         - $ref: '#/components/schemas/Base'
 *         - type: object
 *           properties:
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *     LocationInput:
 *       type: object
 *       properties:
 *         source:
 *           type: string
 *         thumbnail:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     LocationTranslation:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     LocationTranslationInput:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Season:
 *       allOf:
 *         - $ref: '#/components/schemas/Base'
 *         - type: object
 *           properties:
 *             duration_total:
 *               type: integer
 *             season_num:
 *               type: integer
 *             release_date:
 *               type: string
 *             next_season:
 *               type: string
 *             prev_season:
 *               type: string
 *             episodes:
 *               type: array
 *               items:
 *                 type: string
 *             soundtracks:
 *               type: array
 *               items:
 *                 type: string
 *             budget:
 *               type: integer
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *     SeasonInput:
 *       type: object
 *       properties:
 *         duration_total:
 *           type: integer
 *         season_num:
 *           type: integer
 *         release_date:
 *           type: string
 *         next_season:
 *           type: string
 *         prev_season:
 *           type: string
 *         episodes:
 *           type: array
 *           items:
 *             type: string
 *         soundtracks:
 *           type: array
 *           items:
 *             type: string
 *         budget:
 *           type: integer
 *         source:
 *           type: string
 *         thumbnail:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     SeasonTranslation:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         trailers:
 *           type: array
 *           items:
 *             type: string
 *     SeasonTranslationInput:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         trailers:
 *           type: array
 *           items:
 *             type: string
 *     Soundtrack:
 *       allOf:
 *         - $ref: '#/components/schemas/Base'
 *         - type: object
 *           properties:
 *             name:
 *               type: string
 *             duration:
 *               type: integer
 *             artist:
 *               type: string
 *             album:
 *               type: string
 *             release_date:
 *               type: string
 *             urls:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uri
 *     SoundtrackInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         duration:
 *           type: integer
 *         artist:
 *           type: string
 *         album:
 *           type: string
 *         release_date:
 *           type: string
 *         urls:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         source:
 *           type: string
 *         thumbnail:
 *           type: string
 *     Overview:
 *       allOf:
 *         - $ref: '#/components/schemas/Base'
 *         - type: object
 *           properties:
 *             languages:
 *               type: array
 *               items:
 *                 type: string
 *             creators:
 *               type: array
 *               items:
 *                 type: string
 *     OverviewInput:
 *       type: object
 *       properties:
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *         creators:
 *           type: array
 *           items:
 *             type: string
 *         source:
 *           type: string
 *         thumbnail:
 *           type: string
 *     OverviewTranslation:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     OverviewTranslationInput:
 *       type: object
 *       properties:
 *         language:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     UserRegistration:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *     UserAuth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     User:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *         token:
 *           type: string
 *         token_type:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *         status:
 *           type: string
 *         method:
 *           type: string
 *         cause:
 *           type: string
 *         message:
 *           type: string
 *         timestamps:
 *           type: string
 *           format: date-time
 *         url:
 *           type: string
 *         params:
 *           type: object
 *     Translation:
 *       type: object
 *       properties:
 *         entity:
 *           type: string
 *         entity_uuid:
 *           type: string
 *           format: uuid
 *         language:
 *           type: string
 *         title:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Pagination:
 *       type: object
 *       properties:
 *         pageIndex:
 *           type: integer
 *         pageSize:
 *           type: integer
 *         pageTotal:
 *           type: integer
 *         itemTotal:
 *           type: integer
 */

/**
 * @openapi
 * /api:
 *   get:
 *     operationId: getApiInfo
 *     tags: [API]
 *     summary: Get API information
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiInfo'
 * /api/ping:
 *   get:
 *     operationId: ping
 *     tags: [API]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Pong response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Pong
 * /api/health:
 *   get:
 *     operationId: health
 *     tags: [API]
 *     summary: Health check with database status
 *     responses:
 *       200:
 *         description: Healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 database:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       503:
 *         description: Unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 database:
 *                   type: string
 *                 timestamp:
 *                   type: string
 * /api/v1/endpoints:
 *   get:
 *     operationId: getEndpoints
 *     tags: [API]
 *     summary: List all API endpoints
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Available endpoints
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Endpoints'
 */

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     operationId: authRegister
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict (username or email already exists)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/auth/authenticate:
 *   post:
 *     operationId: authAuthenticate
 *     tags: [Auth]
 *     summary: Authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAuth'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/auth/delete:
 *   post:
 *     operationId: authDelete
 *     tags: [Auth]
 *     summary: Delete authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAuth'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/v1/characters:
 *   get:
 *     operationId: getCharacters
 *     tags: [Characters]
 *     summary: Get all characters
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of characters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Character'
 *         headers:
 *           X-Pagination-Page-Index:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Size:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Total:
 *             schema:
 *               type: integer
 *           X-Pagination-Item-Total:
 *             schema:
 *               type: integer
 *   post:
 *     operationId: createCharacter
 *     tags: [Characters]
 *     summary: Create a new character
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CharacterInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Character created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/characters/random:
 *   get:
 *     operationId: getRandomCharacter
 *     tags: [Characters]
 *     summary: Get random character
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random character
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 * /api/v1/characters/{uuid}:
 *   get:
 *     operationId: getCharacterByUuid
 *     tags: [Characters]
 *     summary: Get character by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Character found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchCharacter
 *     tags: [Characters]
 *     summary: Update character by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CharacterInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Character updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteCharacter
 *     tags: [Characters]
 *     summary: Delete character by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Character deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/v1/actors:
 *   get:
 *     operationId: getActors
 *     tags: [Actors]
 *     summary: Get all actors
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of actors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actor'
 *         headers:
 *           X-Pagination-Page-Index:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Size:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Total:
 *             schema:
 *               type: integer
 *           X-Pagination-Item-Total:
 *             schema:
 *               type: integer
 *   post:
 *     operationId: createActor
 *     tags: [Actors]
 *     summary: Create a new actor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActorInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Actor created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/actors/random:
 *   get:
 *     operationId: getRandomActor
 *     tags: [Actors]
 *     summary: Get random actor
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random actor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 * /api/v1/actors/{uuid}:
 *   get:
 *     operationId: getActorByUuid
 *     tags: [Actors]
 *     summary: Get actor by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Actor found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchActor
 *     tags: [Actors]
 *     summary: Update actor by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActorInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Actor updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteActor
 *     tags: [Actors]
 *     summary: Delete actor by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Actor deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/actors/{uuid}/socials:
 *   get:
 *     operationId: getActorSocials
 *     tags: [Actors]
 *     summary: Get all socials for an actor
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of socials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActorSocial'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     operationId: createActorSocial
 *     tags: [Actors]
 *     summary: Create a social for an actor
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActorSocialInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Social created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActorSocial'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/actors/{uuid}/socials/random:
 *   get:
 *     operationId: getRandomActorSocial
 *     tags: [Actors]
 *     summary: Get random social for an actor
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random social
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActorSocial'
 * /api/v1/actors/{uuid}/socials/{name}:
 *   get:
 *     operationId: getActorSocialByName
 *     tags: [Actors]
 *     summary: Get social by name for an actor
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/socialName'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Social found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActorSocial'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchActorSocial
 *     tags: [Actors]
 *     summary: Update social by name for an actor
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/socialName'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActorSocialInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Social updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActorSocial'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteActorSocial
 *     tags: [Actors]
 *     summary: Delete social by name for an actor
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/socialName'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Social deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/v1/episodes:
 *   get:
 *     operationId: getEpisodes
 *     tags: [Episodes]
 *     summary: Get all episodes
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of episodes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Episode'
 *         headers:
 *           X-Pagination-Page-Index:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Size:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Total:
 *             schema:
 *               type: integer
 *           X-Pagination-Item-Total:
 *             schema:
 *               type: integer
 *   post:
 *     operationId: createEpisode
 *     tags: [Episodes]
 *     summary: Create a new episode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EpisodeInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Episode created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/episodes/random:
 *   get:
 *     operationId: getRandomEpisode
 *     tags: [Episodes]
 *     summary: Get random episode
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random episode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 * /api/v1/episodes/{uuid}:
 *   get:
 *     operationId: getEpisodeByUuid
 *     tags: [Episodes]
 *     summary: Get episode by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Episode found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchEpisode
 *     tags: [Episodes]
 *     summary: Update episode by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EpisodeInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Episode updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteEpisode
 *     tags: [Episodes]
 *     summary: Delete episode by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Episode deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/episodes/{uuid}/translations:
 *   get:
 *     operationId: getEpisodeTranslations
 *     tags: [Episodes]
 *     summary: Get all translations for an episode
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of translations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EpisodeTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     operationId: createEpisodeTranslation
 *     tags: [Episodes]
 *     summary: Create a translation for an episode
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EpisodeTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Translation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpisodeTranslation'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/episodes/{uuid}/translations/random:
 *   get:
 *     operationId: getRandomEpisodeTranslation
 *     tags: [Episodes]
 *     summary: Get random translation for an episode
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random translation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpisodeTranslation'
 * /api/v1/episodes/{uuid}/translations/{language}:
 *   get:
 *     operationId: getEpisodeTranslationByLanguage
 *     tags: [Episodes]
 *     summary: Get translation by language for an episode
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpisodeTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchEpisodeTranslation
 *     tags: [Episodes]
 *     summary: Update translation by language for an episode
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EpisodeTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpisodeTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteEpisodeTranslation
 *     tags: [Episodes]
 *     summary: Delete translation by language for an episode
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Translation deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/v1/games:
 *   get:
 *     operationId: getGames
 *     tags: [Games]
 *     summary: Get all games
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *         headers:
 *           X-Pagination-Page-Index:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Size:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Total:
 *             schema:
 *               type: integer
 *           X-Pagination-Item-Total:
 *             schema:
 *               type: integer
 *   post:
 *     operationId: createGame
 *     tags: [Games]
 *     summary: Create a new game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Game created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/games/random:
 *   get:
 *     operationId: getRandomGame
 *     tags: [Games]
 *     summary: Get random game
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 * /api/v1/games/{uuid}:
 *   get:
 *     operationId: getGameByUuid
 *     tags: [Games]
 *     summary: Get game by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Game found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchGame
 *     tags: [Games]
 *     summary: Update game by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Game updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteGame
 *     tags: [Games]
 *     summary: Delete game by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Game deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/games/{uuid}/translations:
 *   get:
 *     operationId: getGameTranslations
 *     tags: [Games]
 *     summary: Get all translations for a game
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of translations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     operationId: createGameTranslation
 *     tags: [Games]
 *     summary: Create a translation for a game
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Translation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameTranslation'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/games/{uuid}/translations/random:
 *   get:
 *     operationId: getRandomGameTranslation
 *     tags: [Games]
 *     summary: Get random translation for a game
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random translation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameTranslation'
 * /api/v1/games/{uuid}/translations/{language}:
 *   get:
 *     operationId: getGameTranslationByLanguage
 *     tags: [Games]
 *     summary: Get translation by language for a game
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchGameTranslation
 *     tags: [Games]
 *     summary: Update translation by language for a game
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteGameTranslation
 *     tags: [Games]
 *     summary: Delete translation by language for a game
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Translation deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/v1/locations:
 *   get:
 *     operationId: getLocations
 *     tags: [Locations]
 *     summary: Get all locations
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *         headers:
 *           X-Pagination-Page-Index:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Size:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Total:
 *             schema:
 *               type: integer
 *           X-Pagination-Item-Total:
 *             schema:
 *               type: integer
 *   post:
 *     operationId: createLocation
 *     tags: [Locations]
 *     summary: Create a new location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Location created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/locations/random:
 *   get:
 *     operationId: getRandomLocation
 *     tags: [Locations]
 *     summary: Get random location
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 * /api/v1/locations/{uuid}:
 *   get:
 *     operationId: getLocationByUuid
 *     tags: [Locations]
 *     summary: Get location by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Location found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchLocation
 *     tags: [Locations]
 *     summary: Update location by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Location updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteLocation
 *     tags: [Locations]
 *     summary: Delete location by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Location deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/locations/{uuid}/translations:
 *   get:
 *     operationId: getLocationTranslations
 *     tags: [Locations]
 *     summary: Get all translations for a location
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of translations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     operationId: createLocationTranslation
 *     tags: [Locations]
 *     summary: Create a translation for a location
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Translation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationTranslation'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/locations/{uuid}/translations/random:
 *   get:
 *     operationId: getRandomLocationTranslation
 *     tags: [Locations]
 *     summary: Get random translation for a location
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random translation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationTranslation'
 * /api/v1/locations/{uuid}/translations/{language}:
 *   get:
 *     operationId: getLocationTranslationByLanguage
 *     tags: [Locations]
 *     summary: Get translation by language for a location
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchLocationTranslation
 *     tags: [Locations]
 *     summary: Update translation by language for a location
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteLocationTranslation
 *     tags: [Locations]
 *     summary: Delete translation by language for a location
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Translation deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/v1/seasons:
 *   get:
 *     operationId: getSeasons
 *     tags: [Seasons]
 *     summary: Get all seasons
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of seasons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Season'
 *         headers:
 *           X-Pagination-Page-Index:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Size:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Total:
 *             schema:
 *               type: integer
 *           X-Pagination-Item-Total:
 *             schema:
 *               type: integer
 *   post:
 *     operationId: createSeason
 *     tags: [Seasons]
 *     summary: Create a new season
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeasonInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Season created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/seasons/random:
 *   get:
 *     operationId: getRandomSeason
 *     tags: [Seasons]
 *     summary: Get random season
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random season
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 * /api/v1/seasons/{uuid}:
 *   get:
 *     operationId: getSeasonByUuid
 *     tags: [Seasons]
 *     summary: Get season by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Season found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchSeason
 *     tags: [Seasons]
 *     summary: Update season by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeasonInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Season updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteSeason
 *     tags: [Seasons]
 *     summary: Delete season by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Season deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/seasons/{uuid}/translations:
 *   get:
 *     operationId: getSeasonTranslations
 *     tags: [Seasons]
 *     summary: Get all translations for a season
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of translations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SeasonTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     operationId: createSeasonTranslation
 *     tags: [Seasons]
 *     summary: Create a translation for a season
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeasonTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Translation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeasonTranslation'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/seasons/{uuid}/translations/random:
 *   get:
 *     operationId: getRandomSeasonTranslation
 *     tags: [Seasons]
 *     summary: Get random translation for a season
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random translation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeasonTranslation'
 * /api/v1/seasons/{uuid}/translations/{language}:
 *   get:
 *     operationId: getSeasonTranslationByLanguage
 *     tags: [Seasons]
 *     summary: Get translation by language for a season
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeasonTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchSeasonTranslation
 *     tags: [Seasons]
 *     summary: Update translation by language for a season
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeasonTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeasonTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteSeasonTranslation
 *     tags: [Seasons]
 *     summary: Delete translation by language for a season
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Translation deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/v1/translations:
 *   get:
 *     operationId: getTranslations
 *     tags: [Translations]
 *     summary: Get all translations across entities
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of translations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Translation'
 *         headers:
 *           X-Pagination-Page-Index:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Size:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Total:
 *             schema:
 *               type: integer
 *           X-Pagination-Item-Total:
 *             schema:
 *               type: integer
 */

/**
 * @openapi
 * /api/v1/soundtracks:
 *   get:
 *     operationId: getSoundtracks
 *     tags: [Soundtracks]
 *     summary: Get all soundtracks
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of soundtracks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Soundtrack'
 *         headers:
 *           X-Pagination-Page-Index:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Size:
 *             schema:
 *               type: integer
 *           X-Pagination-Page-Total:
 *             schema:
 *               type: integer
 *           X-Pagination-Item-Total:
 *             schema:
 *               type: integer
 *   post:
 *     operationId: createSoundtrack
 *     tags: [Soundtracks]
 *     summary: Create a new soundtrack
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SoundtrackInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Soundtrack created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soundtrack'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/soundtracks/random:
 *   get:
 *     operationId: getRandomSoundtrack
 *     tags: [Soundtracks]
 *     summary: Get random soundtrack
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Random soundtrack
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soundtrack'
 * /api/v1/soundtracks/{uuid}:
 *   get:
 *     operationId: getSoundtrackByUuid
 *     tags: [Soundtracks]
 *     summary: Get soundtrack by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *       - $ref: '#/components/parameters/language'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Soundtrack found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soundtrack'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchSoundtrack
 *     tags: [Soundtracks]
 *     summary: Update soundtrack by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SoundtrackInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Soundtrack updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soundtrack'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteSoundtrack
 *     tags: [Soundtracks]
 *     summary: Delete soundtrack by UUID
 *     parameters:
 *       - $ref: '#/components/parameters/uuid'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Soundtrack deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /api/v1/overview:
 *   get:
 *     operationId: getOverview
 *     tags: [Overview]
 *     summary: Get overview
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Overview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Overview'
 *   post:
 *     operationId: createOverview
 *     tags: [Overview]
 *     summary: Create overview
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OverviewInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Overview created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Overview'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchOverview
 *     tags: [Overview]
 *     summary: Update overview
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OverviewInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Overview updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Overview'
 *   delete:
 *     operationId: deleteOverview
 *     tags: [Overview]
 *     summary: Delete overview
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Overview deleted
 * /api/v1/overview/translations:
 *   get:
 *     operationId: getOverviewTranslations
 *     tags: [Overview]
 *     summary: Get all overview translations
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of translations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OverviewTranslation'
 *   post:
 *     operationId: createOverviewTranslation
 *     tags: [Overview]
 *     summary: Create overview translation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OverviewTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       201:
 *         description: Translation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OverviewTranslation'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/v1/overview/translations/{language}:
 *   get:
 *     operationId: getOverviewTranslationByLanguage
 *     tags: [Overview]
 *     summary: Get overview translation by language
 *     parameters:
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OverviewTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: patchOverviewTranslation
 *     tags: [Overview]
 *     summary: Update overview translation by language
 *     parameters:
 *       - $ref: '#/components/parameters/languagePath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OverviewTranslationInput'
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Translation updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OverviewTranslation'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     operationId: deleteOverviewTranslation
 *     tags: [Overview]
 *     summary: Delete overview translation by language
 *     parameters:
 *       - $ref: '#/components/parameters/languagePath'
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Translation deleted
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Dummy export to force TypeScript to preserve all @openapi JSDoc blocks
export const __swagger = true;
