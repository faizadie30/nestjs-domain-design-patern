import { registerAs } from '@nestjs/config';

const origin = ['http://localhost:3004'];

export default registerAs('cors', () => ({
  origin: origin,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Accept-Language',
    'X-Requested-With',
    'Origin',
  ],
  maxAge: 0,
  credentials: true,
}));
