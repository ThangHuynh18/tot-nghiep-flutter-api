const products = [
  {
    name: 'Chuột có dây Logitech B100 910-001439',
    images: [
      {
        imageName: 'chuot-co-day-logitech-b100-910-001439-0.png',
        imageLink: '/images/chuot-co-day-logitech-b100-910-001439-0.png',
      },
    ],
    description:
      'Tạo sự thoải mái cho bàn tay. Bạn sẽ tận hưởng khả năng điều khiển con trỏ mượt mà, theo dõi chính xác và lựa chọn văn bản dễ dàng. Được thiết kế để cả hai tay được dễ chịu. Do đó bạn sẽ cảm thấy thoải mái, ngay cả sau hàng giờ sử dụng. Tay của bạn sẽ thoải mái hơn so với sử dụng bàn di chuột.',
    discount: 0,
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 80000,
    countInStock: 100,
    rating: 0,
    numReviews: 0,
    slug: 'chuot-co-day-logitech-b100-910-001439',
  },
  {
    name: 'Chuột không dây Logitech MX Master 3 For Mac 910-005700',
    images: [
      {
        imageName:
          'chuot-khong-day-logitech-mx-master-3-for-mac-910-005700-1.png',
        imageLink:
          '/images/chuot-khong-day-logitech-mx-master-3-for-mac-910-005700-1.png',
      },
    ],
    description:
      'Bánh lăn điện từ MagSpeed cho độ chính xác đến từng pixel và nhanh tới mức có thể scroll tới 1000 dòng trong 1 lần. Được gia công từ vật liệu thép tạo độ nhám và đủ nặng để tạo lực quán tính động để bạn cảm nhận được nhưng không thể nghe thấy.',
    discount: 0,
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 2090000,
    countInStock: 70,
    rating: 0,
    numReviews: 0,
    slug: 'chuot-khong-day-logitech-mx-master-3-for-mac-910-005700',
  },
  {
    name: 'Chuột Corsair M55 RGB PRO White CH-9308111-AP',
    images: [
      {
        imageName: 'chuot-corsair-m55-rgb-pro-white-ch-9308111-ap-0.png',
        imageLink:
          '/images/chuot-corsair-m55-rgb-pro-white-ch-9308111-ap-0.png',
      },
    ],
    description:
      'Chuột Corsair M55 RGB PRO mang thiết kế đối xứng phù hợp với cả người thuận tay trái và tay phải với trọng lượng siêu nhẹ chỉ 86g, chuột gaming phù hợp với nhiều cách cầm chuột, sản phẩm phù hợp với nhiều đối tượng sử dụng.',
    discount: 0,
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 1150000,
    countInStock: 50,
    rating: 0,
    numReviews: 0,
    slug: 'chuot-corsair-m55-rgb-pro-white-ch-9308111-ap',
  },
  {
    name: 'Chuột Gaming Razer DeathAdder Essential',
    images: [
      {
        imageName: 'chuot-gaming-razer-deathadder-essential.png',
        imageLink: '/images/chuot-gaming-razer-deathadder-essential.png',
      },
    ],
    description:
      'Kiểu dáng công thái học cổ điển vốn là dấu ấn của các thế hệ Razer DeathAdder trước đây. Thân bóng bẩy và khác biệt của nó được thiết kế để tạo sự thoải mái, cho phép bạn duy trì mức hiệu suất cao trong suốt buổi chơi game kéo dài, vì vậy bạn sẽ không bao giờ chùn bước trước sức nóng của trận chiến.',
    discount: 0,
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 1190000,
    countInStock: 110,
    rating: 0,
    numReviews: 0,
    slug: 'chuot-gaming-razer-deathadder-essential',
  },
  {
    name: 'Bàn phím không dây Logitech K270 920-003057',
    images: [
      {
        imageName: 'ban-phim-khong-day-logitech-k270-920-003057-1.png',
        imageLink: '/images/ban-phim-khong-day-logitech-k270-920-003057-1.png',
      },
    ],
    description:
      'Tuổi thọ pin lên tới 24 tháng, loại bỏ rắc rối khi phải thay pin thường xuyên, với phím bật/tắt thuận tiện và công nghệ tiết kiệm năng lượng để duy trì tuổi thọ pin.',
    discount: 0,
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 490000,
    countInStock: 70,
    rating: 0,
    numReviews: 0,
    slug: 'ban-phim-khong-day-logitech-k270-920-003057',
  },
  {
    name: 'Bàn phím cơ TKL Corsair K63 Mx Red CH-9115020-NA',
    images: [
      {
        imageName: 'ban-phim-co-corsair-k63-mx-red-ch-9115020-na-3.png',
        imageLink: '/images/ban-phim-co-corsair-k63-mx-red-ch-9115020-na-3.png',
      },
    ],
    discount: 0,
    description:
      'Bàn phím CORSAIR K63 có thiết kế Tenkeyless và trang bị phím cơ Cherry MX Red mang đến hiệu suất cao nhất. Đèn nền LED màu đỏ cho từng phím cho phép điều chỉnh ánh sáng chuyển động hầu như không giới hạn.',
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 2190000,
    countInStock: 120,
    rating: 0,
    numReviews: 0,
    slug: 'ban-phim-co-tkl-corsair-k63-mx-red-ch-9115020-na',
  },
  {
    name: 'Bàn phím giả cơ Logitech Prodigy RGB G213 920-008096',
    images: [
      {
        imageName: 'ban-phim-gia-co-logitech-prodigy-rgb-g213-1.webp',
        imageLink: '/images/ban-phim-gia-co-logitech-prodigy-rgb-g213-1.webp',
      },
    ],
    discount: 0,
    description:
      'Bàn phím chơi game G213 thiết kế các phím Logitech G Mech-Dome được điều chỉnh đặc biệt để mang lại phản ứng xúc giác vượt trội và cấu hình hiệu suất tổng thể tương tự như bàn phím cơ. Các phím Mech-Dome có chiều cao tối đa, cung cấp khoảng cách di chuyển đầy đủ 4 mm, lực tác động 50 g và cho âm thanh yên tĩnh.',
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 1490000,
    countInStock: 30,
    rating: 0,
    numReviews: 0,
    slug: 'ban-phim-gia-co-logitech-prodigy-rgb-g213-920-008096',
  },
  {
    name: 'Tai Nghe Gaming Razer BlackShark V2 X 7.1 Surround RZ04-03240100-R3M1',
    images: [
      {
        imageName:
          'tai-nghe-gaming-razer-blackshark-v2-x-7-1-surround-rz04-03240100-r3m1-1.png',
        imageLink:
          '/images/tai-nghe-gaming-razer-blackshark-v2-x-7-1-surround-rz04-03240100-r3m1-1.png',
      },
    ],
    discount: 0,
    description:
      'Thiết kế màng loa 50mm để tăng cường trải nghiệm âm thanh phong phú giúp tăng khả năng chơi game của bạn, tạo ra các âm tần và âm trung rõ ràng cũng như âm trầm sâu.',
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 1990000,
    countInStock: 30,
    rating: 0,
    numReviews: 0,
    slug: 'tai-nghe-gaming-razer-blackshark-v2-x-71-surround-rz04-03240100-r3m1',
  },
  {
    name: 'Ram PC Kingston 4GB 2666MHz DDR4 KVR26N19S6/4',
    images: [
      {
        imageName: 'ram-pc-kingston-kvr26n19s64-1.jpg',
        imageLink: '/images/ram-pc-kingston-kvr26n19s64-1.jpg',
      },
    ],
    discount: 0,
    description:
      'Ram PC Kingston DDR4 4GB Bus 2666MHz 1.2v phá vỡ mọi giới hạn tốc độ của DDR4 khỏi tình trạng bị thắt cổ chai. Cải thiện hiệu suất máy tính, tiết kiệm năng lượng hơn và dung lượng lớn hơn rất nhiều, hỗ trợ tất cả các dòng vi xử lý thế hệ mới nhất.',
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 790000,
    countInStock: 30,
    rating: 0,
    numReviews: 0,
    slug: 'ram-pc-kingston-4gb-2666mhz-ddr4-kvr26n19s64',
  },
  {
    name: 'Ram PC Corsair Vengeance LPX 8GB 3000MHz DDR4 CMK8GX4M1D3000C16',
    images: [
      {
        imageName:
          'corsair-ddr4-2400-bl-00-0c2db47a-bbee-4872-93a6-de698a081b65.jpg',
        imageLink:
          '/images/corsair-ddr4-2400-bl-00-0c2db47a-bbee-4872-93a6-de698a081b65.jpg',
      },
    ],
    discount: 0,
    description:
      'Ram Corsair được thiết kế sản xuất và thử nghiệm cực kì chặt chẽ để đảm bảo hiệu suất và khả năng tương thích hoàn hảo nhất trên hầu hết tất cả các bo mạch chủ Intel 100 Series,Intel 200 Series,Intel 300 Series,Intel 400 Series,Intel X299 Series trên thị trường.',
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 1390000,
    countInStock: 30,
    rating: 0,
    numReviews: 0,
    slug: 'ram-pc-corsair-vengeance-lpx-8gb-3000mhz-ddr4-cmk8gx4m1d3000c16',
  },
  {
    name: 'SSD Kingston A400 2.5-Inch SATA III 120GB SA400S37/120G',
    images: [
      {
        imageName: 'a400-01.jpg',
        imageLink: '/images/a400-01.jpg',
      },
    ],
    discount: 0,
    description:
      'Ổ cứng SSD Kingston A400 Series của Kingston giúp cải thiện tối đa hiệu năng của hệ thống hiện tại với thời gian khởi động, load các chương trình và dữ liệu được giảm tối đa. Bộ điều khiển Controller mới nhất cho tốc độ đọc và ghi lên đến 500MB/s và 450MB/s (bản 480GB), nhanh hơn gấp 10 lần so với ổ cứng HDD truyền thống, đáp ứng tất cả các nhu cầu của bạn. Ổ cứng SSD Kingston A400 hoạt động bằng bộ nhớ Flash, không có các bộ phận chuyển động cơ quay giúp tăng độ bền, hoạt động mát mẻ và không hề tạo ra bất kì tiếng động nào. Và đặc biệt là khả năng chống Sock cực tốt, rất lý tưởng cho máy tính xách tay và các thiết bị máy tính di động khác. Ổ cứng SSD Kingston A400 có nhiều dung lượng từ 120GB-480GB để cung cấp cho bạn tất cả không gian cần thiết cho các ứng dụng, video, hình ảnh và các tài liệu quan trọng khác. Ổ cứng SSD Kingston A400 được thiết kế để sử dụng trong máy tính để bàn và máy tính xách tay phổ thông, không dành cho các hệ thống Server.',
    brand: '60f92bc86afe600e5467f0d8',
    category: '60f92bc86afe600e5467f0d3',
    price: 750000,
    countInStock: 130,
    rating: 0,
    numReviews: 0,
    slug: 'ssd-kingston-a400-25-inch-sata-iii-120gb-sa400s37120g',
  },
]

export default products
