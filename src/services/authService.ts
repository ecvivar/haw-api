import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { config } from '../config';
import {
  UserConflictException,
  UserNotFoundException,
  UserUnauthorizedException,
  RoleBadRequestException,
} from '../utils/errors';
import { Role, UserDTO, UserRegistrationDTO, UserAuthDTO } from '../types';

function generateToken(user: { uuid: string; username: string; email: string; role: string }): string {
  const privateKey = config.jwt.privateKey;
  return jwt.sign(
    {
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    privateKey,
    {
      algorithm: 'RS256',
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
      expiresIn: '24h',
      jwtid: crypto.randomUUID(),
    },
  );
}

function isValidRole(name: string): boolean {
  return Object.values(Role).some(r => r === name.toUpperCase());
}

export class AuthService {
  async register(userData: UserRegistrationDTO): Promise<UserDTO> {
    const existingUsername = await prisma.user.findUnique({ where: { username: userData.username } });
    if (existingUsername) {
      throw new UserConflictException(`Username '${userData.username}' already registered!`);
    }

    const existingEmail = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingEmail) {
      throw new UserConflictException(`Email '${userData.email}' already registered!`);
    }

    if (userData.role) {
      if (!isValidRole(userData.role)) {
        throw new RoleBadRequestException(`Role '${userData.role}' is not valid!`);
      }

      const requiresAdmin = [Role.DEV, Role.MAINTAINER, Role.ADMIN].includes(userData.role.toUpperCase() as Role);

      if (requiresAdmin) {
        throw new UserUnauthorizedException(
          `Only user with ADMIN role can create users with role:'${userData.role}'`,
        );
      }
    } else {
      userData.role = Role.BASIC;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: (userData.role || Role.BASIC).toUpperCase(),
      },
    });

    const token = generateToken(user);
    return { username: user.username, role: user.role, token, token_type: 'Bearer' };
  }

  async authenticate(userAuth: UserAuthDTO): Promise<UserDTO> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userAuth.email },
          ...(userAuth.username ? [{ username: userAuth.username }] : []),
        ],
      },
    });

    if (!user) {
      throw new UserNotFoundException('User not found!');
    }

    const validPassword = await bcrypt.compare(userAuth.password, user.password);
    if (!validPassword) {
      throw new UserUnauthorizedException();
    }

    const token = generateToken(user);
    return {
      username: user.username,
      email: user.email,
      role: user.role,
      token,
      token_type: 'Bearer',
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }

  async delete(userAuth: UserAuthDTO): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { username: userAuth.username, email: userAuth.email },
    });

    if (!user) {
      throw new UserNotFoundException('User not found!');
    }

    const validPassword = await bcrypt.compare(userAuth.password, user.password);
    if (!validPassword) {
      throw new UserUnauthorizedException();
    }

    await prisma.user.delete({ where: { uuid: user.uuid } });
  }

  async getRole(authUser?: { role: string }): Promise<string> {
    if (authUser) {
      return `ROLE_${authUser.role}`;
    }
    return `ROLE_${Role.ANONYMOUS}`;
  }
}

export const authService = new AuthService();
