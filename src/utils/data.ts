import { BookOpen, FlaskConical, ScrollText, Brain, Palette } from 'lucide-react';
import { Book } from '../types';

export const INITIAL_CART_ITEMS = [
  {
    book: {
      id: '1',
      title: 'Kiến Trúc Của Sự Tĩnh Lặng',
      author: 'Haruki Murakami',
      price: 450000,
      originalPrice: 550000,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVgm_6CvvEv8QOgmAy5arWs_TkhSb1JZV7hF_7ik3m04yNvAnRx6kuCZeT6Rw5AUCbuqzfHAEIBfgh6E53bcP76TIdQ9vA6aGIJYDq2AM8fZY5BkFPzLVAOyplFrbkag1tBvvqSxxIQxw5--8wlHwbHuAx5W2ArKxrXDy-4aygNGPvonJ0oLfYsaWpp77KmM_rohGSiz299jS5xrhddSLJolbZM4dMSF_4Sv_HWJSZ6uvc88RUIwx-U1qJRvK83wfNlrvGkzvy-mY',
      category: 'Fiction',
      status: 'Bản in giới hạn' as const
    },
    quantity: 1
  },
  {
    book: {
      id: '2',
      title: 'Lịch Sử Nghệ Thuật Phương Tây',
      author: 'E.H. Gombrich',
      price: 1200000,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABJ8lnthTAcOzKaogwC2KBXZHQhweQ6LBkybcTczIta4agyGQvQmKVlzUcQF18nRRGF5jZffgcIawV61NgtGOVT2kKA1dXWZJ1Mr8806QLYq07IFajg_NLCfaN06kLA35hCxyh0gpF5ukaYFYYcjn-bo_XwON5BVVqNM5xXLZdb_TTTcTEcW3Q1gwRNpKw0b7S0mswDuV1cFYEMnipU6XTFhPQdZy80-I2Z0gPwaVAakDFG27ZY7l2y4ij1KDIVo9opBIMz6f2VPk',
      category: 'Art'
    },
    quantity: 1
  },
  {
    book: {
      id: '3',
      title: 'Triết Lý Thiết Kế Đương Đại',
      author: 'Dieter Rams',
      price: 890000,
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAehIMO0JCOVFDpbxqKZOK-2YFOF4x8QdW5Qql_v1xez9qyUad2W6pBkHEbfA-HzL3cO5rzRK1Xb5RHfPl0cFhbZ0nnMADlxHOalVR4IXOXm4Ojp7LImXzYRfbZiASHopnV-MH8lVFoLbbg8ib2iRRTwNLuJ0tzB28uvb5i-Kk99Ck9OOuMdFzHYiVNONMSnjCtSwRDahKQQSA1XZJd4FiKk5yFDOmWybMdrvAGQr9BP0eefnMgKxAzEG4m7vFW6nlA-DcioA0uCxU',
      category: 'Design'
    },
    quantity: 1
  }
];

// CLIENT DATA
export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Rừng Na Uy',
    author: 'Haruki Murakami',
    price: 185000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMR5rMqCPa4V6p7MicEPu3HRolpLbVBftO8ZUfQKSoTBw7fBREYoTnK2DGu39HDEcSOe2iIzSygYdq7cqSTuwQy1_BXffs_62iYpNL2Mq2Ajov1USOj_Yal_Ws1_vHUIKO8Lb3Rik4pLi4-I-vg85xM8dRmiTfAs_S73aMixVAZvYqAIvuEaobn8GtHD-C4vqYrr0njVvUxTopXWL1CXzx2zBzy_AC4X7jTGbZKC47QoHIAhndfa3mSpyizEmvdoBbrtX5mBHXEnI',
    category: 'Fiction'
  },
  {
    id: '2',
    title: 'Sapiens: Lược Sử Loài Người',
    author: 'Yuval Noah Harari',
    price: 245000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD75qoyjyqS9mNJJ4k-lO3CcRd5MgIOkwruSewbrOMt9TdT3rNiWPSVfkMM0UoFuh4ItM_Z00YMXmgingACnsKb6IjlXzeH3gilD7m1GOyA16cJjOldOuowVOmm9mAJUrgFYhyKWKArREElCMgQ7_GY6pdq-mQIoEJY3T51PWHaCi65X2axPwAHbp8kL2PZ4eLy_ybVw_FyWgiSYkp-zjri0EJ0uhWcEeiW4DSfOfGl_E--byaMpR7P7_g7ESg0xWObzC3ZkGhEMoE',
    category: 'Science'
  },
  {
    id: '3',
    title: 'Người Lạ',
    author: 'Albert Camus',
    price: 110000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBACseAD-jeJNVF8fOxyWUVv3g7S6t4-N5_TOjq2ljSJRI9TIt_7JegQJwB5xV4cvYcnjVVEOwFU67KU5LXtsYigHm_2FYXK9C0Uulqk6TWhlPpvNolOHnUWA_lxVQaeQ6Mw2wyqzfQqZD6QdUvdj-tdF7aQoO8rkHQNL7_8BYC9wU8TbhQcFSbz0XZ4c8wXLtyivTMwB33ljjM-6KLvrdkU_akG_QJL4fKAjlEIr1KLtwWgbJtkmSWbM4vcyywwzOF2PfX5WGO4kg',
    category: 'Philosophy'
  },
  {
    id: '4',
    title: 'Câu Chuyện Nghệ Thuật',
    author: 'E.H. Gombrich',
    price: 520000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtlYkIyZHSl52iANqkMwO2xAyXCbUcapDkmCXqfvEAaHMAlwpcdR66ISryZkmWpkUxEdc9cudCf4jOxTwwWEUVdPnqCeJ1-xkTZXfjM6XR_ElDXA2Hru2ZA98mTC-kSgSJcw4Cm-bOUJffFhM3Qca63FmPt0jNWU7t9xEgnRtB-CKDOr2frrMZw4sJrrejqFinctEJ8sptADX7WXf3p11nZEpm7Mbhoprq9tpqmDNUbLyO9feJV0xfFiL84ImuVu5khINqr2H1Quw',
    category: 'Art'
  },
  {
    id: '5',
    title: 'Súng, Vi Trùng và Thép',
    author: 'Jared Diamond',
    price: 295000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrmyUtDkT97TmC_wj8hT7k8BE7uo31azYaY2aibdWKmuBkhiHAfIPJ453CsEaNnOmNjprvj_ICEwedMt4ett4E2NOSQGnp6FRDg7n9X8nxio4sE4luoqTaZLl3NQxKiLyTZw60umhBBsVA8ENH4PgMJru87W1M5a0LQtSKnR_dmdcAHSoyIeF59qrq1dIufIK6dbHwxTN2aZCnTRVtYe3Tg2aMkm6u8OjGmYYP-UR3Cg5gVlcVyJCva4AQ3bZxjDU8WZX8N-Rfw8',
    category: 'History'
  },
  {
    id: '6',
    title: 'Kafka Bên Bờ Biển',
    author: 'Haruki Murakami',
    price: 210000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCddMVSC50lgCr0eGupdHHUC4A-0CQei8rhVcQic4i1ZBB8p2fTMdMkxHRfIDjR9e-ZSILKrwCX4YFd6s7kp8FRgD80OayHy9_uyNpPEyNBIGMiqu2nwpsFhOVAU9w5P74M72rGiAu1aKre6oPRld_2gcmM-lWVLuUiuUn3fUj0bV57An8y0HT0wIEYb9bu7oVXozfVAGw5QdSZ0xmy5lsgzZSsPTnHnPEv_ZqUSXaWVyMHzhEoU16agLTNkh2seTEyVtfk2RjkjmU',
    category: 'Fiction'
  }
];

export const CATEGORIES = [
  { id: 'Fiction', label: 'Fiction', icon: BookOpen, count: '1,240 Titles' },
  { id: 'Science', label: 'Science', icon: FlaskConical, count: '850 Titles' },
  { id: 'History', label: 'History', icon: ScrollText, count: '620 Titles' },
  { id: 'Philosophy', label: 'Philosophy', icon: Brain, count: '430 Titles' },
  { id: 'Art', label: 'Art', icon: Palette, count: '310 Titles' },
];

export const INITIAL_STORE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Eternal Architect',
    author: 'Kiến trúc, Lịch sử',
    price: 450000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSe0M7fLZG-Lu1ZM6rZRE7rkac95Hgp-omSbbagHnNxmBWurID2S5cTBSvbeZB5l4kpFVxEl0sxTLeAFJcsFJBCJ08KCdoTeWd52kqtth4YkMkUEVBzbtFetiBQ4H0IAHhv0Am285jFVvORVDyq8QdDNaTqJqANWq2NXo3YoarEgjrOrFm2WREOGARjkklW0nCjX1VKSCv_cbbOXMsZXDhnLTGB_rTSi6qrFCQoN1XEiGIrN_ZfF3k3fYh295vHTo0Pyi6qKO3Rik',
    category: 'Architecture',
    stock: 15,
    status: 'Đang bán'
  },
  {
    id: '2',
    title: 'Symphony of the Silence',
    author: 'Văn học, Triết học',
    price: 320000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqeK5S-o7c_0MhhHPC7Pxb0Z1nIk7Yt6DFrAzV5y0ACFdKebZR4UkzELer3jE1GC95dVmNSIk85Z7ieGxH3qZ3Y-Q_tz3aK5QUvZPni9fJnoPT0UXP9kThrYuilqYx8W5C6ZzNUOnlT8VnlDrvS088rrI7XvmJC8OXYCKDtZmKhx7k613TZ0rEZJ7HgQcJ2aErBu1jhZF8GwnujOENCQChvCf-I_SbgcPanym_1P0qbtnc9l0j5aiihPB_MTLh079auFlBX6ORysc',
    category: 'Literature',
    stock: 8,
    status: 'Hết hàng'
  },
  {
    id: '3',
    title: 'Digital Curation 101',
    author: 'Giáo dục, Công nghệ',
    price: 580000,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoALdivub2vkDpCDOUhWEpmOCtHQTP8wIUDNOfH7WNjCC7BcKAEv1Lfd3YB7auiTE3hcIE-_LG3dIDq4W9wd18ng6DRRwBoDGTBbJdzWHTr8sdQBKcbyDqnSW5qows05XzE-5BwA2o3n8y4y7DKYOSPqU0gMyZPPMb_C5Au4gAYoPdBV8LT8L_Md71xCrg6BoMOA80-whc4ZjmfBUSo51y-Q18h0ueofQXEzQfbq3UsxVmxmBHDUtyKSKtoZIBS6_M-imw2yjU16o',
    category: 'Education',
    stock: 24,
    status: 'Đang bán'
  }
];

export const STORE_ORDERS = [
  { id: '#ORD-2026-001', customer: 'Nguyễn Văn A', date: '13/04/2026', total: 450000, status: 'Mới', items: 2 },
  { id: '#ORD-2026-002', customer: 'Trần Thị B', date: '13/04/2026', total: 320000, status: 'Đang xử lý', items: 1 },
  { id: '#ORD-2026-003', customer: 'Lê Hoàng C', date: '12/04/2026', total: 850000, status: 'Đã giao', items: 3 },
  { id: '#ORD-2026-004', customer: 'Phạm D', date: '12/04/2026', total: 150000, status: 'Đã hủy', items: 1 },
  { id: '#ORD-2026-005', customer: 'Hoàng E', date: '11/04/2026', total: 580000, status: 'Mới', items: 1 },
];

export const RECENT_ORDERS = [
  {
    id: '1',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    date: 'May 14, 2024',
    status: 'HOÀN TẤT',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVvRt2tRYAWjq5gfc1dMl6-kv98Ed3dCbPEYWWwUymlVH9JOJ2Z3gu78BR-xB_85Zm1XWehbthujeFA6MaasqsX076Tr9qAXODaLilK0GzPaeE4HVT4M3LLNslCOcoBj8n608D9TwvMYo_tDiBSQr_38NzaJ3VPxIU1cAuOC7VabA7VBOxnmfcBBTUXHm8S_izn3ecotSiqaiGa7Fpm0J8Y0lrgiWmYw_e_WxYXTWfE0JNZWnEvqFRwJjX6p2yEp8mYK1cFPrmgsk'
  },
  {
    id: '2',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    date: 'Apr 22, 2024',
    status: 'HOÀN TẤT',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1410HwIeoUfddPxGkwwhS8uZnTwZbPqjcskzq7mnuvRbRHbaCt4GasLSNl3VKjckhOUqS_a2Kt0PV7UvL284D5eUd7ABD5MTxmGZvqlx-ptBdOmBaWcD3NpzubdewK2aeoNDCBhGYpjaU4gWBzTH2kP0pg1o8B6qMTdmih4fc0UCG0L0ziROl1eeBpPcBXNpftFIh3_HRRrLHjWAR7Na-F2-O4NUITyP7NUGUhceDCb3xEf586kHel5ahQBIafRh5ZpMjWhdUaEQ'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    date: 'Mar 10, 2024',
    status: 'HOÀN TẤT',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKnXUnhWfJZXX8ay6E9-8C83Yv7e0g4co0BuG7A4NY-D4VQSdGloWRDUPxUh47WQ_OFPA9_8THVnycb64GvIX_-u7yJNpn7R0EThFzhZ4PLJYHZbNyq2P7gUaYcDY8uELxs02bXMczpZ3nza48jJIHwd6o0zJZ7YBbvyvLME56v0S7_kD8L1uOyfGgfEoW91ycerhUN_lFkXv2iMMRMvO1OEysHjPULLAkff1fth-j7i7L24ZXTfrRqulwi3ydBAt_ccz5HrpC_mc'
  }
];

// ADMIN DATA
export const adminCategoriesData = [
  { id: '#CAT-001', name: 'Fiction', icon: '📚', count: 412, date: 'Oct 24, 2023' },
  { id: '#CAT-002', name: 'Science', icon: '🔬', count: 156, date: 'Nov 12, 2023' },
  { id: '#CAT-003', name: 'History', icon: '🏛️', count: 284, date: 'Jan 05, 2024' },
  { id: '#CAT-004', name: 'Self-help', icon: '🌱', count: 318, date: 'Feb 18, 2024' },
];

export const adminUsersData = [
  { id: '#UA-2049', name: 'anhdat', email: 'anhdat@gmail.com', role: 'ADMIN', date: 'Oct 24, 2023', status: 'Active', avatar: 'EO' },
  { id: '#UR-8821', name: 'Julian Lefebvre', email: 'julian.reader@gmail.com', role: 'READER', date: 'Nov 12, 2023', status: 'Active', avatar: 'JL' },
  { id: '#UP-0034', name: 'Bloom & Son Books', email: 'partner@bloombooks.co', role: 'PARTNER', date: 'Jan 05, 2024', status: 'Offline', avatar: 'BB' },
  { id: 'PT-9812', name: 'Nhà Sách Tuổi Trẻ', email: 'an.nguyen@tuoitre.vn', role: 'PARTNER', date: 'Mar 15, 2024', status: 'Active', avatar: 'NT' },
  { id: 'PT-3384', name: 'The Literary Hub', email: 'mai.le@lhub.com', role: 'PARTNER', date: 'Apr 02, 2024', status: 'Pending', avatar: 'LH' },
  { id: 'PT-1042', name: 'Sách & Cà Phê', email: 'quan.tran@coffee-books.vn', role: 'PARTNER', date: 'Apr 10, 2024', status: 'Active', avatar: 'SC' },
];

export const adminReviewsData = [
  { id: '#REV-9821', user: 'Jane Duong', avatar: 'J', book: 'The Silent Patient', rating: 5, comment: 'Absolutely captivating. The plot...', date: 'Oct 24, 2023', status: 'approved' },
  { id: '#REV-9815', user: 'Minh Tran', avatar: 'M', book: 'The Alchemist', rating: 5, comment: 'A timeless classic. It changed...', date: 'Oct 23, 2023', status: 'approved' },
  { id: '#REV-8912', user: 'Alex H.', avatar: 'A', book: 'Dune: Part One', rating: 2, comment: 'The book arrived with torn pages. Very disappointed with the shipping.', date: 'Oct 21, 2023', status: 'flagged' },
];

export const adminOrdersData = [
  { id: '#ORD-2901', customer: 'Nguyễn Thành Trung', type: 'Partner', date: '24/10/2023', total: '12.450.000đ', status: 'completed', note: 'Giao hỏa tốc trong sáng...' },
  { id: '#ORD-2855', customer: 'Lê Hồng Minh', type: 'Individual Reader', date: '23/10/2023', total: '850.000đ', status: 'processing', note: '-' },
  { id: '#ORD-2802', customer: 'Phạm Bảo Anh', type: 'Partner', date: '22/10/2023', total: '5.200.000đ', status: 'cancelled', note: 'Hết hàng tồn kho' },
  { id: '#ORD-2679', customer: 'Vũ Hoàng Nam', type: 'Individual Reader', date: '21/10/2023', total: '1.120.000đ', status: 'completed', note: 'Tặng kèm bookmark cao cấp' },
];

export const adminBooksData = [
  { id: '#BK-9871', title: 'The Silent Patient', author: 'Alex Michaelides', category: 'THRILLER', price: '245.000đ', stock: 152, partner: 'NXB Trẻ', image: 'https://picsum.photos/seed/book1/100/150' },
  { id: '#BK-8842', title: 'Bắt Trẻ Đồng Xanh', author: 'J.D. Salinger', category: 'CLASSIC', price: '189.000đ', stock: 12, partner: 'Nhã Nam', image: 'https://picsum.photos/seed/book2/100/150', lowStock: true },
  { id: '#BK-7771', title: 'Atomic Habits', author: 'James Clear', category: 'SELF-HELP', price: '320.000đ', stock: 345, partner: 'NXB Trẻ', image: 'https://picsum.photos/seed/book3/100/150' },
];

export const adminSalesData = [
  { name: 'T2', total: 1200000 },
  { name: 'T3', total: 2100000 },
  { name: 'T4', total: 1800000 },
  { name: 'T5', total: 2400000 },
  { name: 'T6', total: 3200000 },
  { name: 'T7', total: 4500000 },
  { name: 'CN', total: 3800000 },
];

export const adminRecentOrdersData = [
  { id: '#ORD-001', customer: 'Nguyễn Văn A', date: '12/04/2026', total: '450.000đ', status: 'completed' },
  { id: '#ORD-002', customer: 'Trần Thị B', date: '12/04/2026', total: '1.200.000đ', status: 'processing' },
  { id: '#ORD-003', customer: 'Lê Văn C', date: '11/04/2026', total: '320.000đ', status: 'completed' },
  { id: '#ORD-004', customer: 'Phạm Thị D', date: '11/04/2026', total: '850.000đ', status: 'cancelled' },
  { id: '#ORD-005', customer: 'Hoàng Văn E', date: '10/04/2026', total: '2.100.000đ', status: 'completed' },
];

export const adminTopBooksData = [
  { id: 1, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', sales: 124, price: '85.000đ', image: 'https://picsum.photos/seed/book1/100/150' },
  { id: 2, title: 'Nhà Giả Kim', author: 'Paulo Coelho', sales: 98, price: '79.000đ', image: 'https://picsum.photos/seed/book2/100/150' },
  { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', sales: 85, price: '150.000đ', image: 'https://picsum.photos/seed/book3/100/150' },
];
