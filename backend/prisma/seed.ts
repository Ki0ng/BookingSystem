import { PrismaClient, Role, RoomStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting seeding...');

  // 1. Clean existing data in correct order (child tables first)
  console.log('🧹 Cleaning database...');
  await prisma.review.deleteMany();
  await prisma.image.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Amenities
  console.log('✨ Creating amenities...');
  const wifi = await prisma.amenity.create({ data: { name: 'Free Wi-Fi' } });
  const pool = await prisma.amenity.create({ data: { name: 'Swimming Pool' } });
  const gym = await prisma.amenity.create({ data: { name: 'Fitness Center' } });
  const spa = await prisma.amenity.create({ data: { name: 'Spa & Wellness' } });
  const parking = await prisma.amenity.create({ data: { name: 'Free Parking' } });
  const restaurant = await prisma.amenity.create({ data: { name: 'Restaurant' } });

  // 3. Create Users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@elitebooking.com',
      name: 'System Admin',
      password_hash: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@grandhotel.com',
      name: 'Hotel Manager',
      password_hash: hashedPassword,
      role: Role.MANAGER,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@gmail.com',
      name: 'John Doe',
      password_hash: hashedPassword,
      role: Role.USER,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@gmail.com',
      name: 'Jane Smith',
      password_hash: hashedPassword,
      role: Role.USER,
    },
  });

  // 4. Create Hotels with Images, Reviews, and Amenities
  console.log('🏨 Creating hotels...');
  
  // Hotel 1: Elite Grand Palace
  const hotel1 = await prisma.hotel.create({
    data: {
      name: 'Elite Grand Palace',
      ownerId: manager.id,
      address: '123 Luxury Street, Da Nang, Vietnam',
      description: 'Experience world-class service and breathtaking ocean views at Elite Grand Palace.',
      location_lat: 16.0544,
      location_lng: 108.2022,
      average_rating: 4.9,
      amenities: {
        connect: [{ id: wifi.id }, { id: pool.id }, { id: gym.id }, { id: restaurant.id }, { id: spa.id }]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200' },
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200' }
        ]
      },
      reviews: {
        create: [
          {
            rating: 5,
            comment: 'Absolutely stunning! The view from the infinity pool is unbeatable.',
            userId: customer1.id
          },
          {
            rating: 4,
            comment: 'Great service, though breakfast was a bit crowded.',
            userId: customer2.id
          }
        ]
      },
      rooms: {
        create: [
          {
            room_type: 'Deluxe Ocean View',
            base_price: 150.0,
            quantity: 10,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'King', balcony: true, size: '45sqm' },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800' }]
            }
          },
          {
            room_type: 'Presidential Suite',
            base_price: 500.0,
            quantity: 2,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'Super King', jacuzzi: true, private_pool: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800' }]
            }
          }
        ]
      }
    }
  });

  // Hotel 2: Mountain Retreat Resort
  const hotel2 = await prisma.hotel.create({
    data: {
      name: 'Mountain Retreat Resort',
      ownerId: manager.id,
      address: '456 Highland Road, Da Lat, Vietnam',
      description: 'A peaceful sanctuary nestled in the pine forests of Da Lat.',
      location_lat: 11.9404,
      location_lng: 108.4583,
      average_rating: 4.6,
      amenities: {
        connect: [{ id: wifi.id }, { id: parking.id }, { id: restaurant.id }]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200' }
        ]
      },
      reviews: {
        create: [
          {
            rating: 5,
            comment: 'The perfect place to escape the city heat. So quiet and fresh.',
            userId: customer2.id
          }
        ]
      },
      rooms: {
        create: [
          {
            room_type: 'Forest View Villa',
            base_price: 120.0,
            quantity: 5,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'Queen', fireplace: true, bathtub: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800' }]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Seeding finished successfully!');
  console.log(`- Created ${await prisma.user.count()} users`);
  console.log(`- Created ${await prisma.hotel.count()} hotels`);
  console.log(`- Created ${await prisma.amenity.count()} amenities`);
  console.log(`- Created ${await prisma.review.count()} reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
