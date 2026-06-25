import { PrismaClient, Role, RoomStatus, BookingStatus, TransactionStatus, ApplicationStatus, ReviewStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting parameter seeding (preserving existing users)...');

  // 1. Clean existing transactional and parameter data in correct order (users are NOT deleted)
  console.log('🧹 Cleaning parameter tables (keeping users table)...');
  await prisma.reviewReply.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.image.deleteMany();
  await prisma.room.deleteMany();
  await prisma.managerApplication.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.amenity.deleteMany();

  // 2. Create Amenities
  console.log('✨ Creating/Recreating amenities...');
  const wifi = await prisma.amenity.create({ data: { name: 'Wi-Fi Miễn Phí' } });
  const pool = await prisma.amenity.create({ data: { name: 'Hồ Bơi Vô Cực' } });
  const gym = await prisma.amenity.create({ data: { name: 'Phòng Gym Hiện Đại' } });
  const spa = await prisma.amenity.create({ data: { name: 'Spa & Wellness' } });
  const parking = await prisma.amenity.create({ data: { name: 'Bãi Đỗ Xe Miễn Phí' } });
  const restaurant = await prisma.amenity.create({ data: { name: 'Nhà Hàng 5 Sao' } });
  const rooftopBar = await prisma.amenity.create({ data: { name: 'Rooftop Bar' } });
  const shuttle = await prisma.amenity.create({ data: { name: 'Đưa Đón Sân Bay' } });
  const roomService = await prisma.amenity.create({ data: { name: 'Dịch Vụ Phòng 24/7' } });

  // 3. Find existing users or create them ONLY if they don't exist
  console.log('👤 Checking and retrieving existing users...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  const getOrCreateUser = async (email: string, defaultData: any) => {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`👤 User ${email} not found, creating as fallback...`);
      user = await prisma.user.create({ data: { email, ...defaultData } });
    } else {
      console.log(`👤 Found existing user: ${email} (Preserved)`);
    }
    return user;
  };

  const getOrCreateUserByName = async (name: string, email: string, defaultRole: Role) => {
    let user = await prisma.user.findFirst({ where: { name } });
    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (!user) {
      console.log(`👤 User with name "${name}" not found, creating as fallback...`);
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone: '0987654321',
          password_hash: hashedPassword,
          role: defaultRole,
        }
      });
    } else {
      console.log(`👤 Found existing user: "${user.name}" (${user.email}) (Preserved)`);
    }
    return user;
  };

  const admin = await getOrCreateUser('admin@elitebooking.com', {
    name: 'Nguyễn Lâm Phong (Admin)',
    phone: '0901234567',
    password_hash: hashedPassword,
    role: Role.ADMIN,
  });

  const managerDanang = await getOrCreateUser('manager.danang@elitebooking.com', {
    name: 'Lê Minh Tuấn',
    phone: '0912345678',
    password_hash: hashedPassword,
    role: Role.MANAGER,
  });

  const managerHanoi = await getOrCreateUser('manager.hanoi@elitebooking.com', {
    name: 'Nguyễn Tuyết Mai',
    phone: '0923456789',
    password_hash: hashedPassword,
    role: Role.MANAGER,
  });

  const managerSaigon = await getOrCreateUser('manager.saigon@elitebooking.com', {
    name: 'Phạm Hoàng Nam',
    phone: '0934567890',
    password_hash: hashedPassword,
    role: Role.MANAGER,
  });

  const customer1 = await getOrCreateUser('khachhang1@gmail.com', {
    name: 'Nguyễn Văn Hùng',
    phone: '0945678901',
    password_hash: hashedPassword,
    role: Role.USER,
  });

  const customer2 = await getOrCreateUser('khachhang2@gmail.com', {
    name: 'Trần Thị Mai',
    phone: '0956789012',
    password_hash: hashedPassword,
    role: Role.USER,
  });

  const customer3 = await getOrCreateUser('khachhang3@gmail.com', {
    name: 'Phan Anh Tuấn',
    phone: '0967890123',
    password_hash: hashedPassword,
    role: Role.USER,
  });

  const customer4 = await getOrCreateUser('khachhang4@gmail.com', {
    name: 'Vũ Minh Hằng',
    phone: '0978901234',
    password_hash: hashedPassword,
    role: Role.USER,
  });

  // Retrieving the specific testing accounts
  const adminKinK = await getOrCreateUserByName('Kin K', 'kink@elitebooking.com', Role.ADMIN);
  const userToanLe = await getOrCreateUserByName('Toàn Lê', 'toanle@gmail.com', Role.USER);
  const partnerToanT = await getOrCreateUserByName('Toàn T', 'toant@elitebooking.com', Role.MANAGER);

  // 4. Create Manager Applications (Realistic data matching user status)
  console.log('📝 Creating manager applications...');
  await prisma.managerApplication.create({
    data: {
      userId: managerDanang.id,
      hotelName: 'InterContinental Danang Sun Peninsula Resort',
      hotelAddress: 'Bán đảo Sơn Trà, Quận Sơn Trà, Đà Nẵng',
      hotelDescription: 'Tọa lạc tại bán đảo Sơn Trà thơ mộng, khu nghỉ dưỡng siêu sang mang kiến trúc độc đáo.',
      businessLicense: 'https://res.cloudinary.com/elite-booking/image/upload/v1719281000/licenses/danang_license.jpg',
      phone: managerDanang.phone || '0912345678',
      status: ApplicationStatus.APPROVED,
      adminComment: 'Giấy chứng nhận an toàn PCCC & GPKD đầy đủ.',
    }
  });

  // Assign application to managerHanoi (Nguyễn Tuyết Mai)
  await prisma.managerApplication.create({
    data: {
      userId: managerHanoi.id,
      hotelName: 'Sofitel Legend Metropole Hanoi',
      hotelAddress: '15 Ngô Quyền, Quận Hoàn Kiếm, Hà Nội',
      hotelDescription: 'Được xây dựng từ năm 1901, Sofitel Legend Metropole là một kiệt tác lịch sử mang phong cách kiến trúc Pháp thuộc cổ kính giữa lòng thủ đô.',
      businessLicense: 'https://res.cloudinary.com/elite-booking/image/upload/v1719281004/licenses/metropole_license.pdf',
      phone: managerHanoi.phone || '0923456789',
      status: ApplicationStatus.APPROVED,
      adminComment: 'Giấy phép kinh doanh và chứng nhận xếp hạng 5 sao đầy đủ.',
    }
  });

  // Assign application to partnerToanT (Toàn T)
  await prisma.managerApplication.create({
    data: {
      userId: partnerToanT.id,
      hotelName: 'Grand Plaza Resort Hanoi',
      hotelAddress: '117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
      hotelDescription: 'Khách sạn dát vàng 5 sao đầu tiên tại Hà Nội, mang đậm phong cách hoàng gia Châu Âu cổ điển và sang trọng vượt bậc.',
      businessLicense: 'https://res.cloudinary.com/elite-booking/image/upload/v1719281001/licenses/grand_plaza_license.pdf',
      phone: partnerToanT.phone || '0987654321',
      status: ApplicationStatus.APPROVED,
      adminComment: 'Hồ sơ đầy đủ, giấy phép kinh doanh hợp lệ.',
    }
  });

  await prisma.managerApplication.create({
    data: {
      userId: managerSaigon.id,
      hotelName: 'The Reverie Saigon',
      hotelAddress: '22-36 Phố đi bộ Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      hotelDescription: 'Tọa lạc tại trung tâm thành phố năng động, The Reverie Saigon là biểu tượng lộng lẫy và tinh hoa thiết kế Italy độc bản.',
      businessLicense: 'https://res.cloudinary.com/elite-booking/image/upload/v1719281003/licenses/reverie_license.png',
      phone: managerSaigon.phone || '0934567890',
      status: ApplicationStatus.APPROVED,
      adminComment: 'Hồ sơ đạt chuẩn 5 sao quốc tế.',
    }
  });

  // Pending application 1: customer3 (Sapa Jade Hill Resort & Spa)
  await prisma.managerApplication.create({
    data: {
      userId: customer3.id,
      hotelName: 'Sapa Jade Hill Resort & Spa',
      hotelAddress: 'Ngõ 447 Đường Mường Hoa, Sa Pa, Lào Cai',
      hotelDescription: 'Khu nghỉ dưỡng núi độc đáo nằm sát thung lũng Mường Hoa thơ mộng.',
      businessLicense: 'https://res.cloudinary.com/elite-booking/image/upload/v1719281005/licenses/sapa_jade_license.png',
      phone: '0967890123',
      status: ApplicationStatus.PENDING,
    }
  });

  // Pending application 2: customer4 (Hạ Long Bay Cruise Resort)
  await prisma.managerApplication.create({
    data: {
      userId: customer4.id,
      hotelName: 'Hạ Long Bay Cruise Resort',
      hotelAddress: 'Cảng tàu quốc tế Hạ Long, Bãi Cháy, Hạ Long',
      hotelDescription: 'Du thuyền nghỉ dưỡng 5 sao sang trọng bậc nhất Vịnh Hạ Long.',
      businessLicense: 'https://res.cloudinary.com/elite-booking/image/upload/v1719281006/licenses/halong_cruise_license.pdf',
      phone: '0978901234',
      status: ApplicationStatus.PENDING,
    }
  });

  // 5. Create Hotels with Rooms, Amenities, and Images
  console.log('🏨 Creating hotels and rooms...');

  // Hotel 1: InterContinental Danang Sun Peninsula Resort (owned by managerDanang)
  const hotel1 = await prisma.hotel.create({
    data: {
      name: 'InterContinental Danang Sun Peninsula Resort',
      ownerId: managerDanang.id,
      address: 'Bán đảo Sơn Trà, Quận Sơn Trà, Đà Nẵng',
      description: 'Tọa lạc tại bán đảo Sơn Trà thơ mộng, khu nghỉ dưỡng siêu sang mang kiến trúc độc đáo kết hợp văn hóa Việt truyền thống và thiết kế hiện đại của KTS Bill Bensley. Nơi đây ôm trọn vịnh biển riêng tư xanh ngắt tuyệt đẹp.',
      location_lat: 16.1224,
      location_lng: 108.2635,
      average_rating: 4.9,
      review_count: 2,
      status: ApplicationStatus.APPROVED,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: pool.id },
          { id: gym.id },
          { id: spa.id },
          { id: restaurant.id },
          { id: rooftopBar.id },
          { id: shuttle.id },
          { id: roomService.id }
        ]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200' },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200' },
          { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200' }
        ]
      },
      rooms: {
        create: [
          {
            room_type: 'Classic Ocean View Room',
            base_price: 250.0,
            quantity: 15,
            capacity: 2,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'King Size', balcony: true, size: '54sqm', view: 'Ocean View' },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800' }]
            }
          },
          {
            room_type: 'Club Peninsula Suite',
            base_price: 450.0,
            quantity: 5,
            capacity: 3,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'Super King', balcony: true, size: '130sqm', jacuzzi: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800' }]
            }
          },
          {
            room_type: 'Royal Residence Private Pool',
            base_price: 1200.0,
            quantity: 2,
            capacity: 6,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: '2 King Beds', private_pool: true, size: '300sqm', private_chef: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800' }]
            }
          }
        ]
      }
    }
  });

  // Hotel 2: Sofitel Legend Metropole Hanoi (owned by managerHanoi)
  const hotel2 = await prisma.hotel.create({
    data: {
      name: 'Sofitel Legend Metropole Hanoi',
      ownerId: managerHanoi.id,
      address: '15 Ngô Quyền, Quận Hoàn Kiếm, Hà Nội',
      description: 'Được xây dựng từ năm 1901, Sofitel Legend Metropole là một kiệt tác lịch sử mang phong cách kiến trúc Pháp thuộc cổ kính giữa lòng thủ đô. Khách sạn đã đón tiếp nhiều nguyên thủ quốc gia và các nhân vật nổi tiếng.',
      location_lat: 21.0255,
      location_lng: 105.8568,
      average_rating: 4.8,
      review_count: 2,
      status: ApplicationStatus.APPROVED,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: pool.id },
          { id: gym.id },
          { id: spa.id },
          { id: restaurant.id },
          { id: roomService.id }
        ]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200' },
          { url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=1200' }
        ]
      },
      rooms: {
        create: [
          {
            room_type: 'Luxury Classic Room',
            base_price: 180.0,
            quantity: 20,
            capacity: 2,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'King Bed', size: '32sqm', style: 'French Colonial' },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800' }]
            }
          },
          {
            room_type: 'Grand Prestige Suite',
            base_price: 600.0,
            quantity: 3,
            capacity: 4,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'Super King', size: '100sqm', club_lounge_access: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800' }]
            }
          }
        ]
      }
    }
  });

  // Hotel 3: The Reverie Saigon (owned by managerSaigon)
  const hotel3 = await prisma.hotel.create({
    data: {
      name: 'The Reverie Saigon',
      ownerId: managerSaigon.id,
      address: '22-36 Phố đi bộ Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      description: 'Tọa lạc tại trung tâm thành phố năng động, The Reverie Saigon là biểu tượng lộng lẫy và tinh hoa thiết kế Italy độc bản. Khách sạn mang đến không gian nghỉ dưỡng hoàng gia tráng lệ đầy mê hoặc.',
      location_lat: 10.7725,
      location_lng: 106.7032,
      average_rating: 4.7,
      review_count: 1,
      status: ApplicationStatus.APPROVED,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: pool.id },
          { id: gym.id },
          { id: spa.id },
          { id: restaurant.id },
          { id: rooftopBar.id },
          { id: roomService.id }
        ]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200' },
          { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1200' }
        ]
      },
      rooms: {
        create: [
          {
            room_type: 'Deluxe City View',
            base_price: 200.0,
            quantity: 25,
            capacity: 2,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'King Bed', size: '43sqm', floor: 'High Floors', view: 'City View' },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200' }]
            }
          },
          {
            room_type: 'Reverie Suite',
            base_price: 800.0,
            quantity: 4,
            capacity: 4,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'Super King', size: '120sqm', customized_service: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200' }]
            }
          }
        ]
      }
    }
  });

  // Hotel 4: Grand Plaza Resort Hanoi (ASSIGNED to partnerToanT)
  const hotel4 = await prisma.hotel.create({
    data: {
      name: 'Grand Plaza Resort Hanoi',
      ownerId: partnerToanT.id,
      address: '117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
      description: 'Khách sạn dát vàng 5 sao đầu tiên tại Hà Nội, mang đậm phong cách hoàng gia Châu Âu cổ điển và sang trọng vượt bậc.',
      location_lat: 21.0076,
      location_lng: 105.7972,
      average_rating: 5.0,
      review_count: 2, // 2 reviews now
      status: ApplicationStatus.APPROVED,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: pool.id },
          { id: gym.id },
          { id: spa.id },
          { id: restaurant.id },
          { id: roomService.id }
        ]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200' }
        ]
      },
      rooms: {
        create: [
          {
            room_type: 'Deluxe Gold Room',
            base_price: 150.0,
            quantity: 30,
            capacity: 2,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'King Size', size: '45sqm', gold_plated: true, view: 'City View' },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800' }]
            }
          },
          {
            room_type: 'Presidential Suite Gold',
            base_price: 650.0,
            quantity: 2,
            capacity: 4,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: '2 Super King', size: '150sqm', private_bar: true, jacuzzi: true, butler_service: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800' }]
            }
          }
        ]
      }
    }
  });

  // Hotel 5: Hội An Ancient House Resort & Spa (ASSIGNED to partnerToanT)
  const hotel5 = await prisma.hotel.create({
    data: {
      name: 'Hội An Ancient House Resort & Spa',
      ownerId: partnerToanT.id,
      address: '377 Cửa Đại, Cẩm Châu, Hội An, Quảng Nam',
      description: 'Nằm giữa không gian làng quê mộc mạc của Hội An cổ kính, giữ nguyên thiết kế nhà cổ thuần Việt mái ngói rêu phong kết hợp tiện nghi cao cấp.',
      location_lat: 15.8824,
      location_lng: 108.3512,
      average_rating: 4.0,
      review_count: 2, // 2 reviews now
      status: ApplicationStatus.APPROVED,
      amenities: {
        connect: [
          { id: wifi.id },
          { id: pool.id },
          { id: parking.id },
          { id: restaurant.id },
          { id: shuttle.id }
        ]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1200' }
        ]
      },
      rooms: {
        create: [
          {
            room_type: 'Superior Ancient Garden View',
            base_price: 85.0,
            quantity: 18,
            capacity: 2,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: 'Queen Bed', size: '36sqm', terrace: true, garden_view: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800' }]
            }
          },
          {
            room_type: 'Ancient Family Suite',
            base_price: 145.0,
            quantity: 6,
            capacity: 4,
            status: RoomStatus.AVAILABLE,
            metadata: { bed: '1 Double & 2 Single Beds', size: '65sqm', kitchenette: true, pool_view: true },
            images: {
              create: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800' }]
            }
          }
        ]
      }
    }
  });

  // Fetch created rooms to link with bookings
  const roomsHotel1 = await prisma.room.findMany({ where: { hotelId: hotel1.id } });
  const roomsHotel2 = await prisma.room.findMany({ where: { hotelId: hotel2.id } });
  const roomsHotel3 = await prisma.room.findMany({ where: { hotelId: hotel3.id } });
  const roomsHotel4 = await prisma.room.findMany({ where: { hotelId: hotel4.id } });
  const roomsHotel5 = await prisma.room.findMany({ where: { hotelId: hotel5.id } });

  // 6. Create Reviews & Review Replies
  console.log('💬 Creating reviews and replies...');

  // Reviews for Hotel 1 (InterContinental Danang)
  const review1_1 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Khu nghỉ dưỡng siêu tuyệt vời! View biển từ hồ bơi vô cực cực kỳ đỉnh. Phòng ốc sang trọng, nhân viên chu đáo tận tình.',
      userId: customer1.id,
      hotelId: hotel1.id,
      status: ReviewStatus.APPROVED,
    }
  });

  await prisma.reviewReply.create({
    data: {
      reviewId: review1_1.id,
      managerId: managerDanang.id,
      message: 'Xin chào anh Hùng, rất vui vì gia đình mình đã có kỳ nghỉ trọn vẹn tại InterContinental Danang. Hy vọng sẽ được đón tiếp anh sớm nhất!',
    }
  });

  const review1_2 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent service and unique design. The private beach is clean and quiet. Definitely come back.',
      userId: customer2.id,
      hotelId: hotel1.id,
      status: ReviewStatus.APPROVED,
    }
  });

  // Reviews for Hotel 2 (Sofitel Hanoi)
  const review2_1 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Khách sạn cổ kính, dịch vụ hoàn hảo, vị trí trung tâm rất tiện đi bộ ra hồ Hoàn Kiếm. Bữa sáng tự chọn rất ngon miệng.',
      userId: customer3.id,
      hotelId: hotel2.id,
      status: ReviewStatus.APPROVED,
    }
  });

  await prisma.reviewReply.create({
    data: {
      reviewId: review2_1.id,
      managerId: managerHanoi.id,
      message: 'Cảm ơn anh Tuấn đã dành thời gian đánh giá. Metropole Hà Nội rất hân hạnh được phục vụ anh trong chuyến du lịch này!',
    }
  });

  const review2_2 = await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Phòng ốc hơi nhỏ một chút do kiến trúc cổ nhưng được bù lại dịch vụ chuẩn 5 sao và không gian ấm cúng tuyệt vời.',
      userId: customer4.id,
      hotelId: hotel2.id,
      status: ReviewStatus.APPROVED,
    }
  });

  // Reviews for Hotel 3 (Reverie Saigon)
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Xứng tầm khách sạn xa hoa bậc nhất Sài Gòn. Nội thất thiết kế phong cách hoàng gia Ý tinh xảo đến từng chi tiết.',
      userId: customer1.id,
      hotelId: hotel3.id,
      status: ReviewStatus.APPROVED,
    }
  });

  // Reviews for Hotel 4 (Grand Plaza - owned by partnerToanT)
  const review4_1 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Khách sạn vô cùng lộng lẫy, mọi góc ngách đều ngập tràn ánh kim. Nhân viên tiếp đón lịch sự. Phòng Deluxe Gold rộng rãi và sạch sẽ không tì vết. Sẽ quay lại!',
      userId: customer2.id,
      hotelId: hotel4.id,
      status: ReviewStatus.APPROVED,
    }
  });

  // Review reply authored by Toàn T
  await prisma.reviewReply.create({
    data: {
      reviewId: review4_1.id,
      managerId: partnerToanT.id,
      message: 'Rất cảm ơn chị Mai đã tin tưởng lựa chọn Grand Plaza Resort Hanoi cho kỳ nghỉ của mình. Sự hài lòng của quý khách là động lực lớn nhất để đội ngũ Toàn T chúng tôi hoàn thiện dịch vụ mỗi ngày.',
    }
  });

  const review4_2 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Quá sang trọng và đẳng cấp, dịch vụ dát vàng đỉnh cao ở Hà Nội.',
      userId: userToanLe.id,
      hotelId: hotel4.id,
      status: ReviewStatus.PENDING, // PENDING review for Toàn T to moderating/answering!
    }
  });

  // Reviews for Hotel 5 (Hội An Ancient House - owned by partnerToanT)
  const review5_1 = await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Không gian thanh bình, hồ bơi sạch và mát mẻ. Tuy nhiên, buổi tối có hơi nhiều muỗi ngoài ban công vì vườn cây rậm rạp. Khách sạn nên bổ sung thêm xịt chống muỗi trong phòng.',
      userId: customer1.id,
      hotelId: hotel5.id,
      status: ReviewStatus.APPROVED,
    }
  });

  // Review reply authored by Toàn T
  await prisma.reviewReply.create({
    data: {
      reviewId: review5_1.id,
      managerId: partnerToanT.id,
      message: 'Cảm ơn anh Hùng đã phản hồi rất chân thực về trải nghiệm của mình. Khách sạn của Toàn T đã ghi nhận ý kiến và trang bị sẵn lọ xịt tinh dầu chống muỗi thảo mộc trong tủ đồ của mỗi phòng từ hôm nay.',
    }
  });

  // 7. Create Bookings, Transactions & Notifications (with staggered dates to populate charts!)
  console.log('📅 Creating bookings, transactions, and notifications...');

  // Booking 1: Past completed booking (InterContinental Danang) - 6 days ago
  const date6DaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  const checkIn1 = new Date(date6DaysAgo);
  const checkOut1 = new Date(date6DaysAgo);
  checkOut1.setDate(checkOut1.getDate() + 3);

  await prisma.booking.create({
    data: {
      userId: customer1.id,
      roomId: roomsHotel1[0].id,
      checkIn: checkIn1,
      checkOut: checkOut1,
      totalPrice: roomsHotel1[0].base_price * 3, // $750
      status: BookingStatus.CONFIRMED,
      createdAt: date6DaysAgo,
      transactions: {
        create: {
          amount: roomsHotel1[0].base_price * 3,
          status: TransactionStatus.SUCCESS,
          payment_gateway_ref: 'PAY-VN-19827364-METROPOLIS',
          createdAt: date6DaysAgo,
        }
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer1.id,
      title: 'Đặt phòng thành công',
      message: `Đơn đặt phòng ${roomsHotel1[0].room_type} tại InterContinental Danang đã được xác nhận.`,
      type: 'SUCCESS',
      createdAt: date6DaysAgo,
    }
  });

  // Booking 2: Past confirmed booking (Sofitel Hanoi) - 4 days ago
  const date4DaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
  const checkIn2 = new Date(date4DaysAgo);
  const checkOut2 = new Date(date4DaysAgo);
  checkOut2.setDate(checkOut2.getDate() + 2);

  await prisma.booking.create({
    data: {
      userId: customer2.id,
      roomId: roomsHotel2[0].id,
      checkIn: checkIn2,
      checkOut: checkOut2,
      totalPrice: roomsHotel2[0].base_price * 2, // $360
      status: BookingStatus.CONFIRMED,
      createdAt: date4DaysAgo,
      transactions: {
        create: {
          amount: roomsHotel2[0].base_price * 2,
          status: TransactionStatus.SUCCESS,
          payment_gateway_ref: 'PAY-VN-90812739-METROPOLIS',
          createdAt: date4DaysAgo,
        }
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer2.id,
      title: 'Xác nhận đặt phòng',
      message: `Đơn đặt phòng ${roomsHotel2[0].room_type} tại Sofitel Legend Metropole Hanoi từ ngày ${checkIn2.toLocaleDateString('vi-VN')} đã thanh toán thành công.`,
      type: 'SUCCESS',
      createdAt: date4DaysAgo,
    }
  });

  // Booking 3: Pending future booking (The Reverie Saigon) - 3 days ago
  const date3DaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const checkIn3 = new Date();
  checkIn3.setDate(checkIn3.getDate() + 15);
  const checkOut3 = new Date();
  checkOut3.setDate(checkOut3.getDate() + 18);

  await prisma.booking.create({
    data: {
      userId: customer3.id,
      roomId: roomsHotel3[0].id,
      checkIn: checkIn3,
      checkOut: checkOut3,
      totalPrice: roomsHotel3[0].base_price * 3,
      status: BookingStatus.PENDING,
      createdAt: date3DaysAgo,
      transactions: {
        create: {
          amount: roomsHotel3[0].base_price * 3,
          status: TransactionStatus.PENDING,
          createdAt: date3DaysAgo,
        }
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer3.id,
      title: 'Đơn đặt phòng đang chờ thanh toán',
      message: `Vui lòng thanh toán đơn đặt phòng ${roomsHotel3[0].room_type} tại The Reverie Saigon để hoàn tất giao dịch.`,
      type: 'WARNING',
      createdAt: date3DaysAgo,
    }
  });

  // Booking 4: Cancelled booking (Grand Plaza Resort - owned by Toàn T) - 2 days ago
  const date2DaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const checkIn4 = new Date(date2DaysAgo);
  const checkOut4 = new Date(date2DaysAgo);
  checkOut4.setDate(checkOut4.getDate() + 4);

  await prisma.booking.create({
    data: {
      userId: customer4.id,
      roomId: roomsHotel4[1].id,
      checkIn: checkIn4,
      checkOut: checkOut4,
      totalPrice: roomsHotel4[1].base_price * 4,
      status: BookingStatus.CANCELLED,
      createdAt: date2DaysAgo,
      transactions: {
        create: {
          amount: roomsHotel4[1].base_price * 4,
          status: TransactionStatus.FAILED,
          createdAt: date2DaysAgo,
        }
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer4.id,
      title: 'Đơn đặt phòng đã hủy',
      message: `Đơn đặt phòng ${roomsHotel4[1].room_type} tại Grand Plaza Resort Hanoi đã bị hủy do giao dịch không thành công.`,
      type: 'ERROR',
      createdAt: date2DaysAgo,
    }
  });

  // Booking 5: Future confirmed booking (Hội An Ancient House - owned by Toàn T) - 1 day ago
  const date1DayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  const checkIn5 = new Date();
  checkIn5.setDate(checkIn5.getDate() + 10);
  const checkOut5 = new Date();
  checkOut5.setDate(checkOut5.getDate() + 12);

  await prisma.booking.create({
    data: {
      userId: customer1.id,
      roomId: roomsHotel5[0].id,
      checkIn: checkIn5,
      checkOut: checkOut5,
      totalPrice: roomsHotel5[0].base_price * 2, // $170.0
      status: BookingStatus.CONFIRMED,
      createdAt: date1DayAgo,
      transactions: {
        create: {
          amount: roomsHotel5[0].base_price * 2,
          status: TransactionStatus.SUCCESS,
          payment_gateway_ref: 'VNPAY-20260710-98317',
          createdAt: date1DayAgo,
        }
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer1.id,
      title: 'Đặt phòng thành công',
      message: `Đơn đặt phòng ${roomsHotel5[0].room_type} tại Hội An Ancient House Resort & Spa từ ngày ${checkIn5.toLocaleDateString('vi-VN')} đã được xác nhận.`,
      type: 'SUCCESS',
      createdAt: date1DayAgo,
    }
  });

  // ADDITIONAL BOOKING 6 (Grand Plaza - owned by Toàn T) - 5 days ago (staggered for chart)
  const date5DaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  const checkIn6 = new Date(date5DaysAgo);
  const checkOut6 = new Date(date5DaysAgo);
  checkOut6.setDate(checkOut6.getDate() + 3);

  await prisma.booking.create({
    data: {
      userId: customer2.id,
      roomId: roomsHotel4[0].id, // Deluxe Gold Room ($150)
      checkIn: checkIn6,
      checkOut: checkOut6,
      totalPrice: roomsHotel4[0].base_price * 3, // $450.0
      status: BookingStatus.CONFIRMED,
      createdAt: date5DaysAgo,
      transactions: {
        create: {
          amount: roomsHotel4[0].base_price * 3,
          status: TransactionStatus.SUCCESS,
          payment_gateway_ref: 'VNPAY-20260620-66778',
          createdAt: date5DaysAgo,
        }
      }
    }
  });

  // ADDITIONAL BOOKING 7 (Hội An Ancient House - owned by Toàn T) - 3 days ago (staggered for chart)
  const checkIn7 = new Date(date3DaysAgo);
  const checkOut7 = new Date(date3DaysAgo);
  checkOut7.setDate(checkOut7.getDate() + 2);

  await prisma.booking.create({
    data: {
      userId: userToanLe.id, // Booked by Toàn Lê!
      roomId: roomsHotel5[0].id, // Superior Ancient Garden View ($85)
      checkIn: checkIn7,
      checkOut: checkOut7,
      totalPrice: roomsHotel5[0].base_price * 2, // $170.0
      status: BookingStatus.CONFIRMED,
      createdAt: date3DaysAgo,
      transactions: {
        create: {
          amount: roomsHotel5[0].base_price * 2,
          status: TransactionStatus.SUCCESS,
          payment_gateway_ref: 'MOMO-20260622-44552',
          createdAt: date3DaysAgo,
        }
      }
    }
  });

  // 8. Seed notifications for Kin K, Toàn Lê, Toàn T (preserving accounts if they exist)
  console.log('🔔 Seeding notifications for Kin K (Admin)...');
  await prisma.notification.createMany({
    data: [
      {
        userId: adminKinK.id,
        title: 'Yêu cầu kiểm duyệt đối tác mới',
        message: 'Chủ khách sạn "Sapa Jade Hill Resort" đã gửi hồ sơ đăng ký hợp tác. Vui lòng kiểm tra và duyệt giấy phép.',
        type: 'WARNING',
        isRead: false,
      },
      {
        userId: adminKinK.id,
        title: 'Báo cáo doanh thu tuần',
        message: 'Hệ thống đã tự động kết xuất báo cáo tài chính tuần qua. Tổng doanh thu đạt $24,500.0, tăng 12% so với tuần trước.',
        type: 'SUCCESS',
        isRead: false,
      },
      {
        userId: adminKinK.id,
        title: 'Cảnh báo đăng nhập lạ',
        message: 'Có lượt đăng nhập tài khoản Admin từ địa chỉ IP lạ (113.161.22.45 - TP. Hồ Chí Minh) vào lúc 10:15 AM.',
        type: 'ERROR',
        isRead: false,
      },
      {
        userId: adminKinK.id,
        title: 'Sao lưu cơ sở dữ liệu thành công',
        message: 'Tiến trình sao lưu định kỳ cơ sở dữ liệu Postgres trên Neon Cloud hoàn tất thành công (dung lượng: 45.2 MB).',
        type: 'INFO',
        isRead: true,
      },
      {
        userId: adminKinK.id,
        title: 'Ý kiến phản hồi từ khách hàng',
        message: 'Người dùng Toàn Lê đã gửi một đánh giá phản hồi về chức năng tìm kiếm linh hoạt trên giao diện Web.',
        type: 'INFO',
        isRead: true,
      }
    ]
  });

  console.log('🔔 Seeding notifications for Toàn Lê (User)...');
  await prisma.notification.createMany({
    data: [
      {
        userId: userToanLe.id,
        title: 'Đặt phòng thành công 🏨',
        message: 'Đơn đặt phòng Deluxe Gold Room tại Grand Plaza Resort Hanoi của bạn đã được xác nhận (Mã đơn: BK-98273). Chúc bạn có một chuyến đi tuyệt vời!',
        type: 'SUCCESS',
        isRead: false,
      },
      {
        userId: userToanLe.id,
        title: 'Nhắc nhở lịch trình chuyến đi ✈️',
        message: 'Bạn có lịch nhận phòng tại InterContinental Danang vào ngày mai (26/06/2026). Vui lòng chuẩn bị giấy tờ tùy thân.',
        type: 'WARNING',
        isRead: false,
      },
      {
        userId: userToanLe.id,
        title: 'Ưu đãi hè đặc quyền dành riêng cho bạn 🎁',
        message: 'Mã giảm giá ELITEHE2026 giảm 15% tối đa $50 cho tất cả khách sạn tại Nha Trang đã được thêm vào ví của bạn.',
        type: 'SUCCESS',
        isRead: false,
      },
      {
        userId: userToanLe.id,
        title: 'Đơn đặt phòng đã bị hủy ❌',
        message: 'Đơn đặt phòng phòng Suite tại Sofitel Metropole Hanoi đã bị hủy do giao dịch thanh toán không thành công.',
        type: 'ERROR',
        isRead: true,
      },
      {
        userId: userToanLe.id,
        title: 'Hãy chia sẻ cảm nghĩ của bạn ✍️',
        message: 'Bạn đã hoàn thành kỳ nghỉ tại The Reverie Saigon tuần trước. Hãy dành 1 phút để đánh giá chất lượng phòng nhé.',
        type: 'INFO',
        isRead: true,
      }
    ]
  });

  console.log('🔔 Seeding notifications for Toàn T (Partner)...');
  await prisma.notification.createMany({
    data: [
      {
        userId: partnerToanT.id,
        title: 'Có lượt đặt phòng mới 🔔',
        message: 'Khách hàng Toàn Lê vừa đặt phòng "Deluxe Gold Room" từ ngày 10/07 - 12/07. Vui lòng chuẩn bị đón tiếp khách hàng.',
        type: 'SUCCESS',
        isRead: false,
      },
      {
        userId: partnerToanT.id,
        title: 'Nhận khoản thanh toán từ booking 💰',
        message: 'Tài khoản của bạn đã được cộng $300.0 cho giao dịch hoàn tất từ đơn đặt phòng của khách hàng Trần Thị Mai.',
        type: 'SUCCESS',
        isRead: false,
      },
      {
        userId: partnerToanT.id,
        title: 'Hồ sơ đối tác đã được phê duyệt 🎉',
        message: 'Chúc mừng bạn! Hồ sơ đăng ký làm Manager của bạn đã được duyệt thành công bởi Quản trị viên Kin K.',
        type: 'SUCCESS',
        isRead: true,
      },
      {
        userId: partnerToanT.id,
        title: 'Khách sạn của bạn đã hiển thị công khai',
        message: 'Khách sạn "Grand Plaza Resort Hanoi" của bạn đã được duyệt trạng thái APPROVED và bắt đầu hiển thị trên thanh tìm kiếm.',
        type: 'INFO',
        isRead: true,
      },
      {
        userId: partnerToanT.id,
        title: 'Khách hàng gửi đánh giá mới ⭐',
        message: 'Khách hàng Lê Hoàng Long vừa gửi đánh giá 5 sao cho khách sạn của bạn kèm lời nhắn: "Dịch vụ chuẩn hoàng gia!".',
        type: 'INFO',
        isRead: false,
      }
    ]
  });

  console.log('✅ Parameter seeding finished successfully!');
  console.log(`- Preserved ${await prisma.user.count()} users`);
  console.log(`- Created ${await prisma.hotel.count()} hotels`);
  console.log(`- Created ${await prisma.room.count()} rooms`);
  console.log(`- Created ${await prisma.amenity.count()} amenities`);
  console.log(`- Created ${await prisma.review.count()} reviews`);
  console.log(`- Created ${await prisma.reviewReply.count()} review replies`);
  console.log(`- Created ${await prisma.booking.count()} bookings`);
  console.log(`- Created ${await prisma.transaction.count()} transactions`);
  console.log(`- Created ${await prisma.notification.count()} notifications`);
  console.log(`- Created ${await prisma.managerApplication.count()} manager applications`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
